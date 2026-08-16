"""Swap the product 29 blocks in the AR and RU translation files.

Values are imported from the applied DB script so the three surfaces cannot
drift apart.
"""
import json
import re
import subprocess

node = subprocess.run(
    ['npx', 'tsx', '--env-file=.env.local', 'scripts/tmp-dump-product-31-locales.ts'],
    capture_output=True, text=True, cwd='.',
)
if '___JSON___' not in node.stdout:
    raise SystemExit('dump failed:\n' + node.stdout + node.stderr)
data = json.loads(node.stdout.split('___JSON___', 1)[1])
AR, RU = data['AR'], data['RU']

KEYS = ['description', 'productDetails', 'keyFeatures', 'benefits', 'ingredients', 'howToUse', 'directions']


def dq(s):
    return json.dumps(s, ensure_ascii=False)


def swap(path, key, quote, values, next_key):
    src = open(path).read()
    open_tok = f'  {quote}{key}{quote}: {{\n'
    start = src.index(open_tok)
    end = re.compile(rf'^  {quote}{next_key}{quote}: \{{\n', re.M).search(src, start).start()
    lines = [f'  {quote}{key}{quote}: {{']
    for i, k in enumerate(KEYS):
        comma = ',' if i < len(KEYS) - 1 else ''
        name = f'{quote}{k}{quote}' if quote == '"' else k
        lines.append(f'    {name}: {dq(values[k])}{comma}')
    lines.append('  },')
    src = src[:start] + '\n'.join(lines) + '\n' + src[end:]
    open(path, 'w').write(src)
    print('updated', path)


swap('data/productTranslations.ts', '31', "'", AR, '32')
swap('data/productTranslationsRu.ts', '31', '"', RU, '32')
