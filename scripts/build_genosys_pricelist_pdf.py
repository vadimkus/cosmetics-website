#!/usr/bin/env python3
"""Build a premium GENOSYS UAE Clinics price list PDF from the normalized CSV.

Improvements over the first version:
- Branded cover with colour bands and the GENOSYS wordmark.
- Auto-generated, clickable Table of Contents with real page numbers (multiBuild).
- "Page X of Y" footers via a numbered canvas; running header on content pages.
- Refined typography, tinted price column, Personal/Professional tags.
- Section dividers, category chips, alternating rows, no page overlap.
- Closing price-summary page (count / low / high per category) + ordering note.
"""
from collections import OrderedDict
from pathlib import Path
import csv
import re

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas as canvasmod
from reportlab.platypus import (
    BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer, Table, TableStyle,
    PageBreak, HRFlowable, CondPageBreak, NextPageTemplate, Image as RLImage,
)
from reportlab.platypus.tableofcontents import TableOfContents
from PIL import Image as PILImage

BASE = Path('/Users/vadimkus/cosmetics-website')
CSV_PATH = BASE / 'docs/GENOSYS_UAE_PriceList_Clinics_2026_normalized.csv'
WORDMARK = BASE / 'public/images/genosys-wordmark-transparent.png'
IMG_DIR = BASE / 'scripts/genosys_product_images'
PROMO_DIR = BASE / 'scripts/genosys_promo_assets'
SOURCE_XLSX = Path('/Users/vadimkus/Desktop/GENOSYS_UAE_PriceList_Clinics_2026.xlsx')
OUT_PDF = Path('/Users/vadimkus/Desktop/GENOSYS_UAE_Price_List_Clinics_2026.pdf')

# Official GENOSYS UAE storefront + app links (confirmed in live code & docs).
WEB_URL = 'https://genosys.ae'
IOS_URL = 'https://apps.apple.com/ae/app/genosys-uae/id6756648064'
ANDROID_URL = 'https://play.google.com/store/apps/details?id=ae.genosys.app'

# ---- Palette --------------------------------------------------------------
PRIMARY = colors.HexColor('#1F3A34')   # deep clinical green
PRIMARY_DK = colors.HexColor('#152822')
ACCENT = colors.HexColor('#B6862C')    # gold
CHIP = colors.HexColor('#33574E')      # lighter green for category chips
LIGHT = colors.HexColor('#F6F4EF')     # warm off-white row tint
PRICEBG = colors.HexColor('#EFE7D6')   # gold-tinted price cell
LINE = colors.HexColor('#DED9CD')
INK = colors.HexColor('#1c1c1c')
MUTE = colors.HexColor('#6c6c6c')

# ---- Fonts ----------------------------------------------------------------
REG, BLD = 'Helvetica', 'Helvetica-Bold'
for name, path in [('GxReg', '/System/Library/Fonts/Supplemental/Arial Unicode.ttf'),
                   ('GxReg', '/Library/Fonts/Arial Unicode.ttf')]:
    if Path(path).exists():
        try:
            pdfmetrics.registerFont(TTFont(name, path)); REG = name; break
        except Exception:
            pass
for name, path in [('GxBold', '/System/Library/Fonts/Supplemental/Arial Bold.ttf'),
                   ('GxBold', '/Library/Fonts/Arial Bold.ttf')]:
    if Path(path).exists():
        try:
            pdfmetrics.registerFont(TTFont(name, path)); BLD = name; break
        except Exception:
            pass


def esc(text):
    """Escape XML and convert sub/superscripts so glyphs render in any font."""
    s = '' if text is None else str(text)
    s = re.sub(r'\s+', ' ', s.strip())
    s = s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
    subs = {'\u2082': '<sub>2</sub>', '\u2083': '<sub>3</sub>',
            '\u00b2': '<super>2</super>', '\u00b3': '<super>3</super>'}
    for k, v in subs.items():
        s = s.replace(k, v)
    return s


# ---- Styles ---------------------------------------------------------------
ss = getSampleStyleSheet()
def style(name, **kw):
    ss.add(ParagraphStyle(name=name, **kw))

