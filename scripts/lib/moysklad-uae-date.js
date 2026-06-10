/**
 * MoySklad document dates in UAE (Asia/Dubai).
 *
 * Always use these helpers for order/invoice/report moment fields so documents
 * get today's UAE date, not a hardcoded script date or UTC yesterday.
 *
 *   const { uaeToday, uaeMomentNow, uaeShortDate } = require('./lib/moysklad-uae-date')
 */

const TZ = 'Asia/Dubai'

function uaeDateParts(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(now)

  const get = (type) => parts.find((p) => p.type === type)?.value || '00'

  return {
    yyyy: get('year'),
    mm: get('month'),
    dd: get('day'),
    hh: get('hour'),
    mi: get('minute'),
    ss: get('second'),
  }
}

/** YYYY-MM-DD in UAE */
function uaeToday(now = new Date()) {
  const { yyyy, mm, dd } = uaeDateParts(now)
  return `${yyyy}-${mm}-${dd}`
}

/** YYMMDD in UAE — for GENCardM / CODM name prefixes */
function uaeShortDate(now = new Date()) {
  const { yyyy, mm, dd } = uaeDateParts(now)
  return `${yyyy.slice(2)}${mm}${dd}`
}

/** YYYY-MM-DD HH:mm:ss in UAE — use for MoySklad `moment` on create */
function uaeMomentNow(now = new Date()) {
  const { yyyy, mm, dd, hh, mi, ss } = uaeDateParts(now)
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`
}

/** Fixed clock time on today's UAE date */
function uaeMomentAt(hours, minutes = 0, seconds = 0, now = new Date()) {
  const { yyyy, mm, dd } = uaeDateParts(now)
  const h = String(hours).padStart(2, '0')
  const m = String(minutes).padStart(2, '0')
  const s = String(seconds).padStart(2, '0')
  return `${yyyy}-${mm}-${dd} ${h}:${m}:${s}`
}

/** Current UAE moment + N minutes (e.g. demand 5 min after report). */
function uaeMomentAddMinutes(minutes, base = new Date()) {
  return uaeMomentNow(new Date(base.getTime() + minutes * 60_000))
}

/** DD/MM/YYYY in UAE */
function uaeTodayDmy(now = new Date()) {
  const { yyyy, mm, dd } = uaeDateParts(now)
  return `${dd}/${mm}/${yyyy}`
}

module.exports = {
  TZ,
  uaeToday,
  uaeTodayDmy,
  uaeShortDate,
  uaeMomentNow,
  uaeMomentAt,
  uaeMomentAddMinutes,
}
