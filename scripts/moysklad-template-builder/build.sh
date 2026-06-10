#!/usr/bin/env bash
# ----------------------------------------------------------------------
# Build Awwwards-style Genosys_Invoice_Legal_TAX.xls for MoySklad.
#
# Reads:  ~/Desktop/Genosys_Invoice_Legal_TAX_backup_original.xls
# Writes: ~/Desktop/Genosys_Invoice_Legal_TAX_AWWARDS.xls (.xls 97-2004)
#
# Why LibreOffice and not Python xlwt:
#   xlwt / xlutils.copy round-trips strip merged cells, number formats,
#   and JXLS row-height hooks. MoySklad / Jasper rejects those files with
#   "Некорректный шаблон печатной формы". LibreOffice preserves merges,
#   formulas, and JXLS placeholders verbatim, so MoySklad accepts it.
#
# Requirements:
#   brew install --cask libreoffice
# ----------------------------------------------------------------------
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
PROFILE="/tmp/lo-profile-builder"
SRC="$HOME/Desktop/Genosys_Invoice_Legal_TAX_backup_original.xls"
OUT="$HOME/Desktop/Genosys_Invoice_Legal_TAX_AWWARDS.xls"

if [[ ! -f "$SRC" ]]; then
  echo "ERROR: source missing at $SRC" >&2
  exit 1
fi

if ! command -v soffice >/dev/null 2>&1; then
  echo "ERROR: soffice (LibreOffice) not in PATH. Install with:" >&2
  echo "  brew install --cask libreoffice" >&2
  exit 1
fi

echo "[1/4] Preparing isolated LibreOffice profile at $PROFILE"
rm -rf "$PROFILE"
mkdir -p "$PROFILE/user/basic/Standard"

# Bootstrap LO profile so registry exists
soffice --headless --nologo --norestore --nofirststartwizard \
        -env:UserInstallation="file://$PROFILE" \
        --terminate_after_init >/dev/null 2>&1 || true
# Fallback: terminate by spawn-and-kill if --terminate_after_init unsupported
if [[ ! -f "$PROFILE/user/registrymodifications.xcu" ]]; then
  ( soffice --headless --nologo --norestore --nofirststartwizard \
            -env:UserInstallation="file://$PROFILE" \
            "macro:///" >/dev/null 2>&1 ) &
  sleep 12
  pkill -9 -f soffice || true
  sleep 1
fi

echo "[2/4] Installing macro library"
cp "$HERE/script.xlc"          "$PROFILE/user/basic/script.xlc"
cp "$HERE/dialog.xlc"          "$PROFILE/user/basic/dialog.xlc"
cp "$HERE/script.xlb"          "$PROFILE/user/basic/Standard/script.xlb"
[[ -f "$HERE/dialog.xlb" ]] && cp "$HERE/dialog.xlb" "$PROFILE/user/basic/Standard/dialog.xlb" || true
cp "$HERE/Module1.xba"         "$PROFILE/user/basic/Standard/Module1.xba"

echo "[3/4] Running restyle macro"
rm -f /tmp/restyle.done /tmp/restyle.log
soffice --headless --nologo --norestore --nofirststartwizard \
        -env:UserInstallation="file://$PROFILE" \
        "macro:///Standard.Module1.Main" \
        > /tmp/restyle.log 2>&1
result="$(cat /tmp/restyle.done 2>/dev/null || echo MISSING)"
if [[ "$result" != OK* ]]; then
  echo "ERROR: macro failed" >&2
  echo "$result" >&2
  cat /tmp/restyle.log >&2
  exit 2
fi
echo "macro: $result"

echo "[4/4] Validating output"
python3 - <<PY
import xlrd, os, sys
src = "$SRC"
dst = "$OUT"
def stats(p):
    wb = xlrd.open_workbook(p, formatting_info=True)
    sh = wb.sheet_by_index(0)
    text = []
    for r in range(sh.nrows):
        for c in range(sh.ncols):
            v = sh.cell_value(r, c)
            if isinstance(v, str): text.append(v)
    return {
      "size": os.path.getsize(p), "merges": len(sh.merged_cells),
      "rows": sh.nrows, "cols": sh.ncols,
      "tokens": [t for t in [
        "\${o.name}","<jx:forEach","</jx:forEach>","\${position.printName}",
        "\$[SUM(L30)","formatter.allAmount","formatter.calcVat","formatter.adjustRowHeight"
      ] if t.replace("\\\\","") in "\\n".join(text)]
    }
a, b = stats(src), stats(dst)
print(f"  size:   orig={a['size']:,}  new={b['size']:,}")
print(f"  merges: orig={a['merges']}  new={b['merges']}")
print(f"  rows:   orig={a['rows']}    new={b['rows']}")
print(f"  tokens preserved: {len(b['tokens'])}/{len(a['tokens'])}")
ok = (b['merges'] == a['merges']) and (len(b['tokens']) == len(a['tokens']))
print("VERDICT:", "OK — safe to upload to MoySklad" if ok else "BROKEN — DO NOT upload")
sys.exit(0 if ok else 3)
PY

echo
echo "Done. Upload this file to MoySklad:"
echo "  $OUT"