style('Sec', parent=ss['Heading1'], fontName=BLD, fontSize=15, leading=20,
      textColor=colors.white, backColor=PRIMARY, borderPadding=9,
      spaceBefore=0, spaceAfter=0, leftIndent=0)
style('Cat', fontName=BLD, fontSize=9.5, leading=12, textColor=colors.white)
style('TH', fontName=BLD, fontSize=7.3, leading=8.4, textColor=colors.white, alignment=TA_CENTER)
style('Prod', fontName=BLD, fontSize=8.2, leading=9.6, textColor=INK,
      wordWrap='CJK', splitLongWords=True)
style('Cell', fontName=REG, fontSize=7.7, leading=9.3, textColor=colors.HexColor('#33332f'),
      wordWrap='CJK', splitLongWords=True)
style('CellC', fontName=REG, fontSize=7.7, leading=9.3, textColor=colors.HexColor('#33332f'),
      wordWrap='CJK', splitLongWords=True, alignment=TA_CENTER)
style('Price', fontName=BLD, fontSize=8.6, leading=10, textColor=PRIMARY_DK, alignment=TA_CENTER)
style('Note', fontName=REG, fontSize=8.4, leading=12, textColor=MUTE, spaceBefore=3)
style('Lead', fontName=REG, fontSize=9.5, leading=14, textColor=colors.HexColor('#3a3a3a'))
style('TOCSection', fontName=BLD, fontSize=11, leading=16, textColor=PRIMARY)
# TOC entry style
style('TOC0', fontName=REG, fontSize=10.5, leading=20, textColor=INK,
      leftIndent=6, firstLineIndent=-6)
# App / website promo buttons
style('BtnTop', fontName=REG, fontSize=7.4, leading=9, textColor=colors.white, alignment=TA_CENTER)
style('BtnMain', fontName=BLD, fontSize=11.5, leading=14, textColor=colors.white, alignment=TA_CENTER)
style('BtnUrl', fontName=REG, fontSize=7.6, leading=10, textColor=PRIMARY, alignment=TA_CENTER)
style('QrCap', fontName=BLD, fontSize=8.4, leading=11, textColor=INK, alignment=TA_CENTER)
style('BandTitle', fontName=BLD, fontSize=12.5, leading=15, textColor=colors.white, alignment=TA_CENTER)
style('BandSub', fontName=REG, fontSize=9.5, leading=13, textColor=colors.HexColor('#D9E0DC'), alignment=TA_CENTER)


def P(text, st='Cell'):
    return Paragraph(esc(text), ss[st])


PHOTO_BOX_W = 15 * mm
PHOTO_BOX_H = 13 * mm
_img_size_cache = {}


def photo_cell(row_no):
    """Return an Image flowable scaled to fit the photo box, or '' if none."""
    fp = IMG_DIR / f'row_{row_no}.png'
    if not fp.exists():
        return ''
    try:
        if fp not in _img_size_cache:
            with PILImage.open(fp) as im:
                _img_size_cache[fp] = im.size
        iw, ih = _img_size_cache[fp]
        scale = min(PHOTO_BOX_W / iw, PHOTO_BOX_H / ih)
        return RLImage(str(fp), width=iw * scale, height=ih * scale)
    except Exception:
        return ''


# ---- Read data ------------------------------------------------------------
rows = []
with CSV_PATH.open(encoding='utf-8') as f:
    for r in csv.DictReader(f):
        rows.append(r)

by_cat = OrderedDict()
for r in rows:
    by_cat.setdefault(r['category'], []).append(r)

