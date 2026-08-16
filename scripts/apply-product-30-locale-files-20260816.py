"""Swap the product 30 blocks in the AR and RU translation files."""
import json
import re
import subprocess

# Reuse the exact strings from the applied DB script so the three surfaces
# cannot drift apart.
node = subprocess.run(
    ['npx', 'tsx', '--env-file=.env.local', 'scripts/tmp-dump-product-30-locales.ts'],
    capture_output=True, text=True, cwd='.',
)
if '___JSON___' not in node.stdout:
    raise SystemExit('dump failed:\n' + node.stdout + node.stderr)
data = json.loads(node.stdout.split('___JSON___', 1)[1])
AR, RU = data['AR'], data['RU']


def dq(s):
    return json.dumps(s, ensure_ascii=False)


AR_BLOCK = (
    "  '30': {\n"
    f"    description: {dq(AR['description'])},\n"
    f"    productDetails: {dq(AR['productDetails'])},\n"
    f"    keyFeatures: {dq(AR['keyFeatures'])},\n"
    f"    benefits: {dq(AR['benefits'])},\n"
    f"    ingredients: {dq(AR['ingredients'])},\n"
    f"    howToUse: {dq(AR['howToUse'])},\n"
    f"    directions: {dq(AR['directions'])}\n"
    "  },\n"
)

path = 'data/productTranslations.ts'
src = open(path).read()
start = src.index("  '30': {\n")
end = re.compile(r"^  '31': \{\n", re.M).search(src, start).start()
src = src[:start] + AR_BLOCK + src[end:]
open(path, 'w').write(src)
print('updated', path)

ru_path = 'data/productTranslationsRu.ts'
ru = open(ru_path).read()
start = ru.index('  "30": {\n')
end = re.compile(r'^  "31": \{\n', re.M).search(ru, start).start()

keys = ['description', 'productDetails', 'keyFeatures', 'benefits', 'ingredients', 'howToUse', 'directions']
lines = ['  "30": {']
for i, k in enumerate(keys):
    comma = ',' if i < len(keys) - 1 else ''
    lines.append(f'    "{k}": {dq(RU[k])}{comma}')
lines.append('  },')
ru = ru[:start] + '\n'.join(lines) + '\n' + ru[end:]
open(ru_path, 'w').write(ru)
print('updated', ru_path)
