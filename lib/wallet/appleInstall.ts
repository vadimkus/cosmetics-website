import type { WalletLocale } from '@/lib/wallet/tokens'

type AppleInstallCopy = {
  openingTitle: string
  openingBody: string
  addedTitle: string
  addedBody: string
  returnToApp: string
  returnToAccount: string
  retry: string
}

const COPY: Record<WalletLocale, AppleInstallCopy> = {
  en: {
    openingTitle: 'Opening Apple Wallet',
    openingBody:
      'Finish adding your GENOSYS Rewards card in Apple Wallet. This page will confirm when it is ready.',
    addedTitle: 'Added to Apple Wallet',
    addedBody: 'Your GENOSYS Rewards card is ready and will update automatically.',
    returnToApp: 'Return to GENOSYS',
    returnToAccount: 'Back to my account',
    retry: 'Open Apple Wallet again',
  },
  ru: {
    openingTitle: 'Открываем Apple Wallet',
    openingBody:
      'Завершите добавление карты GENOSYS Rewards в Apple Wallet. На этой странице появится подтверждение.',
    addedTitle: 'Добавлено в Apple Wallet',
    addedBody: 'Ваша карта GENOSYS Rewards готова и будет обновляться автоматически.',
    returnToApp: 'Вернуться в GENOSYS',
    returnToAccount: 'Вернуться в личный кабинет',
    retry: 'Открыть Apple Wallet ещё раз',
  },
  ar: {
    openingTitle: 'جارٍ فتح Apple Wallet',
    openingBody:
      'أكمل إضافة بطاقة GENOSYS Rewards في Apple Wallet. ستظهر رسالة التأكيد في هذه الصفحة.',
    addedTitle: 'تمت الإضافة إلى Apple Wallet',
    addedBody: 'بطاقة GENOSYS Rewards جاهزة وسيتم تحديثها تلقائياً.',
    returnToApp: 'العودة إلى GENOSYS',
    returnToAccount: 'العودة إلى حسابي',
    retry: 'فتح Apple Wallet مرة أخرى',
  },
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function scriptValue(value: string | boolean): string {
  return JSON.stringify(value)
    .replaceAll('<', '\\u003c')
    .replaceAll('>', '\\u003e')
    .replaceAll('&', '\\u0026')
}

export function renderAppleInstallLanding(input: {
  locale: WalletLocale
  passUrl: string
  statusUrl: string
  nativeApp: boolean
}): string {
  const copy = COPY[input.locale]
  const direction = input.locale === 'ar' ? 'rtl' : 'ltr'
  const returnHref = input.nativeApp
    ? 'genosys://wallet-complete?status=returned'
    : '/profile'
  const returnLabel = input.nativeApp ? copy.returnToApp : copy.returnToAccount

  return `<!doctype html>
<html lang="${input.locale}" dir="${direction}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <meta name="theme-color" content="#fffaf7">
  <title>${escapeHtml(copy.openingTitle)}</title>
  <style>
    :root { color-scheme: light; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    * { box-sizing: border-box; }
    body {
      min-height: 100vh;
      margin: 0;
      display: grid;
      place-items: center;
      padding: max(24px, env(safe-area-inset-top)) 20px max(24px, env(safe-area-inset-bottom));
      color: #201a19;
      background:
        radial-gradient(circle at top, rgba(174, 41, 54, 0.08), transparent 38%),
        #fffaf7;
    }
    main {
      width: min(100%, 430px);
      padding: 34px 28px 28px;
      text-align: center;
      background: rgba(255, 255, 255, 0.94);
      border: 1px solid rgba(92, 67, 64, 0.12);
      border-radius: 26px;
      box-shadow: 0 18px 55px rgba(75, 48, 45, 0.12);
    }
    .brand {
      margin: 0 0 26px;
      color: #a62d3b;
      font-size: 13px;
      font-weight: 750;
      letter-spacing: 0.18em;
    }
    .status {
      width: 66px;
      height: 66px;
      margin: 0 auto 22px;
      display: grid;
      place-items: center;
      border-radius: 50%;
      color: #a62d3b;
      background: #f9e9e9;
    }
    .spinner {
      width: 27px;
      height: 27px;
      border: 3px solid rgba(166, 45, 59, 0.22);
      border-top-color: #a62d3b;
      border-radius: 50%;
      animation: spin 0.9s linear infinite;
    }
    .check {
      display: none;
      width: 30px;
      height: 18px;
      border-left: 4px solid #257a4e;
      border-bottom: 4px solid #257a4e;
      transform: rotate(-45deg) translate(2px, -2px);
    }
    body[data-added="true"] .status { color: #257a4e; background: #e7f4ec; }
    body[data-added="true"] .spinner { display: none; }
    body[data-added="true"] .check { display: block; }
    h1 { margin: 0; font-size: 25px; line-height: 1.18; letter-spacing: -0.02em; }
    p { margin: 12px auto 26px; color: #6f6260; font-size: 15px; line-height: 1.55; }
    .actions { display: grid; gap: 11px; }
    a, button {
      min-height: 50px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 12px 18px;
      border-radius: 999px;
      font: inherit;
      font-size: 15px;
      font-weight: 650;
      text-decoration: none;
      cursor: pointer;
    }
    a { color: white; background: #201a19; border: 1px solid #201a19; }
    button { color: #6f6260; background: white; border: 1px solid rgba(92, 67, 64, 0.2); }
    @keyframes spin { to { transform: rotate(360deg); } }
    @media (prefers-reduced-motion: reduce) { .spinner { animation: none; } }
  </style>
</head>
<body>
  <main>
    <div class="brand">GENOSYS REWARDS</div>
    <div class="status" aria-hidden="true"><span class="spinner"></span><span class="check"></span></div>
    <h1 id="status-title">${escapeHtml(copy.openingTitle)}</h1>
    <p id="status-body">${escapeHtml(copy.openingBody)}</p>
    <div class="actions">
      <a id="return-link" href="${escapeHtml(returnHref)}">${escapeHtml(returnLabel)}</a>
      <button id="retry-button" type="button">${escapeHtml(copy.retry)}</button>
    </div>
  </main>
  <script>
    const passUrl = ${scriptValue(input.passUrl)};
    const statusUrl = ${scriptValue(input.statusUrl)};
    const nativeApp = ${scriptValue(input.nativeApp)};
    const addedTitle = ${scriptValue(copy.addedTitle)};
    const addedBody = ${scriptValue(copy.addedBody)};
    let finished = false;
    let activeShown = false;
    let attempts = 0;

    function launchPass() {
      document.getElementById('wallet-pass-frame')?.remove();
      const frame = document.createElement('iframe');
      frame.id = 'wallet-pass-frame';
      frame.title = '';
      frame.setAttribute('aria-hidden', 'true');
      frame.style.cssText = 'position:fixed;width:0;height:0;border:0;opacity:0;pointer-events:none';
      frame.src = passUrl + '&attempt=' + Date.now();
      document.body.appendChild(frame);
    }

    function showAdded() {
      activeShown = true;
      document.body.dataset.added = 'true';
      document.getElementById('status-title').textContent = addedTitle;
      document.getElementById('status-body').textContent = addedBody;
      document.title = addedTitle;
    }

    async function checkInstallation() {
      if (finished || attempts >= 30) return;
      attempts += 1;
      try {
        const response = await fetch(statusUrl, {
          cache: 'no-store',
          credentials: 'omit',
          headers: { Accept: 'application/json' }
        });
        const result = await response.json();
        if (result?.added === true) {
          finished = true;
          showAdded();
          if (nativeApp) {
            setTimeout(() => {
              window.location.assign('genosys://wallet-complete?status=added');
            }, 900);
          }
          return;
        }
        if (result?.activeInWallet === true && !activeShown) showAdded();
      } catch {
        // Keep the visible return and retry controls available.
      }
      setTimeout(checkInstallation, 3000);
    }

    document.getElementById('retry-button').addEventListener('click', launchPass);
    setTimeout(launchPass, 450);
    setTimeout(checkInstallation, 1800);
  </script>
</body>
</html>`
}