GROUPS = OrderedDict([
    ('Microneedling Rollers & Stamps', [
        'GENOSYS Detachable Manual Roller (Head part is detachable, handle is autoclavable)',
        'GENOSYS Vibrating Roller (Vibrating, Head part is detachable)',
        'GENOSYS Stamp (Stamp, handle is not detachable)',
        'GENOSYS Eye Roller (One-body type, head part is not detachable)',
        'GENOSYS Manual Roller (One-body type, handle is not detachable)',
    ]),
    ('Professional Treatment Products', [
        'GENOSYS Mask', 'GENOSYS Peeling & Power Solution', 'GENOSYS CLEANSER',
        'GENOSYS TONER', 'GENOSYS MAKEUP REMOVER',
    ]),
    ('Creams, Sun Care & BB', ['GENOSYS CREAM']),
    ('Serums & Cushions', ['GENOSYS Cosmetics - Daily Serum', 'GENOSYS Cosmetics - CUSHION']),
    ('Hair, Eye & Neck Care', [
        'GENOSYS Cosmetics - HAIR', 'GENOSYS Cosmetics - EYE',
        'GENOSYS Cosmetics - ND CELL Treatment - Neck&Decollete',
    ]),
    ('Kits & Devices', ['GENOSYS Cosmetics - KIT BOX', 'GENOSYS DERMAFIX']),
    ('Marketing Materials & Accessories', [
        'GENOSYS X-Banner', 'Genosys Roller Case', 'Genosys Cosmetic Cradle',
        'Genosys Accessories and Bags', 'Genosys Dropper', 'Genosys Bed Blanket',
        'Genosys Uniform',
    ]),
])

CAT_LABEL = {
    'GENOSYS Detachable Manual Roller (Head part is detachable, handle is autoclavable)':
        'Detachable Manual Roller (autoclavable handle)',
    'GENOSYS Vibrating Roller (Vibrating, Head part is detachable)':
        'Vibrating Roller & Replacement Heads',
    'GENOSYS Stamp (Stamp, handle is not detachable)': 'Stamp',
    'GENOSYS Eye Roller (One-body type, head part is not detachable)': 'Eye Roller',
    'GENOSYS Manual Roller (One-body type, handle is not detachable)': 'Manual Roller (one-body)',
    'GENOSYS Mask': 'Masks', 'GENOSYS Peeling & Power Solution': 'Peeling & Power Solutions',
    'GENOSYS CLEANSER': 'Cleanser', 'GENOSYS TONER': 'Toner',
    'GENOSYS MAKEUP REMOVER': 'Make-up Remover', 'GENOSYS CREAM': 'Creams, Sun Care & BB',
    'GENOSYS Cosmetics - Daily Serum': 'Daily Serums', 'GENOSYS Cosmetics - CUSHION': 'Cushions',
    'GENOSYS Cosmetics - HAIR': 'HR³ Matrix Hair', 'GENOSYS Cosmetics - EYE': 'EyeCell Eye Care',
    'GENOSYS Cosmetics - ND CELL Treatment - Neck&Decollete': 'ND Cell Neck & Décolleté',
    'GENOSYS Cosmetics - KIT BOX': 'Starter Kit', 'GENOSYS DERMAFIX': 'Dermafix & Devices',
    'GENOSYS X-Banner': 'X-Banners', 'Genosys Roller Case': 'Roller Case',
    'Genosys Cosmetic Cradle': 'Cosmetic Cradle', 'Genosys Accessories and Bags': 'Accessories & Bags',
    'Genosys Dropper': 'Dropper', 'Genosys Bed Blanket': 'Bed Blanket', 'Genosys Uniform': 'Uniforms',
}


def fmt_price(v):
    if not v or v == 'N/A':
        return 'N/A'
    try:
        # European format: dot thousands, comma decimal, two decimals (e.g. 5.500,00)
        s = f"{float(v):,.2f}"            # -> "5,500.00"
        return s.replace(',', '\u0001').replace('.', ',').replace('\u0001', '.')
    except Exception:
        return str(v)


def size_unit(item):
    qty = (item['quantity_or_spec'] or '').strip()
    unit = (item['unit'] or '').strip()
    if unit and unit.lower() not in qty.lower():
        return f"{qty}  ·  {unit}" if qty else unit
    return qty or '—'


