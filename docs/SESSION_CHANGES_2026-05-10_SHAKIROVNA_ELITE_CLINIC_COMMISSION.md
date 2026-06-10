# Shakirovna — два полученных отчёта комиссионера (2026-05-10)

## Запрос

По таблице (Salon / Clinic) создать **полученные отчёты комиссионера** в МойСклад:

1. **ELITE SHAKIROVNA LADIES SALON L.L.C** — блок Salon  
2. **SHAKIROVNA ESTHETIC CLINIC L.L.C** — блок Clinic  

Отгрузки в скрипт **не** входят (только отчёты о продажах с витрины).

## Скрипт

`scripts/moysklad-create-shakirovna-elite-clinic-commission-20260510.js`

```bash
cd cosmetics-website
set -a && source .env && set +a   # MOYSKLAD_LOGIN / MOYSKLAD_PASSWORD
node scripts/moysklad-create-shakirovna-elite-clinic-commission-20260510.js
node scripts/moysklad-create-shakirovna-elite-clinic-commission-20260510.js --commit
```

Опции:

- `--report=elite` — только салон  
- `--report=clinic` — только клиника  
- по умолчанию — оба  

## Номенклатура (коды × кол-во)

**Salon (ELITE):**

| Код | Товар | Qty |
|-----|--------|-----|
| 54458 | Moisture Replenishing Hyaluron Cream 50g | 1 |
| 00041 | Multi Sun Cream SPF40/PA++ 40g | 2 |
| 00063 | Intensive Repair Collagen Mask 23g | 2 |
| 00144 | Skin Caring Blemish Balm Cushion #2 Beige | 2 |
| 00140 | Soothing Bomb Sea Algae Mask 23g | 5 |

В таблице у маски указано «25g» — в каталоге МойСклад активная позиция **23g** (`00140`), как в других отчётах.

**Clinic (ESTHETIC):**

| Код | Товар | Qty |
|-----|--------|-----|
| 00035 | Intensive Problem Control Cream 50g | 1 |

## Поведение API

- Контрагент ищется **по точному имени** после `search` по первому слову имени.  
- Договор комиссии — среди договоров контрагента с `contractType === Commission`. Если договоров несколько и тип не распознан — скрипт падает с текстом; тогда в скрипте заполняется блок **`FALLBACK`** (`agentId`, `contractId`).  

## После `--commit`

В логе будет ссылка вида:

`https://online.moysklad.ru/app/#commissionreport/edit?id=...`

Проверьте суммы и строки в UI.

### Создано (2026-05-10, `--commit`)

| № | Контрагент | Номер отчёта | Сумма AED | ID |
|---|------------|---------------|-----------|-----|
| 1 | ELITE SHAKIROVNA LADIES SALON L.L.C | **01351** | 781.00 | `372966fd-4c8c-11f1-0a80-0935007d9f0d` |
| 2 | SHAKIROVNA ESTHETIC CLINIC L.L.C | **01352** | 145.00 | `385cb21f-4c8c-11f1-0a80-00d4007e95a8` |

- [01351 Elite](https://online.moysklad.ru/app/#commissionreport/edit?id=372966fd-4c8c-11f1-0a80-0935007d9f0d)  
- [01352 Clinic](https://online.moysklad.ru/app/#commissionreport/edit?id=385cb21f-4c8c-11f1-0a80-00d4007e95a8)  

**Почему не было видно в МойСклад:** без флага `--commit` скрипт только **dry-run** — документы в API не создаёт. Нужно: `node ... --commit` (при заданных `MOYSKLAD_LOGIN` / `MOYSKLAD_PASSWORD`).

## Скриншот-источник

Сохранён: `assets/Screenshot_2026-05-10_at_8.03.39_PM-2cc817cc-ea62-4f48-9b17-7f48a79b0116.png`
