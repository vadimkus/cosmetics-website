"""Build a labelled contact sheet from a list of public image paths."""
import sys
from PIL import Image, ImageDraw

CELL = 420
LABEL = 34


def main():
    out = sys.argv[1]
    paths = sys.argv[2:]
    cols = min(4, len(paths))
    rows = (len(paths) + cols - 1) // cols
    sheet = Image.new('RGB', (cols * CELL, rows * (CELL + LABEL)), 'white')
    draw = ImageDraw.Draw(sheet)
    for i, rel in enumerate(paths):
        fp = 'public' + rel
        try:
            im = Image.open(fp).convert('RGB')
        except Exception as e:
            print('SKIP', rel, e)
            continue
        im.thumbnail((CELL - 8, CELL - 8))
        x = (i % cols) * CELL
        y = (i // cols) * (CELL + LABEL)
        sheet.paste(im, (x + (CELL - im.width) // 2, y + LABEL + (CELL - LABEL - im.height) // 2))
        draw.text((x + 6, y + 8), rel.split('/')[-1], fill='black')
        draw.rectangle([x, y, x + CELL - 1, y + CELL + LABEL - 1], outline='#cccccc')
    sheet.save(out, quality=82)
    print('wrote', out, sheet.size)


main()