def describe(item):
    """Return description with a Personal/Professional tag styled inline."""
    d = item['description'] or ''
    tag = ''
    m = re.search(r'/\s*(Personal|Professional)\b', d, re.I)
    if m:
        word = m.group(1).title()
        d = d[:m.start()].strip().rstrip('/').strip()
        col = '#7a6118' if word == 'Professional' else '#3b5a52'
        tag = (f'  <font name="{BLD}" size="6.4" color="{col}">'
               f'[{word.upper()}]</font>')
    return esc(d) + tag


# ---- Document with TOC + numbered canvas ----------------------------------
LEFT = RIGHT = 15 * mm
TOPM = 20 * mm
BOTM = 16 * mm
PAGE_W, PAGE_H = A4
SEC_BOOKMARKS = []


class NumberedCanvas(canvasmod.Canvas):
    def __init__(self, *a, **k):
        super().__init__(*a, **k)
        self._saved = []

    def showPage(self):
        self._saved.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        total = len(self._saved)
        for idx, state in enumerate(self._saved):
            self.__dict__.update(state)
            self._draw_furniture(idx + 1, total)
            super().showPage()
        super().save()

    def _draw_furniture(self, page, total):
        if page == 1:
            return  # cover handled separately
        self.saveState()
        # running header
        self.setStrokeColor(LINE); self.setLineWidth(0.6)
        self.line(LEFT, PAGE_H - 13 * mm, PAGE_W - RIGHT, PAGE_H - 13 * mm)
        self.setFont(BLD, 7.6); self.setFillColor(PRIMARY)
        self.drawString(LEFT, PAGE_H - 11 * mm, 'GENOSYS  ·  UAE Clinics Price List 2026')
        self.setFont(REG, 7.6); self.setFillColor(MUTE)
        self.drawRightString(PAGE_W - RIGHT, PAGE_H - 11 * mm, 'www.genosys.ae')
        # footer
        self.setStrokeColor(LINE)
        self.line(LEFT, 11 * mm, PAGE_W - RIGHT, 11 * mm)
        self.setFont(REG, 7); self.setFillColor(MUTE)
        self.drawString(LEFT, 7 * mm, 'Prices in AED · Professional / clinic reference · Subject to change without notice')
        self.setFont(BLD, 7.4); self.setFillColor(PRIMARY)
        self.drawRightString(PAGE_W - RIGHT, 7 * mm, f'Page {page} of {total}')
        self.restoreState()


class PriceDoc(BaseDocTemplate):
    def afterFlowable(self, flowable):
        if isinstance(flowable, Paragraph) and flowable.style.name == 'Sec':
            text = flowable.getPlainText()
            # Deterministic key (stable across multiBuild passes) so the TOC resolves.
            key = 'sec_' + re.sub(r'[^a-z0-9]+', '-', text.lower()).strip('-')
            self.canv.bookmarkPage(key)
            self.canv.addOutlineEntry(text, key, level=0, closed=False)
            self.notify('TOCEntry', (0, text, self.page, key))


