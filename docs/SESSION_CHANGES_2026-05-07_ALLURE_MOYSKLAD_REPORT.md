# Allure MoySklad — отчёт комиссионера + отгрузка (2026-05-07)

## Контрагент и договор

- **MoySklad:** `Allure` — `9e0a2de1-b31e-11ec-0a80-05e20009d062`  
  *(отдельная карточка `Allure Personal Care Center LLC` в системе не использовалась — у неё нет договора 00045 в выборке API.)*
- **Договор:** **00045** (комиссия) — `c1165028-bbc8-11ec-0a80-03f80018fdc3`

## Документы

| Тип | Номер | ID | Сумма AED (с НДС) | Строк / ед. |
|-----|--------|-----|-------------------|-------------|
| Полученный отчёт комиссионера | **01346** | `7b87b876-4915-11f1-0a80-0bab0038e266` | **1 890.00** | 8 / **13** |
| Отгрузка | **06096** | `7c1cc268-4915-11f1-0a80-155400396706` | **1 240.00** | 3 / **8** |

Отгрузка **не дублирует** строки отчёта — только пополнение по отдельному списку.

- [Отчёт](https://online.moysklad.ru/app/#commissionreport/edit?id=7b87b876-4915-11f1-0a80-0bab0038e266)
- [Отгрузка](https://online.moysklad.ru/app/#demand/edit?id=7c1cc268-4915-11f1-0a80-155400396706)

## Отчёт — продажи (маппинг)

| Запрос | Code | Товар |
|--------|------|--------|
| Cushion biege ×1 | 00144 | Skin Caring Blemish Balm Cushion #2 Biege |
| Booster 200ml ×4 | 00022 | Snow Booster Toner 200ml |
| Cleanser 180ml ×2 | 00021 | Snow O₂ Cleanser 180ml |
| EPI peeling ×1 | 00129 | EPI Turnover Boosting Peeling Gel 100g |
| Serum radiance ×1 | 00194 | Multi Vita Radiance Serum 30ml |
| Serum multifunctional anti wrinkle ×1 | 00191 | Multi Functional Anti-Wrinkle Serum 30ml |
| Cream radiance 50g ×2 | 00122 | Multi-Vita Radiance Cream 50g |
| egf cream ×1 | 00042 | EGF Repair Oxymask Cream 50ml |

## Отгрузка — пополнение

| Запрос | Code | Qty |
|--------|------|-----|
| Radiance cream 50g | 00122 | 4 |
| Cleanser 180ml | 00021 | 2 |
| Radiance serum | 00194 | 2 |

## Скрипт

`scripts/moysklad-create-allure-sales-20260507.js`
