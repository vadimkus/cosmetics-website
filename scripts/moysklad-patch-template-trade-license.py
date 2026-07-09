#!/usr/bin/env python3
"""
Download Genosys MoySklad print templates, replace old trade license I14330AT → 5023192.

MoySklad Remap API can DOWNLOAD templates but does NOT accept template file uploads
(PUT /entity/customtemplate/{id} rejects all Content-Types). After running this
script, upload the .xls files manually in MoySklad UI (see README in output folder).

Requires MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD in env (or dotenv).

Usage:
  python3 scripts/moysklad-patch-template-trade-license.py
"""

from __future__ import annotations

import base64
import os
import sys
from datetime import datetime
from pathlib import Path

import requests

API = "https://api.moysklad.ru/api/remap/1.2"
OLD_LICENSE = "I14330AT"
NEW_LICENSE = "5023192"

TEMPLATES = [
    ("invoiceout", "5e56cd7d-ce85-4db5-8771-d7531f9ffd71", "Genosys_Invoice_Legal_TAX"),
    ("invoiceout", "b2cde0a1-ec18-4ea5-ac56-813a26308f10", "Genosys_Invoice_Legal_TAX_RETAIL_PRINT"),
    ("customerorder", "80b38aad-4f55-4bd8-a4a4-d8ed5bf69d2f", "Genosys_Invoice_PROFORMA"),
    ("demand", "09ef2604-4a14-4571-bc17-dc266c9190c3", "Genosys_Consignment_Stock_Note"),
    ("commissionreportin", "9db2a6fb-fd0e-4a35-ab2c-443f47cc3ede", "Invoice_Consignment_Sales_Genosys"),
    ("commissionreportin", "26c9d8c4-999b-407b-8038-4d6400eb6322", "Invoice_Consignment_Report_Genosys"),
]

OUT_DIR = Path.home() / "Desktop" / "MoySklad_Templates_updated"


def auth_headers() -> dict[str, str]:
    login = os.environ.get("MOYSKLAD_LOGIN")
    password = os.environ.get("MOYSKLAD_PASSWORD")
    if not login or not password:
        raise SystemExit("Set MOYSKLAD_LOGIN and MOYSKLAD_PASSWORD")
    token = base64.b64encode(f"{login}:{password}".encode()).decode()
    return {
        "Authorization": f"Basic {token}",
        "Accept": "application/json;charset=utf-8",
    }


def patch_binary(data: bytes) -> tuple[bytes, int]:
    old_u16 = OLD_LICENSE.encode("utf-16-le")
    new_u16 = f"{NEW_LICENSE} ".encode("utf-16-le")  # pad to 8 UTF-16 code units
    old_ascii = OLD_LICENSE.encode("ascii")
    new_ascii = NEW_LICENSE.encode("ascii") + b"\x00"

    buf = bytearray(data)
    count = 0
    idx = 0
    while True:
        i = buf.find(old_u16, idx)
        if i == -1:
            break
        buf[i : i + len(old_u16)] = new_u16
        count += 1
        idx = i + len(new_u16)
    idx = 0
    while True:
        i = buf.find(old_ascii, idx)
        if i == -1:
            break
        buf[i : i + len(old_ascii)] = new_ascii
        count += 1
        idx = i + len(new_ascii)
    return bytes(buf), count


def main() -> None:
    stamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_dir = Path.home() / "Desktop" / f"MoySklad_Templates_backup_{stamp}"
    backup_dir.mkdir(parents=True, exist_ok=True)
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    headers = auth_headers()
    results: list[str] = []

    for entity, template_id, name in TEMPLATES:
        meta = requests.get(
            f"{API}/entity/{entity}/metadata/customtemplate/{template_id}",
            headers=headers,
            timeout=60,
        )
        meta.raise_for_status()
        content_url = meta.json().get("content")
        if not content_url:
            print(f"SKIP {name}: no content URL")
            continue

        raw = requests.get(content_url, headers=headers, timeout=120)
        raw.raise_for_status()
        backup_path = backup_dir / f"{name}.xls"
        backup_path.write_bytes(raw.content)

        patched, n = patch_binary(raw.content)
        out_path = OUT_DIR / f"{name}.xls"
        out_path.write_bytes(patched)

        ok = NEW_LICENSE.encode() in patched and OLD_LICENSE.encode() not in patched
        line = f"- **{name}** — {n} replacement(s), ok={ok} → `{out_path.name}`"
        results.append(line)
        print(line)

    readme = f"""# MoySklad templates — trade license update

**Date:** {datetime.now().strftime('%Y-%m-%d %H:%M')}
**Change:** `Trade License: I14330AT` → `Trade License: 5023192`

## Upload manually (API cannot push template files)

For each template below:

1. Open MoySklad → **Настройки** (gear) → **Печатные формы** (Print forms)
2. Find the template name
3. **Edit** → **Upload / Replace file** → choose the matching `.xls` from this folder
4. Save

Or open an invoice → Print → manage templates → edit the template.

## Files ready to upload

{chr(10).join(results)}

## Backups (originals)

`{backup_dir}`

## Templates

| MoySklad name | Document type |
|---------------|---------------|
| Genosys_Invoice_Legal_TAX | Счёт покупателю (B2B clinic) |
| Genosys_Invoice_Legal_TAX_RETAIL_PRINT | Счёт покупателю (retail) |
| Genosys_Invoice_PROFORMA | Заказ покупателя |
| Genosys_Consignment_Stock_Note | Отгрузка (consignment) |
| Invoice_Consignment_Sales_Genosys | Полученный отчёт комиссионера |
| Invoice_Consignment_Report_Genosys | Полученный отчёт комиссионера |
"""
    readme_path = OUT_DIR / "README_UPLOAD.md"
    readme_path.write_text(readme, encoding="utf-8")
    print(f"\nREADME: {readme_path}")
    print(f"Backups: {backup_dir}")


if __name__ == "__main__":
    try:
        from dotenv import load_dotenv

        load_dotenv()
    except ImportError:
        pass
    main()
