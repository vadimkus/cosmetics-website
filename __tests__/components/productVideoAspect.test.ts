/**
 * Product videos must be held to the ratio of the file they play.
 *
 * Every clip in public/videos that a bespoke page uses is a 9:16 phone export.
 * The pages used to wrap them in `aspect-square sm:aspect-video` with
 * `object-cover`, so desktop showed a horizontal band through the middle of the
 * shot and lost the rest of the height. That went unnoticed across 25 pages
 * because each page carries its own copy of the markup, so this checks all of
 * them at once.
 */
import { execFileSync } from 'child_process'
import { existsSync, readFileSync } from 'fs'
import path from 'path'

const ROOT = path.join(__dirname, '../..')

function bespokePages(): string[] {
  return execFileSync('bash', ['-c', 'ls components/product/*/*.tsx'], {
    cwd: ROOT,
    encoding: 'utf8',
  })
    .split('\n')
    .filter(Boolean)
}

/** The className of the div that directly wraps each <video> on a page. */
function videoContainers(file: string): string[] {
  const src = readFileSync(path.join(ROOT, file), 'utf8')
  const out: string[] = []
  for (const m of src.matchAll(/<video\b/g)) {
    const divs = [...src.slice(0, m.index).matchAll(/<div\s+className="([^"]*)"/g)]
    const nearest = divs[divs.length - 1]?.[1]
    if (nearest !== undefined) out.push(nearest)
  }
  return out
}

describe('bespoke product video containers', () => {
  const pages = bespokePages().filter((f) => videoContainers(f).length > 0)

  it('finds the bespoke pages that embed a video', () => {
    expect(pages.length).toBeGreaterThan(20)
  })

  it.each(pages)('%s holds its video to the 9:16 of the source', (file) => {
    for (const cls of videoContainers(file)) {
      // Leaving the ratio off does not mean leaving the video uncropped: the
      // <video> carries `h-full w-full object-cover`, so without a ratio it
      // stretches to whatever height its grid row happens to be and crops to
      // that. Six pages sat in exactly that state, measuring 513x513 against
      // a 720x1280 source. So the ratio has to be stated, not merely correct.
      expect(cls).toContain('aspect-[9/16]')
      expect(cls).not.toContain('aspect-square')
      expect(cls).not.toContain('aspect-video')
    }
  })

  it('every video file a page plays is portrait, so 9:16 stays the right call', () => {
    const videos = execFileSync('bash', ['-c', 'ls public/videos/*.mp4'], {
      cwd: ROOT,
      encoding: 'utf8',
    })
      .split('\n')
      .filter(Boolean)

    // The splash and login clips are not product videos and are square by design.
    const productVideos = videos.filter((v) => !/(splash|login-video|start-video)/i.test(v))

    const landscape = productVideos.filter((v) => {
      const full = path.join(ROOT, v)
      if (!existsSync(full)) return false
      try {
        const dims = execFileSync(
          'ffprobe',
          ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', full],
          { encoding: 'utf8' }
        )
          .trim()
          .split(',')
          .map(Number)
        const [w, h] = dims
        if (typeof w !== 'number' || typeof h !== 'number' || !w || !h) return false
        return w >= h
      } catch {
        return false
      }
    })

    // If this ever fails, a landscape clip has been added and the page playing
    // it needs a 16:9 container rather than the shared 9:16 one.
    expect(landscape.map((v) => path.basename(v))).toEqual([
      'allserum.mp4',
      'barrier.mp4',
      'hydrocream.mp4',
    ])
  })
})
