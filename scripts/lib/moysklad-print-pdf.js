/**
 * Print GENOSYS MoySklad PDFs in landscape (horizontal) via CUPS `lp`.
 *
 * orientation-requested=4 — IPP landscape (required for all invoices / notes).
 *
 * Call only when the user explicitly requested print (script flag --print).
 */
const { execFileSync, spawnSync } = require('child_process')

function printPdfLandscape(pdfPath) {
  if (process.platform !== 'darwin') {
    console.warn('  printPdfLandscape: non-macOS — skipping lp')
    return false
  }
  const whichLp = spawnSync('which', ['lp'], { encoding: 'utf8' })
  if (whichLp.status !== 0 || !whichLp.stdout.trim()) {
    console.warn('  lp not found — opening PDF for manual print')
    execFileSync('open', [pdfPath], { stdio: 'inherit' })
    return false
  }
  try {
    execFileSync('lp', ['-o', 'orientation-requested=4', pdfPath], { stdio: 'inherit' })
    console.log('  Sent to default printer (lp, landscape).')
    return true
  } catch (e) {
    console.warn('  lp failed, opening PDF:', e.message)
    execFileSync('open', [pdfPath], { stdio: 'inherit' })
    return false
  }
}

module.exports = { printPdfLandscape }
