import { existsSync, realpathSync } from 'node:fs'
import path from 'node:path'

describe('PDF asset paths', () => {
  it('deploys the EyeCell Eye Zone guide under the case-sensitive PPT path', () => {
    const pptDirectory = path.join(process.cwd(), 'public', 'documents', 'PPT')
    const pdfPath = path.join(
      pptDirectory,
      'GENOSYS EyeCell EYE ZONE CARE SYSTEM.pdf'
    )

    expect(path.basename(realpathSync(pptDirectory))).toBe('PPT')
    expect(existsSync(pdfPath)).toBe(true)
  })
})
