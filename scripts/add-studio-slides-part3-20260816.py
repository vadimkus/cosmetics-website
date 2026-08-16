"""Third pass: the two thin galleries that still had an unused image."""
exec(open('scripts/add-studio-slides-to-pages-20260816.py').read().split('for path, cfg in PAGES.items():')[0])

HOWTO_ONLY = {
    'components/product/bioferment/BioFermentProductPage.tsx': {
        'const': "const HOWTO_IMAGE = '/images/bio_ferment/bferment_model.jpg'",
        'anchor': "const ENGINE_IMAGE = '/images/BFAD.png'",
        'comment': (
            "/** The model shot from the gallery, so the how-to shows the mask on a face\n"
            " *  rather than describing it. ferment_high.jpeg leads on six growth-factor\n"
            " *  peptides, which this page does not claim, so it stays in the thumbs and\n"
            " *  is queued for re-export. */"
        ),
    },
    'components/product/srs/SrsProductPage.tsx': {
        'const': "const HOWTO_IMAGE = '/images/Second/sss2.jpg'",
        'anchor': "const ENGINE_IMAGE = '/images/Second/sss1.jpg'",
        'comment': "/** The single-vial shot, so the how-to shows the vial that gets opened. */",
    },
}

for path, cfg in HOWTO_ONLY.items():
    src = open(path).read()
    src = src.replace(cfg['anchor'], cfg['anchor'] + '\n\n' + cfg['comment'] + '\n' + cfg['const'], 1)

    _, open_end, end = section_bounds(src, HOWTO_MARK)
    open_tag_start = src.index('<section className="', src.index(HOWTO_MARK))
    new_open = src[open_tag_start:open_end].replace('max-w-[900px]', 'max-w-[1200px]')
    body = src[open_end:end]
    figure = (FIGURE % ('HOWTO_IMAGE', 'copy.howTo.title')).rsplit('          <div>\n', 1)[0]
    src = src[:open_tag_start] + new_open + figure + body + '\n        </div>' + src[end:]

    open(path, 'w').write(src)
    print('updated', path)
