"""Second pass: pages that share the template but name their figure differently."""
import re

exec(open('scripts/add-studio-slides-to-pages-20260816.py').read().split('for path, cfg in PAGES.items():')[0])

PAGES2 = {
    'components/product/scalpbrush/ScalpBrushProductPage.tsx': {
        'anchor': 'DESIGN_IMAGE',
        'folder': '/images/brush/',
        'slides': ['s1.jpg', 's2.jpg', 's3.jpg', 's4.jpg'],
        'effects': 's3.jpg',
        'howto': 's2.jpg',
        'engine_contain': False,
        'comment': (
            '/** Studio slides go on the page, not only in the thumbs. s4 is the\n'
            ' *  two-view shot that shows the domed grip and the silicone head at once,\n'
            ' *  so it stays beside the design section. s3 is the shelf shot, s2 the\n'
            ' *  brush-then-tonic routine. s1 still prints +50% absorption and a\n'
            ' *  circulation line this page does not claim, so it runs in the lookbook\n'
            ' *  only and is queued for re-export. */'
        ),
    },
}


def apply2(path, cfg):
    src = open(path).read()
    anchor = cfg['anchor']
    m = re.search(r"(/\*\*(?:[^*]|\*(?!/))*\*/\n)?const %s = '([^']+)'" % anchor, src)
    if not m:
        raise SystemExit('no %s in %s' % (anchor, path))
    keep = m.group(2)
    src = src[:m.start()] + build_consts(cfg) + "\nconst %s = '%s'" % (anchor, keep) + src[m.end():]

    src = src.replace(EFFECTS_MARK, LOOKBOOK.lstrip('\n') + '\n' + EFFECTS_MARK, 1)

    if cfg['effects']:
        _, open_end, end = section_bounds(src, EFFECTS_MARK)
        body = src[open_end:end]
        src = src[:open_end] + FIGURE % ('EFFECTS_IMAGE', 'copy.effects.title') + body \
            + '\n          </div>\n        </div>' + src[end:]

    _, open_end, end = section_bounds(src, HOWTO_MARK)
    open_tag_start = src.index('<section className="', src.index(HOWTO_MARK))
    new_open = src[open_tag_start:open_end].replace('max-w-[900px]', 'max-w-[1200px]')
    body = src[open_end:end]
    figure = (FIGURE % ('HOWTO_IMAGE', 'copy.howTo.title')).rsplit('          <div>\n', 1)[0]
    src = src[:open_tag_start] + new_open + figure + body + '\n        </div>' + src[end:]

    open(path, 'w').write(src)
    print('updated', path)


for path, cfg in PAGES2.items():
    apply2(path, cfg)