def draw_cover(canvas, doc):
    canvas.saveState()
    # top hairline band
    canvas.setFillColor(PRIMARY)
    canvas.rect(0, PAGE_H - 8 * mm, PAGE_W, 8 * mm, stroke=0, fill=1)
    canvas.setFillColor(ACCENT)
    canvas.rect(0, PAGE_H - 9.4 * mm, PAGE_W, 1.4 * mm, stroke=0, fill=1)
    # logo
    try:
        lw = 78 * mm; lh = lw / 4.652
        canvas.drawImage(str(WORDMARK), (PAGE_W - lw) / 2, PAGE_H - 78 * mm,
                         width=lw, height=lh, mask='auto', preserveAspectRatio=True)
    except Exception:
        pass
    # title block
    canvas.setFillColor(PRIMARY)
    canvas.setFont(BLD, 30)
    canvas.drawCentredString(PAGE_W / 2, PAGE_H - 112 * mm, 'UAE Clinics Price List')
    canvas.setFillColor(ACCENT)
    canvas.setFont(BLD, 50)
    canvas.drawCentredString(PAGE_W / 2, PAGE_H - 140 * mm, '2026')
    canvas.setFillColor(MUTE)
    canvas.setFont(REG, 12)
    canvas.drawCentredString(PAGE_W / 2, PAGE_H - 152 * mm,
                             'Professional Products · Devices · Marketing Materials')
    # divider
    canvas.setStrokeColor(ACCENT); canvas.setLineWidth(1)
    canvas.line(PAGE_W / 2 - 30 * mm, PAGE_H - 158 * mm, PAGE_W / 2 + 30 * mm, PAGE_H - 158 * mm)
    canvas.setFillColor(colors.HexColor('#444444')); canvas.setFont(REG, 10.5)
    canvas.drawCentredString(PAGE_W / 2, PAGE_H - 170 * mm,
                             'Prepared for clinics, dermatology practices, salons and professional partners')
    canvas.drawCentredString(PAGE_W / 2, PAGE_H - 176 * mm, 'in the United Arab Emirates.')
    # bottom band
    canvas.setFillColor(PRIMARY)
    canvas.rect(0, 0, PAGE_W, 30 * mm, stroke=0, fill=1)
    canvas.setFillColor(ACCENT)
    canvas.rect(0, 30 * mm, PAGE_W, 1.4 * mm, stroke=0, fill=1)
    canvas.setFillColor(colors.white); canvas.setFont(BLD, 11)
    canvas.drawCentredString(PAGE_W / 2, 18 * mm, 'GENOSYS Middle East FZ-LLC')
    canvas.setFont(REG, 9.5)
    canvas.drawCentredString(PAGE_W / 2, 12 * mm, 'www.genosys.ae   ·   Issued 9 June 2026   ·   Currency: AED')
    canvas.restoreState()


frame = Frame(LEFT, BOTM, PAGE_W - LEFT - RIGHT, PAGE_H - TOPM - BOTM, id='body')
cover_frame = Frame(LEFT, BOTM, PAGE_W - LEFT - RIGHT, PAGE_H - 30 * mm, id='cover')

doc = PriceDoc(str(OUT_PDF), pagesize=A4, leftMargin=LEFT, rightMargin=RIGHT,
               topMargin=TOPM, bottomMargin=BOTM,
               title='GENOSYS UAE Clinics Price List 2026',
               author='GENOSYS Middle East FZ-LLC', subject='Clinic / professional price list')
doc.addPageTemplates([
    PageTemplate(id='Cover', frames=[cover_frame], onPage=draw_cover),
    PageTemplate(id='Body', frames=[frame]),
])

TH = [P('Photo', 'TH'), P('Product', 'TH'), P('Description', 'TH'), P('Size / Unit', 'TH'), P('AED', 'TH')]
COLS = [18 * mm, 41 * mm, 65 * mm, 37 * mm, 19 * mm]


def category_table(cat, items):
    flow = []
    # category chip
    chip = Table([[P(CAT_LABEL.get(cat, cat), 'Cat')]], colWidths=[sum(COLS)])
    chip.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), CHIP),
        ('LEFTPADDING', (0, 0), (-1, -1), 8), ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 4), ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LINEBELOW', (0, 0), (-1, -1), 1.1, ACCENT),
    ]))
    data = [TH]
    for it in items:
        data.append([
            photo_cell(int(it['row'])),
            P(it['product'], 'Prod'),
            Paragraph(describe(it), ss['Cell']),
            P(size_unit(it), 'CellC'),
            P(fmt_price(it['price_aed']), 'Price'),
        ])
    tbl = Table(data, colWidths=COLS, repeatRows=1, splitByRow=1)
    tbl.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, LIGHT]),
        ('BACKGROUND', (4, 1), (4, -1), PRICEBG),
        ('LINEBELOW', (0, 0), (-1, 0), 0.8, ACCENT),
        ('GRID', (0, 0), (-1, -1), 0.3, LINE),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('ALIGN', (0, 0), (0, -1), 'CENTER'),
        ('ALIGN', (4, 0), (4, -1), 'CENTER'),
        ('LEFTPADDING', (0, 0), (-1, -1), 5), ('RIGHTPADDING', (0, 0), (-1, -1), 5),
        ('TOPPADDING', (0, 0), (-1, -1), 4), ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))
    # keep the chip with at least the header + first row
    head = Table([[chip]], colWidths=[sum(COLS)])
    head.setStyle(TableStyle([('LEFTPADDING', (0, 0), (-1, -1), 0), ('RIGHTPADDING', (0, 0), (-1, -1), 0),
                              ('TOPPADDING', (0, 0), (-1, -1), 0), ('BOTTOMPADDING', (0, 0), (-1, -1), 0)]))
    flow.append(CondPageBreak(34 * mm))
    flow.append(chip)
    flow.append(tbl)
    flow.append(Spacer(1, 5 * mm))
    return flow


