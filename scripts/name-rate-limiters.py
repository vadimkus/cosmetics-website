#!/usr/bin/env python3
"""
Gives every rateLimitSimple a name, and drops the prefixes call sites were
adding by hand.

The name goes on the limiter rather than the identifier so a new route cannot
forget it: the option is required, so the compiler asks. Where a call site was
already prefixing correctly, its prefix becomes the name, so those counters
carry on under the key they already use.

  python3 scripts/name-rate-limiters.py           # report
  python3 scripts/name-rate-limiters.py --apply
"""

import re
import sys

APPLY = '--apply' in sys.argv

# route file -> (name, prefix the call site was adding by hand, if any)
LIMITERS = {
    # Already namespaced by hand. Keep the same string so live counters survive.
    'app/api/skin-analysis/route.ts': ('skin', 'skin'),
    'app/api/skin-analysis/ai/route.ts': ('skin-ai', 'skin-ai'),
    'app/api/stripe/create-payment-intent/route.ts': ('pi', 'pi'),
    'app/api/stripe/create-checkout-session/route.ts': ('cs', 'cs'),
    'app/api/analytics/track-pdf-download/route.ts': ('pdf', 'pdf'),
    'app/api/partners/order/route.ts': ('partner-order', 'partner-order'),
    'app/api/newsletter/subscribe/route.ts': ('newsletter', 'newsletter'),
    'app/api/homecare/[token]/route.ts': ('homecare-public', 'homecare-public'),
    'app/api/orders/cod-confirmation/route.ts': ('cod', 'cod'),
    'app/api/partner/homecare-scripts/route.ts': ('homecare-create', 'homecare-create'),

    # Never namespaced: these are the ones that were sharing a bucket.
    'app/api/auth/login/route.ts': ('login', None),
    'app/api/auth/register/route.ts': ('register', None),
    'app/api/auth/forgot-password/route.ts': ('forgot-password', None),
    'app/api/auth/admin-login/route.ts': ('admin-login', None),
    'app/api/auth/google/route.ts': ('google', None),
    'app/api/auth/google/callback/route.ts': ('google-callback', None),
    'app/api/auth/google/verify/route.ts': ('google-verify', None),
    'app/api/auth/apple/route.ts': ('apple', None),
    'app/api/auth/apple/callback/route.ts': ('apple-callback', None),
    'app/api/mobile/auth/login/route.ts': ('mobile-login', None),
    'app/api/mobile/auth/register/route.ts': ('mobile-register', None),
    'app/api/mobile/auth/forgot-password/route.ts': ('mobile-forgot-password', None),
    'app/api/mobile/auth/reset-password/route.ts': ('mobile-reset-password', None),
    'app/api/mobile/auth/google/route.ts': ('mobile-google', None),
    'app/api/orders/track/[orderNumber]/route.ts': ('order-track', None),
}

# Two limiters in one file, so they are named by the prefix each already used.
CHAT = 'app/api/chat/route.ts'


def add_name(src: str, name: str) -> tuple[str, int]:
    """Put `name:` as the first option of every rateLimitSimple({ ... })."""
    # Multi-line: rateLimitSimple({\n  windowMs: ...
    block = re.compile(r'(rateLimitSimple\(\{[ \t]*\n)([ \t]*)')
    src, n = block.subn(lambda m: f"{m.group(1)}{m.group(2)}name: '{name}',\n{m.group(2)}", src)
    if n:
        return src, n
    # Single line: rateLimitSimple({ windowMs: ..., max: ... })
    inline = re.compile(r'rateLimitSimple\(\{[ \t]+')
    return inline.subn(f"rateLimitSimple({{ name: '{name}', ", src)


def drop_prefix(src: str, prefix: str) -> tuple[str, int]:
    """`limiter(`p:${id}`)` -> `limiter(id)`, now the limiter carries the name."""
    n = 0
    # Template with the prefix and nothing else interpolated.
    simple = re.compile(r'`' + re.escape(prefix) + r':\$\{([^{}]+)\}`')
    src, c = simple.subn(r'\1', src)
    n += c
    # The partner one interpolates a user id between prefix and identifier.
    keyed = re.compile(r'`' + re.escape(prefix) + r':(\$\{[^{}]+\}:\$\{[^{}]+\})`')
    src, c = keyed.subn(lambda m: '`' + m.group(1) + '`', src)
    n += c
    return src, n


def main() -> None:
    changed = 0
    for path, (name, prefix) in LIMITERS.items():
        with open(path) as handle:
            src = handle.read()
        original = src

        src, added = add_name(src, name)
        dropped = 0
        if prefix:
            src, dropped = drop_prefix(src, prefix)

        if added != 1:
            print(f'!! {path}: expected 1 limiter, found {added}')
        if prefix and dropped != 1:
            print(f'!! {path}: expected to drop 1 prefix, dropped {dropped}')

        print(f"{'name+strip' if prefix else 'name      '}  {name:<24} {path}")
        if src != original:
            changed += 1
            if APPLY:
                with open(path, 'w') as handle:
                    handle.write(src)

    # chat has a burst and a daily limiter in the one file.
    with open(CHAT) as handle:
        src = handle.read()
    original = src
    src = src.replace(
        "const chatBurstLimiter = rateLimitSimple({\n",
        "const chatBurstLimiter = rateLimitSimple({\n  name: 'chat',\n", 1)
    src = src.replace(
        "const chatDailyLimiter = rateLimitSimple({\n",
        "const chatDailyLimiter = rateLimitSimple({\n  name: 'chat-daily',\n", 1)
    src = src.replace('chatBurstLimiter(`chat:${clientId}`)', 'chatBurstLimiter(clientId)')
    src = src.replace('chatDailyLimiter(`chat-daily:${clientId}`)', 'chatDailyLimiter(clientId)')
    print(f'name+strip  chat, chat-daily          {CHAT}')
    if src != original:
        changed += 1
        if APPLY:
            with open(CHAT, 'w') as handle:
                handle.write(src)

    print(f"\n{changed} files {'updated' if APPLY else 'would change'}")
    if not APPLY:
        print('dry run. Re-run with --apply')


if __name__ == '__main__':
    main()
