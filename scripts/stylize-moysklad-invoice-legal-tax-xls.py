#!/usr/bin/env python3
"""
Experimental — **не загружать в МойСклад**: Jasper/JXLS часто отклоняет файлы,
пересохранённые через xlwt/xlutils (ошибка «Некорректный шаблон»), даже без merge.

Для продакшена: отредактируйте `Genosys_Invoice_Legal_TAX_backup_original.xls` в **Excel**
и сохраните как **.xls** (97–2004). См. `docs/GENOSYS_INVOICE_LEGAL_TAX_AWWARDS_IMPLEMENTATION.md`.

Requires: xlrd==1.2.0, xlutils, xlwt
  pip install 'xlrd==1.2.0' xlutils xlwt

Usage:
  python3 scripts/stylize-moysklad-invoice-legal-tax-xls.py
  python3 ... --src ~/Desktop/Genosys_Invoice_Legal_TAX_backup_original.xls \\
                --out ~/Desktop/Genosys_Invoice_Legal_TAX_MOYSKLAD_SAFE.xls

If MoySklad still rejects output, open the backup in Excel, apply styles there, Save as .xls (97–2004).
"""

from __future__ import annotations

import sys
import shutil
from pathlib import Path

import xlrd
import xlwt
from xlutils.copy import copy


def xf(spec: str) -> xlwt.XFStyle:
    return xlwt.easyxf(spec)


def write_cell(
    ws: xlwt.Worksheet,
    sh: xlrd.sheet.Sheet,
    r: int,
    c: int,
    style: xlwt.XFStyle,
) -> None:
    cell = sh.cell(r, c)
    v = cell.value
    if cell.ctype == xlrd.XL_CELL_EMPTY:
        ws.write(r, c, "", style)
        return
    if cell.ctype == xlrd.XL_CELL_NUMBER:
        if v == int(v) and abs(v) < 1e15:
            ws.write(r, c, int(v), style)
        else:
            ws.write(r, c, v, style)
        return
    if cell.ctype == xlrd.XL_CELL_BOOLEAN:
        ws.write(r, c, bool(v), style)
        return
    ws.write(r, c, v, style)


def style_for_cell(r: int, c: int, sh: xlrd.sheet.Sheet) -> xlwt.XFStyle:
    """Apple-inspired: Helvetica Neue, generous whitespace, dark table header, calm grays."""
    st = STYLES
    v0 = str(sh.cell_value(r, 0)) if sh.ncols > 0 else ""

    if r <= 4:
        return st["blank"]

    if 5 <= r <= 17:
        if c >= 12 and sh.cell_value(r, c):
            return st["jx_meta"]
        if c == 0 and v0:
            return st["label_muted"]
        if c == 0:
            return st["blank"]
        if c == 2 and sh.cell_value(r, 2) != "":
            return st["value_relaxed"]
        return st["blank"]

    if r == 19:
        return st["invoice_lead"]

    if r == 21 and c == 0:
        return st["section_buyer"]

    if 22 <= r <= 26:
        if c == 0:
            return st["label_muted"]
        if c == 2:
            return st["value_relaxed"]
        return st["blank"]

    if r == 28:
        if c in (0, 1):
            return st["tbl_head_left"]
        if c <= 11:
            return st["tbl_head"]
        return st["jx_meta"]

    if r in (29, 31):
        if c >= 12 and sh.cell_value(r, c):
            return st["jx_meta"]
        return st["line_text"]

    if r == 30:
        if c >= 12 and sh.cell_value(r, c):
            return st["jx_meta"]
        if c in (7, 8, 10, 11):
            return st["line_num"]
        return st["line_text"]

    if r in (32, 33):
        if c == 0 and sh.cell_value(r, 0):
            return st["note_soft"]
        if c == 8:
            return st["total_label"]
        if c == 11:
            return st["total_value"]
        return st["blank"]

    if r == 34:
        if c == 8:
            return st["total_label"]
        if c == 11:
            return st["grand_total"]
        return st["note_soft"]

    if r >= 35:
        if c in (1, 2) or v0:
            return st["note_soft"]
        return st["blank"]

    return st["blank"]


