# Phone fill — website ↔ MoySklad (2026-08-08)

## Goal
Website customers must have phone numbers; fill empty phones from MoySklad / orders / address book.

## Before → After (website)
| | Count |
|--|------:|
| Users total | 914 |
| Empty phone before | 376 |
| **Filled this run** | **36** |
| With phone after | 574 |
| Still empty (real, excl deleted/local) | 330 |

### Fill sources
- MoySklad unique name match: 18
- MoySklad email match: 14
- Website order `customerPhone`: 4

Report: `tmp/phone-fill-applied-20260808.json`

## MoySklad reverse fill
- Counterparties with empty phone: 122
- Fillable from linked/email-matched website users: **0** (no overlap with a web phone)

## Still empty on website
~330 accounts have no phone in MoySklad, no order phone, and no address-book phone — mostly Apple Private Relay / browse-only registrants. Cannot invent numbers; need customer input or future checkout capture.