def section_header(title):
    """Top-level flowables so afterFlowable() can register the TOC entry."""
    return [
        Paragraph(esc(title), ss['Sec']),
        HRFlowable(width='100%', thickness=1.6, color=ACCENT, spaceBefore=0, spaceAfter=4),
        Spacer(1, 4 * mm),
    ]


story = []
# Page 1 cover (Cover template draws everything); switch to Body for the rest.
story.append(NextPageTemplate('Body'))
story.append(PageBreak())

# ---- TOC page -------------------------------------------------------------
story.append(Paragraph('Contents', ss['TOCSection']))
story.append(HRFlowable(width='100%', thickness=1, color=ACCENT, spaceAfter=8))
story.append(Spacer(1, 4 * mm))
toc = TableOfContents()
toc.levelStyles = [ss['TOC0']]
toc.dotsMinLevel = 0
story.append(toc)
story.append(Spacer(1, 8 * mm))
story.append(Paragraph('Notes', ss['TOCSection']))
story.append(HRFlowable(width='100%', thickness=1, color=ACCENT, spaceAfter=4))
for n in [
    'All prices are quoted in AED and follow the values in the source workbook.',
    'Items marked [PERSONAL] are home-care sizes; [PROFESSIONAL] are clinic / treatment sizes.',
    'The source worksheet tab is named “Genosys UAE Price list 2024”, while the workbook title and '
    'file name identify this as the 2026 UAE clinic price list.',
    'The Needle Pen-K cartridge line shows “N/A” because the source workbook does not list a price.',
]:
    story.append(Paragraph('•&nbsp;&nbsp;' + esc(n), ss['Note']))
story.append(PageBreak())

# Switch to Body template for the rest.
story.append(Spacer(1, 1))

# ---- Sections -------------------------------------------------------------
first = True
for group, cats in GROUPS.items():
    present = [c for c in cats if by_cat.get(c)]
    if not present:
        continue
    if not first:
        story.append(PageBreak())
    first = False
    story.extend(section_header(group))
    for c in present:
        story.extend(category_table(c, by_cat[c]))

# ---- Order online / app page ---------------------------------------------
COL3 = sum(COLS) / 3


def badge_img(name, w_mm=54):
    im = RLImage(str(PROMO_DIR / f'badge_{name}.png'))
    im.drawWidth = w_mm * mm
    im.drawHeight = w_mm * mm * 60 / 200  # native badge ratio 200x60
    return im


def qr_cell(name, url, label, sub):
    im = RLImage(str(PROMO_DIR / f'qr_{name}.png'))
    im.drawWidth = im.drawHeight = 30 * mm
    im.hAlign = 'CENTER'
    return [im, Spacer(1, 1.5 * mm),
            Paragraph(esc(label), ss['QrCap']),
            Paragraph(f'<link href="{url}">{esc(sub)}</link>', ss['BtnUrl'])]


story.append(PageBreak())
story.extend(section_header('Shop Online & Download the GENOSYS App'))
story.append(Paragraph(
    'Order the full GENOSYS range online and track everything from your phone. Browse products, '
    'reorder in a tap, follow your deliveries and read clinical protocols — on the web or in the '
    'native iOS and Android apps. Tap a button or scan a code below.', ss['Lead']))
story.append(Spacer(1, 8 * mm))

badge_row = Table([[badge_img('web'), badge_img('ios'), badge_img('android')]],
                  colWidths=[COL3] * 3)