def parse_args():
    argv = sys.argv[1:]
    src = None
    out = None
    i = 0
    while i < len(argv):
        if argv[i] == "--src" and i + 1 < len(argv):
            src = Path(argv[i + 1]).expanduser()
            i += 2
            continue
        if argv[i] == "--out" and i + 1 < len(argv):
            out = Path(argv[i + 1]).expanduser()
            i += 2
            continue
        i += 1
    return src, out


def main() -> int:
    desktop = Path.home() / "Desktop"
    arg_src, arg_out = parse_args()
    src = arg_src or (desktop / "Genosys_Invoice_Legal_TAX.xls")
    if not src.exists():
        print(f"Not found: {src}", file=sys.stderr)
        return 1
    out = arg_out or src

    global STYLES
    STYLES = {
        "blank": xf(
            "font: name Helvetica Neue, height 200;"
            "align: horz left, vert center;"
        ),
        "label_muted": xf(
            "font: name Helvetica Neue, bold on, height 200, colour gray50;"
            "align: horz left, vert center;"
        ),
        "value_relaxed": xf(
            "font: name Helvetica Neue, height 200;"
            "align: horz left, vert center, wrap on;"
        ),
        "invoice_lead": xf(
            "font: name Helvetica Neue, bold on, height 260;"
            "align: horz left, vert top, wrap on;"
        ),
        "section_buyer": xf(
            "font: name Helvetica Neue, bold on, height 220, colour gray50;"
            "align: horz left, vert center;"
        ),
        "tbl_head": xf(
            "font: name Helvetica Neue, bold on, height 200, colour white;"
            "pattern: pattern solid, fore_colour gray80;"
            "align: horz center, vert center, wrap on;"
            "borders: top thin, bottom thin;"
        ),
        "tbl_head_left": xf(
            "font: name Helvetica Neue, bold on, height 200, colour white;"
            "pattern: pattern solid, fore_colour gray80;"
            "align: horz left, vert center, wrap on;"
            "borders: top thin, bottom thin;"
        ),
        "line_text": xf(
            "font: name Helvetica Neue, height 200;"
            "align: horz left, vert top, wrap on;"
        ),
        "line_num": xf(
            "font: name Helvetica Neue, height 200;"
            "align: horz right, vert top, wrap on;"
        ),
        "jx_meta": xf(
            "font: name Lucida Grande, height 140, colour gray40;"
            "align: horz left, vert top, wrap on;"
        ),
        "total_label": xf(
            "font: name Helvetica Neue, bold on, height 220, colour gray50;"
            "align: horz right, vert center;"
        ),
        "total_value": xf(
            "font: name Helvetica Neue, bold on, height 220;"
            "align: horz right, vert center;"
        ),
        "grand_total": xf(
            "font: name Helvetica Neue, bold on, height 300;"
            "align: horz right, vert center;"
        ),
        "note_soft": xf(
            "font: name Helvetica Neue, height 180, colour gray40;"
            "align: horz left, vert top, wrap on;"
        ),
    }

    rb = xlrd.open_workbook(str(src), formatting_info=False)
    sh = rb.sheet_by_index(0)
    wb = copy(rb)
    ws = wb.get_sheet(0)

    # Column widths (character units * 256)
    col_chars = [
        6,
        44,
        10,
        5,
        5,
        5,
        5,
        11,
        15,
        12,
        11,
        17,
        14,
        14,
        6,
        6,
        6,
        6,
    ]
    for c, w in enumerate(col_chars):
        if c < sh.ncols:
            ws.col(c).width = 256 * w

    # Do not touch rows 0–3 or add merges — MoySklad often rejects that.

    for r in range(4, sh.nrows):
        ws.row(r).height_mismatch = True
        if r == 28:
            ws.row(r).height = 22 * 20
        elif r == 19:
            ws.row(r).height = 24 * 20
        elif r in (32, 33, 34):
            ws.row(r).height = 20 * 20

        for c in range(sh.ncols):
            st = style_for_cell(r, c, sh)
            write_cell(ws, sh, r, c, st)

    wb.save(str(out))
    print(f"Written: {out}")
    return 0


STYLES: dict[str, xlwt.XFStyle] = {}

if __name__ == "__main__":
    raise SystemExit(main())
