# Persona Palm Jumeirah — отчет комиссионера + отгрузка (2026-05-06)

## Контрагент и договор

- **MoySklad:** `First Person Ladies Salon LLC (Palm Jumeirah)` — `fd850df7-1cff-11ef-0a80-082e0017fa70`
- **Договор:** **00078** — `393d4076-1d00-11ef-0a80-028700179a4e`

## Созданные документы

| Тип | Номер | ID | Сумма (AED, с НДС) | Строк |
|-----|--------|-----|-------------------|-------|
| Полученный отчет комиссионера | **01345** | `03ac551b-489e-11f1-0a80-0c4100261a4e` | **4 964.00** | 14 |
| Отгрузка | **06095** | `0475cdd2-489e-11f1-0a80-144d0026c869` | **4 964.00** | 14 |

- [Отчет в UI](https://online.moysklad.ru/app/#commissionreport/edit?id=03ac551b-489e-11f1-0a80-0c4100261a4e)
- [Отгрузка в UI](https://online.moysklad.ru/app/#demand/edit?id=0475cdd2-489e-11f1-0a80-144d0026c869)

Отгрузка содержит **те же 14 позиций и количества**, что и отчет (41 шт.).

## Соответствие запроса → код MoySklad

| Запрос | Code | Товар |
|--------|------|--------|
| All for Sensitive Serum ×1 | 00030 | All For Sensitive Serum 30ml |
| Snow O2 Cleanser 180ml ×5 | 00021 | Snow O₂ Cleanser 180ml |
| PDRN ×3 | 54467 | Skin Reboot PDRN mask Pack (30 sheets) |
| Collagen Mask ×4 | 00063 | Intensive Repair Collagen Mask 23g |
| Sea Mask ×9 | 00140 | Soothing Bomb Sea Algae Mask 23g |
| Hyaluron Cream 50g ×1 | 54458 | Moisture Replenishing Hyaluron Cream 50g |
| Overnight Cream Mask ×1 | 00189 | Skin Rescue Overnight Cream Mask 100g |
| eye Patches ×4 | 00053 | EyeCell Eye Peptide Gel Patch (box) |
| Scalp Shampoo ×3 | 00052 | HR³ Matrix Scalp & Hair Shampoo 300ml |
| Cushion Beige ×2 | 00144 | Skin Caring Blemish Balm Cushion #2 Biege |
| Mist ×2 | 00188 | Microbiome Energy Infusing Mist 80ml |
| Problem Control Cream 50g ×1 | 00035 | Intensive Problem Control Cream 50g |
| Hair Tonic ×4 | 00051 | HR³ Matrix Hair Tonic 70ml |
| Hair solution ×1 | **00048** | HR³ Matrix Hair Solution — **Professional Box (8pcs)** |

**Уточнение по Hair solution:** в документ поставлена **коробка 8 шт.** (`00048`). Если имелся **флакон** из проф. набора, в MoySklad это обычно `00049` — тогда правьте позицию вручную.

## Скрипт

`scripts/moysklad-create-persona-palm-jumeirah-sales-20260506.js`