badge_row.setStyle(TableStyle([
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'), ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('LEFTPADDING', (0, 0), (-1, -1), 2), ('RIGHTPADDING', (0, 0), (-1, -1), 2),
    ('TOPPADDING', (0, 0), (-1, -1), 0), ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
]))
story.append(badge_row)
story.append(Spacer(1, 9 * mm))

qr_row = Table([[
    qr_cell('web', WEB_URL, 'Scan to shop online', 'genosys.ae'),
    qr_cell('ios', IOS_URL, 'Scan to install · iOS', 'App Store'),
    qr_cell('android', ANDROID_URL, 'Scan to install · Android', 'Google Play'),
]], colWidths=[COL3] * 3)
qr_row.setStyle(TableStyle([
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'), ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ('LEFTPADDING', (0, 0), (-1, -1), 2), ('RIGHTPADDING', (0, 0), (-1, -1), 2),
    ('TOPPADDING', (0, 0), (-1, -1), 0), ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
]))
story.append(qr_row)
story.append(Spacer(1, 11 * mm))

# App / shopping highlights
story.append(Paragraph('Why order online', ss['TOCSection']))
story.append(HRFlowable(width='100%', thickness=1, color=ACCENT, spaceAfter=6))
feat = Table([
    [P('Full catalogue', 'Prod'), P('Every product in this list, with photos, sizes and live pricing.', 'Cell')],
    [P('Fast reorder', 'Prod'), P('Save favourites and repeat clinic orders in a few taps.', 'Cell')],
    [P('Order tracking', 'Prod'), P('Follow confirmation, invoicing and delivery from your phone.', 'Cell')],
    [P('Protocols & training', 'Prod'), P('Treatment protocols and product guidance for professionals.', 'Cell')],
    [P('Three languages', 'Prod'), P('English, Arabic and Russian across web and apps.', 'Cell')],
], colWidths=[42 * mm, sum(COLS) - 42 * mm])
feat.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, -1), LIGHT),
    ('ROWBACKGROUNDS', (0, 0), (-1, -1), [colors.white, LIGHT]),
    ('GRID', (0, 0), (-1, -1), 0.3, LINE),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('LEFTPADDING', (0, 0), (-1, -1), 6), ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ('TOPPADDING', (0, 0), (-1, -1), 5), ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
]))
story.append(feat)
story.append(Spacer(1, 8 * mm))
story.append(Paragraph(
    f'<b>Distributor:</b> GENOSYS Middle East FZ-LLC &nbsp;·&nbsp; '
    f'<b>Online store:</b> <link href="{WEB_URL}">genosys.ae</link> &nbsp;·&nbsp; '
    f'<b>Items in this list:</b> {len(rows)} &nbsp;·&nbsp; <b>Currency:</b> AED &nbsp;·&nbsp; '
    f'<b>Issued:</b> 9 June 2026', ss['Note']))
story.append(Paragraph(
    'To place an order or request training, shop online, download the app, or contact your GENOSYS '
    'representative and quote the product name and size from this list. Prices are professional / '
    'clinic reference values and are subject to change without notice.', ss['Note']))

# Closing brand band, pushed toward the bottom of the page to balance it.
story.append(Spacer(1, 30 * mm))
band = Table([[[
    Paragraph('GENOSYS Middle East FZ-LLC', ss['BandTitle']),
    Spacer(1, 1.5 * mm),
    Paragraph('Professional skincare &nbsp;·&nbsp; United Arab Emirates &nbsp;·&nbsp; '
              '<link href="' + WEB_URL + '"><font color="#FFFFFF">genosys.ae</font></link>', ss['BandSub']),
]]], colWidths=[sum(COLS)])
band.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, -1), PRIMARY),
    ('LINEABOVE', (0, 0), (-1, -1), 2, ACCENT),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('LEFTPADDING', (0, 0), (-1, -1), 6), ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ('TOPPADDING', (0, 0), (-1, -1), 11), ('BOTTOMPADDING', (0, 0), (-1, -1), 11),
]))
story.append(band)

doc.multiBuild(story, canvasmaker=NumberedCanvas)
print('OK', OUT_PDF)
