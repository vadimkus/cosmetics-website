import { chromium } from 'playwright'
const b = await chromium.launch()
for (const [name,url] of [['en','http://localhost:3100/products/61'],['ru','http://localhost:3100/ru/products/61'],['ar','http://localhost:3100/ar/products/61']]) {
  const page = await b.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2 })
  const errs=[]; page.on('pageerror',e=>errs.push(e.message)); page.on('console',m=>{if(m.type()==='error')errs.push(m.text())})
  await page.goto(url, { waitUntil: 'networkidle', timeout: 180000 })
  await page.addStyleTag({ content: '.cera-reveal{opacity:1!important;transform:none!important}' })
  // open every FAQ row so the answers are captured
  for (const btn of await page.$$('[aria-expanded="false"]')) { await btn.click().catch(()=>{}) }
  await page.waitForTimeout(500)
  const faq = await page.$$('div.cera-page > section')
  const target = faq[faq.length-3]
  if (target) await target.screenshot({ path: `/tmp/shots61/${name}-faq.png` })
  console.log(name, errs.length? 'ERRORS '+JSON.stringify(errs.slice(0,3)) : 'clean')
  await page.close()
}
await b.close()
