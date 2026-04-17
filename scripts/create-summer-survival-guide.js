#!/usr/bin/env node

/**
 * Create UAE Summer Skincare Survival Guide 2026 blog post
 * Seasonal editorial with product recommendations, EN/AR/RU content
 */

const { PrismaClient } = require('@prisma/client')

const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.POSTGRES_URL

if (!databaseUrl) {
  console.error('PRISMA_DATABASE_URL or POSTGRES_URL environment variable is required.')
  process.exit(1)
}

let prisma
const isAccelerate = databaseUrl.startsWith('prisma+')

if (isAccelerate) {
  prisma = new PrismaClient({ accelerateUrl: databaseUrl, log: ['error', 'warn'] })
} else {
  const { PrismaPg } = require('@prisma/adapter-pg')
  const { Pool } = require('pg')
  const pool = new Pool({ connectionString: databaseUrl })
  const adapter = new PrismaPg(pool)
  prisma = new PrismaClient({ adapter, log: ['error', 'warn'] })
}

// ============================================================
// ENGLISH CONTENT
// ============================================================
const title = 'UAE Summer Skincare Survival Guide 2026 — Stop the Meltdown, Break-Outs & AC Dryness'
const slug = 'uae-summer-skincare-survival-guide-2026'
const excerpt = 'Dubai, Abu Dhabi and Sharjah summer hits 45°C+ with 90% humidity outside and frigid -22°C AC indoors. That contrast is why your skin melts, breaks out, and still feels dry. Here is the exact 7-step GENOSYS routine our customers use to keep glass skin from May to September — plus which SPF to actually wear.'

const content = `<div class="blog-content">

  <!-- Hero -->
  <div class="bg-gradient-to-br from-sky-50 via-white to-amber-50 rounded-2xl p-6 md:p-12 mb-10 text-center border border-sky-100/50 shadow-sm">
    <img
      src="/blog/summer-splash.jpg"
      alt="Refreshing face splash — UAE summer skincare"
      class="rounded-2xl shadow-2xl mx-auto max-w-2xl w-full mb-8"
    />
    <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-3 tracking-tight">Your UAE Summer Survival Routine</h2>
    <p class="text-lg md:text-xl text-gray-600 mb-2">7 steps · 2 sunscreens compared · real AED prices</p>
    <p class="text-base text-sky-700 font-semibold mb-6">Written for 45°C outside, -22°C AC inside</p>
    <a
      href="https://genosys.ae"
      class="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-800 transition-colors shadow-lg"
    >
      Shop the Summer Lineup
    </a>
    <p class="text-sm text-gray-500 mt-3">Free delivery on orders over 1,000 AED · All UAE emirates</p>
  </div>

  <!-- Intro -->
  <div class="mb-10">
    <p class="text-lg md:text-xl text-gray-700 leading-relaxed mb-5">
      If you live in the UAE, you already know the drill. By mid-April your foundation starts sliding off by 11am. By June, that "melting skin" feeling becomes your daily normal. By August, you are somehow oily, broken out, <em>and</em> flaking at the same time — and no routine seems to work.
    </p>
    <p class="text-lg md:text-xl text-gray-700 leading-relaxed mb-5">
      This is not you doing skincare wrong. The UAE environment is genuinely one of the hardest climates on the planet for skin. The good news: once you understand <em>why</em> it's happening, the fix is straightforward and takes less than 10 minutes a day.
    </p>
    <p class="text-lg md:text-xl text-gray-700 leading-relaxed">
      This guide is the exact lineup we recommend to our UAE customers every May. No fluff, no 20-step routines — just the 7 steps that actually matter in this climate, with the specific GENOSYS products that do the job.
    </p>
  </div>

  <!-- Why UAE Summer Is Brutal -->
  <div class="bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50 rounded-2xl p-6 md:p-10 mb-10 border border-orange-100">
    <div class="mb-6">
      <img
        src="/blog/summer-dubai.jpg"
        alt="Dubai skyline at sunset — UAE summer heat"
        class="rounded-2xl shadow-lg mx-auto w-full"
      />
    </div>
    <div class="flex items-center gap-3 mb-6">
      <span class="text-4xl">🌡️</span>
      <h3 class="text-2xl md:text-3xl font-bold text-gray-900">Why UAE Summer Is a Special Kind of Hard on Skin</h3>
    </div>

    <div class="grid md:grid-cols-2 gap-5">
      <div class="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-sm">
        <div class="flex items-center gap-3 mb-3">
          <span class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-xl">☀️</span>
          <h4 class="font-bold text-gray-900">UV Index 11+ for 5 Months</h4>
        </div>
        <p class="text-gray-600 text-sm leading-relaxed">From May to September the UV index sits at "extreme" almost daily. That is the same reading as the Sahara at noon. Unprotected skin accumulates pigment, loses collagen, and ages 2–3× faster than in a European summer.</p>
      </div>
      <div class="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-sm">
        <div class="flex items-center gap-3 mb-3">
          <span class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-xl">💧</span>
          <h4 class="font-bold text-gray-900">80–95% Outdoor Humidity</h4>
        </div>
        <p class="text-gray-600 text-sm leading-relaxed">When the air is already saturated, your sweat cannot evaporate. Sebum, sweat and sunscreen mix on your face into a warm, slightly salty film — the perfect breeding ground for <em>C. acnes</em> bacteria and clogged pores.</p>
      </div>
      <div class="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-sm">
        <div class="flex items-center gap-3 mb-3">
          <span class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-xl">❄️</span>
          <h4 class="font-bold text-gray-900">AC at 18–22°C, 30% RH</h4>
        </div>
        <p class="text-gray-600 text-sm leading-relaxed">The moment you step into a mall, office or car, humidity drops from 90% to roughly 30%. Your skin barrier has to compensate 10–20 times per day. That is why your cheeks can feel tight and flaky even when your T-zone is oily.</p>
      </div>
      <div class="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-sm">
        <div class="flex items-center gap-3 mb-3">
          <span class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-xl">🌪️</span>
          <h4 class="font-bold text-gray-900">Dust, Sand & Hard Water</h4>
        </div>
        <p class="text-gray-600 text-sm leading-relaxed">UAE tap water is one of the hardest in the world (high calcium, magnesium, chlorine). Combined with shamal dust and construction particulates, every cleanse is mildly stripping unless you use the right product.</p>
      </div>
    </div>
  </div>

  <!-- The 5 Summer Symptoms -->
  <div class="mb-10">
    <h3 class="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">The 5 Summer Skin Problems We See Every Year</h3>
    <p class="text-gray-600 text-center mb-8 max-w-2xl mx-auto">If any of these sound familiar, keep reading — there is a specific step in the routine below that fixes each one.</p>

    <div class="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div class="flex items-start gap-3 mb-2">
          <span class="text-3xl">🫠</span>
          <h4 class="font-bold text-gray-900 text-lg">Makeup melting by 11am</h4>
        </div>
        <p class="text-gray-600 text-sm leading-relaxed">Usually caused by the wrong sunscreen (too rich, too occlusive) layered under foundation. Solution: step 5 below.</p>
      </div>
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div class="flex items-start gap-3 mb-2">
          <span class="text-3xl">🔥</span>
          <h4 class="font-bold text-gray-900 text-lg">Heat rash and forehead bumps</h4>
        </div>
        <p class="text-gray-600 text-sm leading-relaxed">Trapped sweat + clogged follicles. You need a BHA-based toner, not another scrub. Step 2 fixes this.</p>
      </div>
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div class="flex items-start gap-3 mb-2">
          <span class="text-3xl">💦</span>
          <h4 class="font-bold text-gray-900 text-lg">Shiny T-zone, dry cheeks</h4>
        </div>
        <p class="text-gray-600 text-sm leading-relaxed">Classic UAE summer combination skin — caused by the 45°C/-22°C daily cycle. Step 3 and step 4 rebalance it.</p>
      </div>
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div class="flex items-start gap-3 mb-2">
          <span class="text-3xl">🎭</span>
          <h4 class="font-bold text-gray-900 text-lg">Dullness and uneven tone</h4>
        </div>
        <p class="text-gray-600 text-sm leading-relaxed">UV + pollution oxidation = grey, tired-looking skin by July. A weekly CO₂ treatment (step 7) reboots oxygenation.</p>
      </div>
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 md:col-span-2">
        <div class="flex items-start gap-3 mb-2">
          <span class="text-3xl">🟤</span>
          <h4 class="font-bold text-gray-900 text-lg">New dark spots by September</h4>
        </div>
        <p class="text-gray-600 text-sm leading-relaxed">The #1 complaint from our UAE customers. Caused by a single missed reapplication or a sunscreen that was never strong enough. This is why we insist on SPF 50+ PA++++ between May and October — no compromise.</p>
      </div>
    </div>
  </div>

  <!-- THE 7-STEP ROUTINE -->
  <div class="bg-gradient-to-br from-sky-50 via-white to-emerald-50 rounded-2xl p-6 md:p-10 mb-10 border border-sky-100">
    <div class="text-center mb-8">
      <h3 class="text-3xl md:text-4xl font-bold text-gray-900 mb-3">The 7-Step GENOSYS Summer Routine</h3>
      <p class="text-gray-600 max-w-2xl mx-auto">Morning + evening + once-weekly. Total time: 8–10 minutes a day. No gimmicks — every step has a specific job.</p>
    </div>

    <!-- Step 1 CLEANSE -->
    <div class="bg-white rounded-2xl p-6 md:p-8 mb-5 shadow-sm border border-gray-100">
      <div class="flex items-center gap-3 mb-4">
        <span class="w-10 h-10 bg-sky-600 text-white rounded-full flex items-center justify-center font-bold">1</span>
        <h4 class="text-xl md:text-2xl font-bold text-gray-900">Cleanse — without stripping</h4>
      </div>
      <div class="grid md:grid-cols-3 gap-5 items-center">
        <div class="md:col-span-1">
          <img src="/blog/summer-cleanser.jpg" alt="Gentle summer cleanser" class="rounded-xl shadow-sm w-full" />
        </div>
        <div class="md:col-span-2">
          <p class="text-gray-700 leading-relaxed mb-3">Summer skin needs <strong>more</strong> cleansing (sweat, SPF, pollution) but also <strong>gentler</strong> cleansing (hard water already depletes the barrier). The answer is an oxygenating foam, not a harsh sulfate wash.</p>
          <p class="text-gray-700 leading-relaxed mb-4">We recommend <a href="https://genosys.ae/products/10" class="text-sky-700 font-semibold hover:underline">SNOW O₂ CLEANSER</a> — it foams up on contact with water, lifts sebum and sunscreen without tugging, and leaves the barrier intact.</p>
          <a href="https://genosys.ae/products/10" class="inline-flex items-center gap-2 bg-sky-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-sky-700 transition-colors">Snow O₂ Cleanser — 330 AED →</a>
        </div>
      </div>
    </div>

    <!-- Step 2 TONE -->
    <div class="bg-white rounded-2xl p-6 md:p-8 mb-5 shadow-sm border border-gray-100">
      <div class="flex items-center gap-3 mb-4">
        <span class="w-10 h-10 bg-sky-600 text-white rounded-full flex items-center justify-center font-bold">2</span>
        <h4 class="text-xl md:text-2xl font-bold text-gray-900">Tone — clear the pores before they clog</h4>
      </div>
      <p class="text-gray-700 leading-relaxed mb-3">Heat rash, forehead bumps, back-of-the-jaw breakouts — they all start with a clogged follicle. A <strong>salicylic acid (BHA) toner</strong> dissolves the oily plug before it becomes a pimple. Used daily from May onwards, it is the single most effective step for preventing summer acne.</p>
      <p class="text-gray-700 leading-relaxed mb-4">Use <a href="https://genosys.ae/products/15" class="text-sky-700 font-semibold hover:underline">INTENSIVE PROBLEM CONTROL TONER</a> in the morning if you are acne-prone, or swap in <a href="https://genosys.ae/products/16" class="text-sky-700 font-semibold hover:underline">SNOW BOOSTER</a> for a lighter, hydrating feel on normal-dry skin.</p>
      <div class="flex flex-wrap gap-2">
        <a href="https://genosys.ae/products/15" class="inline-flex items-center gap-2 bg-sky-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-sky-700 transition-colors">Problem Control Toner — 260 AED</a>
        <a href="https://genosys.ae/products/16" class="inline-flex items-center gap-2 bg-gray-100 text-gray-900 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors border border-gray-200">Or: Snow Booster — 260 AED</a>
      </div>
    </div>

    <!-- Step 3 SERUM -->
    <div class="bg-white rounded-2xl p-6 md:p-8 mb-5 shadow-sm border border-gray-100">
      <div class="flex items-center gap-3 mb-4">
        <span class="w-10 h-10 bg-sky-600 text-white rounded-full flex items-center justify-center font-bold">3</span>
        <h4 class="text-xl md:text-2xl font-bold text-gray-900">Serum — rehydrate what the AC stole</h4>
      </div>
      <div class="grid md:grid-cols-3 gap-5 items-center">
        <div class="md:col-span-1">
          <img src="/blog/summer-serums.jpg" alt="Hyaluronic acid serums" class="rounded-xl shadow-sm w-full" />
        </div>
        <div class="md:col-span-2">
          <p class="text-gray-700 leading-relaxed mb-3">Most UAE residents are chronically dehydrated — not dry, <em>dehydrated</em>. The difference matters: oily/combination skin can still be dehydrated, which is why so many people over-moisturize and still feel tight.</p>
          <p class="text-gray-700 leading-relaxed mb-4">A layered hyaluronic serum pulls water back into the upper layers without clogging. <a href="https://genosys.ae/products/18" class="text-sky-700 font-semibold hover:underline">MOISTURE REPLENISHING HYALURON SERUM</a> uses 5 molecular weights of HA so it hydrates at every depth, not just the surface.</p>
          <a href="https://genosys.ae/products/18" class="inline-flex items-center gap-2 bg-sky-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-sky-700 transition-colors">Hyaluron Serum — 330 AED →</a>
        </div>
      </div>
    </div>

    <!-- Step 4 MOISTURIZER -->
    <div class="bg-white rounded-2xl p-6 md:p-8 mb-5 shadow-sm border border-gray-100">
      <div class="flex items-center gap-3 mb-4">
        <span class="w-10 h-10 bg-sky-600 text-white rounded-full flex items-center justify-center font-bold">4</span>
        <h4 class="text-xl md:text-2xl font-bold text-gray-900">Moisturize — lock in, do not smother</h4>
      </div>
      <p class="text-gray-700 leading-relaxed mb-3">The biggest summer mistake is using a winter moisturizer. Heavy shea/mineral-oil creams trap heat, sweat and sebum under the skin — that is exactly how heat rash forms.</p>
      <p class="text-gray-700 leading-relaxed mb-4">You want a gel-cream texture with ceramides or panthenol. Two we recommend:</p>
      <div class="grid md:grid-cols-2 gap-4 mb-4">
        <div class="bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl p-5 border border-sky-100">
          <h5 class="font-bold text-gray-900 mb-2">For combination / oily skin</h5>
          <p class="text-gray-600 text-sm leading-relaxed mb-3"><a href="https://genosys.ae/products/29" class="text-sky-700 font-semibold hover:underline">MOISTURE REPLENISHING HYALURON CREAM</a> — 290 AED. Weightless, fast-absorbing, zero shine.</p>
        </div>
        <div class="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 border border-emerald-100">
          <h5 class="font-bold text-gray-900 mb-2">For sensitive / compromised skin</h5>
          <p class="text-gray-600 text-sm leading-relaxed mb-3"><a href="https://genosys.ae/products/27" class="text-emerald-700 font-semibold hover:underline">SKIN BARRIER PROTECTING CREAM</a> — 450 AED. Rich in ceramides, rebuilds the barrier that AC and hard water are breaking down.</p>
        </div>
      </div>
      <p class="text-gray-500 text-sm italic">Not sure which one? If your cheeks ever feel tight in the afternoon, pick Skin Barrier. If your T-zone is shiny by lunch, pick Hyaluron.</p>
    </div>

    <!-- Step 5 SPF -->
    <div class="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 md:p-8 mb-5 shadow-sm border border-amber-200">
      <div class="flex items-center gap-3 mb-4">
        <span class="w-10 h-10 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold">5</span>
        <h4 class="text-xl md:text-2xl font-bold text-gray-900">SPF — the only non-negotiable</h4>
      </div>
      <div class="grid md:grid-cols-3 gap-5 items-start">
        <div class="md:col-span-1">
          <img src="/blog/summer-sunscreen1.jpg" alt="Sunscreen application UAE summer" class="rounded-xl shadow-sm w-full" />
        </div>
        <div class="md:col-span-2">
          <p class="text-gray-700 leading-relaxed mb-3">If you only do one thing from this guide, do this step. Between May and October the UAE UV index is extreme for 8+ hours a day. SPF 30 is not enough. Even SPF 50 used <em>once</em> in the morning is not enough if you are outdoors.</p>
          <p class="text-gray-700 leading-relaxed mb-3"><strong>The rule:</strong> SPF 50+ PA++++ every morning. Reapply every 2 hours if you are outside, or at 12pm and 3pm if you are mostly indoors.</p>
        </div>
      </div>

      <!-- Two Sunscreens Compared -->
      <div class="mt-6">
        <div class="mb-5">
          <img src="/blog/summer-sunscreen2.jpg" alt="Comparing two sunscreens" class="rounded-xl shadow-sm mx-auto max-w-md w-full" />
        </div>
        <div class="grid md:grid-cols-2 gap-4">
          <div class="bg-white rounded-xl p-5 border-2 border-amber-300 shadow-sm">
            <div class="flex items-baseline justify-between mb-2">
              <h5 class="font-bold text-gray-900 text-lg">Ultra Shield</h5>
              <span class="text-sm font-semibold text-amber-700">SPF 50+ PA++++</span>
            </div>
            <p class="text-gray-600 text-sm leading-relaxed mb-3">Our summer workhorse. Outdoor use, beach days, golf, school runs. Water-resistant, broad-spectrum, sits beautifully under makeup.</p>
            <p class="font-bold text-gray-900 mb-3">250 AED</p>
            <a href="https://genosys.ae/products/39" class="inline-flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-amber-700 transition-colors">Ultra Shield SPF 50+ →</a>
          </div>
          <div class="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <div class="flex items-baseline justify-between mb-2">
              <h5 class="font-bold text-gray-900 text-lg">Multi Sun</h5>
              <span class="text-sm font-semibold text-gray-600">SPF 40 PA++</span>
            </div>
            <p class="text-gray-600 text-sm leading-relaxed mb-3">Lighter daily option for short outdoor exposure and mostly-indoor days. Near-invisible finish, good for makeup wearers.</p>
            <p class="font-bold text-gray-900 mb-3">210 AED</p>
            <a href="https://genosys.ae/products/40" class="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors">Multi Sun SPF 40 →</a>
          </div>
        </div>
        <p class="text-amber-900 text-sm mt-4 bg-amber-100/60 rounded-lg p-3 border border-amber-200"><strong>UAE summer verdict:</strong> Ultra Shield from May to October. Multi Sun from November to April. No compromise in peak months.</p>
      </div>
    </div>

    <!-- Step 6 REFRESH -->
    <div class="bg-white rounded-2xl p-6 md:p-8 mb-5 shadow-sm border border-gray-100">
      <div class="flex items-center gap-3 mb-4">
        <span class="w-10 h-10 bg-sky-600 text-white rounded-full flex items-center justify-center font-bold">6</span>
        <h4 class="text-xl md:text-2xl font-bold text-gray-900">Midday refresh — the UAE-specific hack</h4>
      </div>
      <div class="grid md:grid-cols-3 gap-5 items-center">
        <div class="md:col-span-1">
          <img src="/blog/summer-mist.jpg" alt="Microbiome mist refresh" class="rounded-xl shadow-sm w-full" />
        </div>
        <div class="md:col-span-2">
          <p class="text-gray-700 leading-relaxed mb-3">Around 1–2pm, your skin has been cycling between 45°C and 22°C three or four times, your SPF is half-broken, and your makeup is starting to oxidize. A two-second mist resets everything without ruining your look.</p>
          <p class="text-gray-700 leading-relaxed mb-4"><a href="https://genosys.ae/products/14" class="text-sky-700 font-semibold hover:underline">MICROBIOME ENERGY INFUSING MIST</a> is formulated to strengthen the skin microbiome — so it not only refreshes, it makes your skin more resistant to the next round of heat, dust and AC. Keep it in your bag, desk drawer, and car.</p>
          <a href="https://genosys.ae/products/14" class="inline-flex items-center gap-2 bg-sky-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-sky-700 transition-colors">Microbiome Mist — 160 AED →</a>
        </div>
      </div>
    </div>

    <!-- Step 7 TREATMENT -->
    <div class="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
      <div class="flex items-center gap-3 mb-4">
        <span class="w-10 h-10 bg-sky-600 text-white rounded-full flex items-center justify-center font-bold">7</span>
        <h4 class="text-xl md:text-2xl font-bold text-gray-900">Weekly treatment — reset the system</h4>
      </div>
      <p class="text-gray-700 leading-relaxed mb-4">Once a week — Thursday or Friday works well in UAE — give your skin a serious reboot. Two options depending on what it is doing:</p>
      <div class="grid md:grid-cols-2 gap-4">
        <div class="bg-gradient-to-br from-sky-50 to-cyan-50 rounded-xl p-5 border border-sky-100">
          <h5 class="font-bold text-gray-900 mb-2">If your skin looks dull or tired</h5>
          <p class="text-gray-600 text-sm leading-relaxed mb-3"><a href="https://genosys.ae/products/38" class="text-sky-700 font-semibold hover:underline">EZ CO₂ MASK KIT</a> — 460 AED. CO₂-releasing gel forces oxygen into the tissue, reversing the grey/tired look that happens after a week of UAE sun.</p>
          <a href="https://genosys.ae/products/38" class="inline-flex items-center gap-2 bg-sky-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-sky-700 transition-colors">EZ CO₂ Mask →</a>
        </div>
        <div class="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-5 border border-emerald-100">
          <h5 class="font-bold text-gray-900 mb-2">If your skin feels hot or red</h5>
          <p class="text-gray-600 text-sm leading-relaxed mb-3"><a href="https://genosys.ae/products/36" class="text-emerald-700 font-semibold hover:underline">SOOTHING BOMB SEA ALGAE MASK</a> — only 36 AED. Cooling, anti-inflammatory, perfect after a day in the sun or a long flight from a cold country.</p>
          <a href="https://genosys.ae/products/36" class="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors">Soothing Bomb Mask →</a>
        </div>
      </div>
    </div>
  </div>

  <!-- Quick Reference Table -->
  <div class="mb-10">
    <h3 class="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">Quick Reference — The Full Summer Lineup</h3>
    <div class="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left font-semibold text-gray-900">Step</th>
              <th class="px-4 py-3 text-left font-semibold text-gray-900">Product</th>
              <th class="px-4 py-3 text-right font-semibold text-gray-900">Price</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr><td class="px-4 py-3 text-gray-500">1 · Cleanse</td><td class="px-4 py-3"><a href="https://genosys.ae/products/10" class="text-sky-700 hover:underline font-semibold">Snow O₂ Cleanser</a></td><td class="px-4 py-3 text-right text-gray-900 font-semibold">330 AED</td></tr>
            <tr><td class="px-4 py-3 text-gray-500">2 · Tone</td><td class="px-4 py-3"><a href="https://genosys.ae/products/15" class="text-sky-700 hover:underline font-semibold">Intensive Problem Control Toner</a></td><td class="px-4 py-3 text-right text-gray-900 font-semibold">260 AED</td></tr>
            <tr><td class="px-4 py-3 text-gray-500">3 · Serum</td><td class="px-4 py-3"><a href="https://genosys.ae/products/18" class="text-sky-700 hover:underline font-semibold">Moisture Replenishing Hyaluron Serum</a></td><td class="px-4 py-3 text-right text-gray-900 font-semibold">330 AED</td></tr>
            <tr><td class="px-4 py-3 text-gray-500">4 · Moisturize</td><td class="px-4 py-3"><a href="https://genosys.ae/products/29" class="text-sky-700 hover:underline font-semibold">Hyaluron Cream</a> <span class="text-gray-400">or</span> <a href="https://genosys.ae/products/27" class="text-sky-700 hover:underline font-semibold">Skin Barrier Cream</a></td><td class="px-4 py-3 text-right text-gray-900 font-semibold">290–450 AED</td></tr>
            <tr class="bg-amber-50/40"><td class="px-4 py-3 text-gray-500">5 · SPF</td><td class="px-4 py-3"><a href="https://genosys.ae/products/39" class="text-amber-700 hover:underline font-semibold">Ultra Shield SPF 50+ PA++++</a></td><td class="px-4 py-3 text-right text-gray-900 font-semibold">250 AED</td></tr>
            <tr><td class="px-4 py-3 text-gray-500">6 · Refresh</td><td class="px-4 py-3"><a href="https://genosys.ae/products/14" class="text-sky-700 hover:underline font-semibold">Microbiome Mist</a></td><td class="px-4 py-3 text-right text-gray-900 font-semibold">160 AED</td></tr>
            <tr><td class="px-4 py-3 text-gray-500">7 · Weekly</td><td class="px-4 py-3"><a href="https://genosys.ae/products/38" class="text-sky-700 hover:underline font-semibold">EZ CO₂ Mask Kit</a> <span class="text-gray-400">or</span> <a href="https://genosys.ae/products/36" class="text-sky-700 hover:underline font-semibold">Soothing Bomb Mask</a></td><td class="px-4 py-3 text-right text-gray-900 font-semibold">36–460 AED</td></tr>
          </tbody>
        </table>
      </div>
    </div>
    <p class="text-sm text-gray-500 text-center mt-4">Orders over 1,000 AED ship free across all UAE emirates.</p>
  </div>

  <!-- What to expect -->
  <div class="bg-gradient-to-br from-rose-50 via-white to-amber-50 rounded-2xl p-6 md:p-10 mb-10 border border-rose-100">
    <div class="grid md:grid-cols-2 gap-8 items-center">
      <div>
        <img src="/blog/summer-glow.jpg" alt="Hydrated glowing skin — UAE summer result" class="rounded-2xl shadow-lg w-full" />
      </div>
      <div>
        <h3 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">What Your Skin Will Look Like in 2–3 Weeks</h3>
        <ul class="space-y-3 text-gray-700">
          <li class="flex items-start gap-3"><span class="text-xl">✓</span><span><strong class="text-gray-900">Week 1:</strong> forehead bumps and heat rash clear up. Skin stops feeling tight in the afternoon.</span></li>
          <li class="flex items-start gap-3"><span class="text-xl">✓</span><span><strong class="text-gray-900">Week 2:</strong> T-zone calms down, cheeks stop flaking. Makeup lasts through lunch.</span></li>
          <li class="flex items-start gap-3"><span class="text-xl">✓</span><span><strong class="text-gray-900">Week 3+:</strong> real glow returns. Pigmentation from last summer starts fading. Friends ask what you are doing.</span></li>
        </ul>
        <p class="text-gray-500 text-sm italic mt-5">Consistency matters more than intensity. 7 steps, twice a day, every day, beats a 15-step routine you only manage three times a week.</p>
      </div>
    </div>
  </div>

  <!-- CTA -->
  <div class="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-8 md:p-12 text-center text-white mb-10">
    <h3 class="text-2xl md:text-3xl font-bold mb-3">Build Your Summer Routine</h3>
    <p class="text-lg text-gray-300 mb-6 max-w-xl mx-auto">Shop the full lineup at genosys.ae. If you are not sure which products are right for your skin, message us on WhatsApp — our team helps dozens of UAE customers build routines every week, free of charge.</p>
    <a
      href="https://genosys.ae"
      class="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-xl text-lg font-bold hover:bg-gray-100 transition-colors shadow-lg"
    >
      Shop the Summer Lineup
    </a>
    <p class="text-sm text-gray-500 mt-4">Free delivery on orders over 1,000 AED · All UAE emirates</p>
  </div>

  <!-- Contact -->
  <div class="bg-gray-50 rounded-2xl p-6 md:p-8 mb-8 border border-gray-100">
    <h3 class="text-xl font-bold text-gray-900 mb-4 text-center">Questions? We are happy to help.</h3>
    <div class="flex flex-wrap justify-center gap-6 text-center">
      <div>
        <p class="font-semibold text-gray-900 mb-1">Email</p>
        <a href="mailto:sales@genosys.ae" class="text-sky-700 hover:underline text-sm">sales@genosys.ae</a>
      </div>
      <div>
        <p class="font-semibold text-gray-900 mb-1">WhatsApp</p>
        <a href="https://wa.me/971585487665" class="text-sky-700 hover:underline text-sm">+971 58 548 76 65</a>
      </div>
      <div>
        <p class="font-semibold text-gray-900 mb-1">Shop</p>
        <a href="https://genosys.ae" class="text-sky-700 hover:underline text-sm">genosys.ae</a>
      </div>
    </div>
  </div>

  <!-- Signature -->
  <div class="text-center pt-6 border-t border-gray-200">
    <p class="text-gray-700 font-semibold">The GENOSYS Middle East Team</p>
    <p class="text-gray-500 text-sm italic mt-1">Professional Korean dermacosmetics, built for the UAE climate.</p>
  </div>
</div>`

// ============================================================
// ARABIC CONTENT (RTL)
// ============================================================
const titleAr = 'دليل النجاة للعناية بالبشرة في صيف الإمارات 2026 — أوقفي الذوبان والحبوب وجفاف التكييف'
const excerptAr = 'صيف دبي وأبو ظبي والشارقة يتجاوز 45° مع رطوبة 90٪ في الخارج وتكييف بارد بدرجة -22° في الداخل. هذا التناقض هو سبب ذوبان بشرتك وظهور الحبوب مع شعور الجفاف. إليكِ روتين GENOSYS من 7 خطوات الذي يستخدمه عملاؤنا للحفاظ على بشرة زجاجية من مايو إلى سبتمبر — مع تحديد الواقي الشمسي المناسب.'

const contentAr = `<div class="blog-content" dir="rtl">

  <!-- Hero -->
  <div class="bg-gradient-to-br from-sky-50 via-white to-amber-50 rounded-2xl p-6 md:p-12 mb-10 text-center border border-sky-100/50 shadow-sm">
    <img src="/blog/summer-splash.jpg" alt="روتين العناية بالبشرة لصيف الإمارات" class="rounded-2xl shadow-2xl mx-auto max-w-2xl w-full mb-8" />
    <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-3 tracking-tight">روتين نجاة بشرتك في صيف الإمارات</h2>
    <p class="text-lg md:text-xl text-gray-600 mb-2">7 خطوات · مقارنة بين واقيين شمسيين · أسعار حقيقية بالدرهم</p>
    <p class="text-base text-sky-700 font-semibold mb-6">مصمم لـ 45° خارجاً و -22° مع التكييف داخلاً</p>
    <a href="https://genosys.ae" class="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-800 transition-colors shadow-lg">تسوقي مجموعة الصيف</a>
    <p class="text-sm text-gray-500 mt-3">توصيل مجاني للطلبات فوق 1,000 درهم · جميع إمارات الدولة</p>
  </div>

  <!-- Intro -->
  <div class="mb-10">
    <p class="text-lg md:text-xl text-gray-700 leading-relaxed mb-5">إن كنتِ تعيشين في الإمارات، فأنتِ تعرفين القصة. في منتصف أبريل يبدأ الفاونديشن بالانزلاق قبل الساعة 11 صباحاً. في يونيو يتحول شعور "ذوبان البشرة" إلى أمر يومي. وفي أغسطس تجدين بشرتكِ دهنية وبها حبوب <em>وتتقشر</em> في الوقت نفسه — ولا روتين يبدو فعالاً.</p>
    <p class="text-lg md:text-xl text-gray-700 leading-relaxed mb-5">هذا ليس خطأكِ. مناخ الإمارات هو أحد أصعب المناخات على البشرة في العالم. الخبر الجيد: فور فهمكِ لـ<em>السبب</em>، يصبح الحل بسيطاً ويأخذ أقل من 10 دقائق يومياً.</p>
    <p class="text-lg md:text-xl text-gray-700 leading-relaxed">هذا الدليل هو المجموعة الدقيقة التي نوصي بها لعملائنا في الإمارات كل مايو. 7 خطوات فقط، بمنتجات GENOSYS محددة لكل خطوة.</p>
  </div>

  <!-- Why UAE Summer Is Brutal -->
  <div class="bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50 rounded-2xl p-6 md:p-10 mb-10 border border-orange-100">
    <div class="mb-6"><img src="/blog/summer-dubai.jpg" alt="أفق دبي عند الغروب" class="rounded-2xl shadow-lg mx-auto w-full" /></div>
    <div class="flex items-center gap-3 mb-6">
      <span class="text-4xl">🌡️</span>
      <h3 class="text-2xl md:text-3xl font-bold text-gray-900">لماذا صيف الإمارات قاسٍ على البشرة بشكل خاص</h3>
    </div>
    <div class="grid md:grid-cols-2 gap-5">
      <div class="bg-white/80 rounded-xl p-5 shadow-sm">
        <div class="flex items-center gap-3 mb-3"><span class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-xl">☀️</span><h4 class="font-bold text-gray-900">مؤشر UV يتجاوز 11 لخمسة أشهر</h4></div>
        <p class="text-gray-600 text-sm leading-relaxed">من مايو إلى سبتمبر يبقى مؤشر الأشعة فوق البنفسجية عند مستوى "شديد" يومياً. بدون حماية، تتراكم التصبغات ويفقد الكولاجين وتتقدم البشرة في العمر أسرع 2–3 مرات من صيف أوروبي.</p>
      </div>
      <div class="bg-white/80 rounded-xl p-5 shadow-sm">
        <div class="flex items-center gap-3 mb-3"><span class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-xl">💧</span><h4 class="font-bold text-gray-900">رطوبة خارجية 80–95٪</h4></div>
        <p class="text-gray-600 text-sm leading-relaxed">الهواء المشبع يمنع تبخر العرق. يختلط العرق مع الزيوت والواقي الشمسي ويشكل طبقة دافئة — بيئة مثالية لبكتيريا حب الشباب وانسداد المسام.</p>
      </div>
      <div class="bg-white/80 rounded-xl p-5 shadow-sm">
        <div class="flex items-center gap-3 mb-3"><span class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-xl">❄️</span><h4 class="font-bold text-gray-900">تكييف بدرجة 18–22° ورطوبة 30٪</h4></div>
        <p class="text-gray-600 text-sm leading-relaxed">بمجرد دخولكِ مولاً أو مكتباً أو سيارة، تنخفض الرطوبة من 90٪ إلى 30٪. يعوض حاجز البشرة ذلك 10–20 مرة يومياً. لهذا تشعرين بشد وجفاف في الخدين حتى مع دهنية المنطقة T.</p>
      </div>
      <div class="bg-white/80 rounded-xl p-5 shadow-sm">
        <div class="flex items-center gap-3 mb-3"><span class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-xl">🌪️</span><h4 class="font-bold text-gray-900">غبار ورمل وماء عسر</h4></div>
        <p class="text-gray-600 text-sm leading-relaxed">ماء الصنبور في الإمارات من الأعسر في العالم. مع الغبار الرملي، يصبح كل غسيل مجرداً للبشرة ما لم تستخدمي المنظف الصحيح.</p>
      </div>
    </div>
  </div>

  <!-- 7 Steps Summary (shortened AR) -->
  <div class="bg-gradient-to-br from-sky-50 via-white to-emerald-50 rounded-2xl p-6 md:p-10 mb-10 border border-sky-100">
    <div class="text-center mb-8">
      <h3 class="text-3xl md:text-4xl font-bold text-gray-900 mb-3">روتين GENOSYS الصيفي من 7 خطوات</h3>
      <p class="text-gray-600 max-w-2xl mx-auto">صباحاً ومساءً ومرة أسبوعياً. الوقت الكلي: 8–10 دقائق يومياً.</p>
    </div>

    <div class="space-y-4">
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div class="flex items-center gap-3 mb-2"><span class="w-9 h-9 bg-sky-600 text-white rounded-full flex items-center justify-center font-bold">1</span><h4 class="text-lg font-bold text-gray-900">التنظيف — دون تجريد</h4></div>
        <p class="text-gray-700 leading-relaxed mb-3">نوصي بـ<a href="https://genosys.ae/products/10" class="text-sky-700 font-semibold hover:underline">SNOW O₂ CLEANSER</a> — رغوة مؤكسجة ترفع العرق والواقي الشمسي دون إتلاف حاجز البشرة.</p>
        <a href="https://genosys.ae/products/10" class="inline-flex items-center gap-2 bg-sky-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">منظف Snow O₂ — 330 درهم ←</a>
      </div>

      <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div class="flex items-center gap-3 mb-2"><span class="w-9 h-9 bg-sky-600 text-white rounded-full flex items-center justify-center font-bold">2</span><h4 class="text-lg font-bold text-gray-900">التونر — افتحي المسام قبل أن تُسدّ</h4></div>
        <p class="text-gray-700 leading-relaxed mb-3">تونر بحمض الساليسيليك يذيب الدهون المسدودة قبل أن تصبح حبوباً. جربي <a href="https://genosys.ae/products/15" class="text-sky-700 font-semibold hover:underline">INTENSIVE PROBLEM CONTROL TONER</a>.</p>
        <a href="https://genosys.ae/products/15" class="inline-flex items-center gap-2 bg-sky-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">تونر التحكم — 260 درهم ←</a>
      </div>

      <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div class="flex items-center gap-3 mb-2"><span class="w-9 h-9 bg-sky-600 text-white rounded-full flex items-center justify-center font-bold">3</span><h4 class="text-lg font-bold text-gray-900">السيروم — استعيدي الرطوبة</h4></div>
        <p class="text-gray-700 leading-relaxed mb-3">السيروم بـ 5 أوزان جزيئية من حمض الهيالورونيك يرطب على كل الأعماق. <a href="https://genosys.ae/products/18" class="text-sky-700 font-semibold hover:underline">MOISTURE REPLENISHING HYALURON SERUM</a>.</p>
        <a href="https://genosys.ae/products/18" class="inline-flex items-center gap-2 bg-sky-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">سيروم الهيالورون — 330 درهم ←</a>
      </div>

      <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div class="flex items-center gap-3 mb-2"><span class="w-9 h-9 bg-sky-600 text-white rounded-full flex items-center justify-center font-bold">4</span><h4 class="text-lg font-bold text-gray-900">الترطيب — قوام جل-كريم</h4></div>
        <p class="text-gray-700 leading-relaxed mb-3">للبشرة المختلطة/الدهنية: <a href="https://genosys.ae/products/29" class="text-sky-700 font-semibold hover:underline">HYALURON CREAM</a> — 290 درهم. للبشرة الحساسة/المتضررة: <a href="https://genosys.ae/products/27" class="text-sky-700 font-semibold hover:underline">SKIN BARRIER PROTECTING CREAM</a> — 450 درهم.</p>
      </div>

      <div class="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 shadow-sm border border-amber-200">
        <div class="flex items-center gap-3 mb-2"><span class="w-9 h-9 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold">5</span><h4 class="text-lg font-bold text-gray-900">الواقي الشمسي — الخطوة غير القابلة للتفاوض</h4></div>
        <div class="my-4"><img src="/blog/summer-sunscreen2.jpg" alt="مقارنة بين الواقيات الشمسية" class="rounded-xl shadow-sm mx-auto max-w-sm w-full" /></div>
        <p class="text-gray-700 leading-relaxed mb-3">بين مايو وأكتوبر: SPF 50+ PA++++ كل صباح مع إعادة التطبيق كل ساعتين.</p>
        <div class="grid md:grid-cols-2 gap-3">
          <a href="https://genosys.ae/products/39" class="bg-amber-600 text-white px-4 py-3 rounded-lg text-sm font-semibold text-center">Ultra Shield SPF 50+ — 250 درهم</a>
          <a href="https://genosys.ae/products/40" class="bg-gray-900 text-white px-4 py-3 rounded-lg text-sm font-semibold text-center">Multi Sun SPF 40 — 210 درهم</a>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div class="flex items-center gap-3 mb-2"><span class="w-9 h-9 bg-sky-600 text-white rounded-full flex items-center justify-center font-bold">6</span><h4 class="text-lg font-bold text-gray-900">رذاذ منتصف النهار</h4></div>
        <p class="text-gray-700 leading-relaxed mb-3"><a href="https://genosys.ae/products/14" class="text-sky-700 font-semibold hover:underline">MICROBIOME ENERGY INFUSING MIST</a> يقوّي الميكروبيوم ويحافظ على نضارة البشرة بين الحرارة والتكييف. احتفظي به في حقيبتكِ.</p>
        <a href="https://genosys.ae/products/14" class="inline-flex items-center gap-2 bg-sky-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">ميست الميكروبيوم — 160 درهم ←</a>
      </div>

      <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div class="flex items-center gap-3 mb-2"><span class="w-9 h-9 bg-sky-600 text-white rounded-full flex items-center justify-center font-bold">7</span><h4 class="text-lg font-bold text-gray-900">علاج أسبوعي</h4></div>
        <p class="text-gray-700 leading-relaxed mb-3">للنضارة: <a href="https://genosys.ae/products/38" class="text-sky-700 font-semibold hover:underline">EZ CO₂ MASK KIT</a> — 460 درهم. للتبريد والتهدئة: <a href="https://genosys.ae/products/36" class="text-emerald-700 font-semibold hover:underline">SOOTHING BOMB</a> — 36 درهم فقط.</p>
      </div>
    </div>
  </div>

  <!-- Results -->
  <div class="bg-gradient-to-br from-rose-50 via-white to-amber-50 rounded-2xl p-6 md:p-10 mb-10 border border-rose-100">
    <div class="grid md:grid-cols-2 gap-8 items-center">
      <div><img src="/blog/summer-glow.jpg" alt="بشرة مشرقة بعد الروتين" class="rounded-2xl shadow-lg w-full" /></div>
      <div>
        <h3 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">النتيجة خلال 2–3 أسابيع</h3>
        <ul class="space-y-3 text-gray-700">
          <li class="flex items-start gap-3"><span class="text-xl">✓</span><span><strong>الأسبوع 1:</strong> تختفي حبوب الجبين وتتوقف البشرة عن الشد.</span></li>
          <li class="flex items-start gap-3"><span class="text-xl">✓</span><span><strong>الأسبوع 2:</strong> تهدأ منطقة T وتتوقف الخدود عن التقشر.</span></li>
          <li class="flex items-start gap-3"><span class="text-xl">✓</span><span><strong>الأسبوع 3:</strong> تعود الإشراقة الحقيقية وتبدأ تصبغات الصيف الماضي في التلاشي.</span></li>
        </ul>
      </div>
    </div>
  </div>

  <!-- CTA -->
  <div class="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-8 md:p-12 text-center text-white mb-10">
    <h3 class="text-2xl md:text-3xl font-bold mb-3">ابنِ روتينك الصيفي</h3>
    <p class="text-lg text-gray-300 mb-6 max-w-xl mx-auto">تسوقي المجموعة الكاملة على genosys.ae. إن لم تعرفي ما يناسب بشرتكِ راسلينا على واتساب.</p>
    <a href="https://genosys.ae" class="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-xl text-lg font-bold">تسوقي الآن</a>
    <p class="text-sm text-gray-500 mt-4">توصيل مجاني فوق 1,000 درهم · كل الإمارات</p>
  </div>

  <!-- Contact -->
  <div class="bg-gray-50 rounded-2xl p-6 md:p-8 mb-8 border border-gray-100">
    <h3 class="text-xl font-bold text-gray-900 mb-4 text-center">أسئلة؟ يسعدنا مساعدتكِ.</h3>
    <div class="flex flex-wrap justify-center gap-6 text-center">
      <div><p class="font-semibold text-gray-900 mb-1">البريد</p><a href="mailto:sales@genosys.ae" class="text-sky-700 hover:underline text-sm">sales@genosys.ae</a></div>
      <div><p class="font-semibold text-gray-900 mb-1">واتساب</p><a href="https://wa.me/971585487665" class="text-sky-700 hover:underline text-sm">+971 58 548 76 65</a></div>
      <div><p class="font-semibold text-gray-900 mb-1">المتجر</p><a href="https://genosys.ae" class="text-sky-700 hover:underline text-sm">genosys.ae</a></div>
    </div>
  </div>

  <div class="text-center pt-6 border-t border-gray-200">
    <p class="text-gray-700 font-semibold">فريق GENOSYS الشرق الأوسط</p>
    <p class="text-gray-500 text-sm italic mt-1">مستحضرات تجميل طبية كورية احترافية، مصممة لمناخ الإمارات.</p>
  </div>
</div>`

// ============================================================
// RUSSIAN CONTENT
// ============================================================
const titleRu = 'Гид по уходу за кожей летом в ОАЭ 2026 — как остановить «плавление», высыпания и сухость от кондиционера'
const excerptRu = 'Лето в Дубае, Абу-Даби и Шардже — это +45°C и 90% влажности на улице и −22°C сухого кондиционера в помещении. Именно этот контраст заставляет кожу «плавиться», высыпать и всё равно шелушиться. Вот точный 7-шаговый протокол GENOSYS, который наши клиенты используют, чтобы сохранить glass-skin с мая по сентябрь — плюс какой именно SPF носить.'

const contentRu = `<div class="blog-content">

  <!-- Hero -->
  <div class="bg-gradient-to-br from-sky-50 via-white to-amber-50 rounded-2xl p-6 md:p-12 mb-10 text-center border border-sky-100/50 shadow-sm">
    <img src="/blog/summer-splash.jpg" alt="Летний уход за кожей в ОАЭ" class="rounded-2xl shadow-2xl mx-auto max-w-2xl w-full mb-8" />
    <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-3 tracking-tight">Ваш летний протокол ухода в ОАЭ</h2>
    <p class="text-lg md:text-xl text-gray-600 mb-2">7 шагов · сравнение двух SPF · реальные цены в дирхамах</p>
    <p class="text-base text-sky-700 font-semibold mb-6">Написано для +45° снаружи и −22° кондиционера внутри</p>
    <a href="https://genosys.ae" class="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-800 transition-colors shadow-lg">Собрать летнюю линейку</a>
    <p class="text-sm text-gray-500 mt-3">Бесплатная доставка от 1 000 AED · Все эмираты</p>
  </div>

  <!-- Intro -->
  <div class="mb-10">
    <p class="text-lg md:text-xl text-gray-700 leading-relaxed mb-5">Если вы живёте в ОАЭ, вы знаете сценарий. К середине апреля тональный крем начинает «сползать» уже к 11 утра. В июне ощущение «плавящейся кожи» становится ежедневной нормой. К августу кожа одновременно <em>жирная</em>, с воспалениями <em>и</em> шелушится — и ни один уход не помогает.</p>
    <p class="text-lg md:text-xl text-gray-700 leading-relaxed mb-5">Это не потому, что вы делаете что-то не так. Климат ОАЭ — один из самых сложных в мире для кожи. Хорошая новость: как только вы поймёте <em>почему</em> это происходит, решение займёт меньше 10 минут в день.</p>
    <p class="text-lg md:text-xl text-gray-700 leading-relaxed">Это тот самый протокол, который мы рекомендуем нашим клиентам каждый май. Никакой воды, никаких 20-шаговых рутин — только 7 шагов, которые реально работают в этом климате, с конкретными продуктами GENOSYS.</p>
  </div>

  <!-- Why UAE Summer Is Brutal -->
  <div class="bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50 rounded-2xl p-6 md:p-10 mb-10 border border-orange-100">
    <div class="mb-6"><img src="/blog/summer-dubai.jpg" alt="Дубай на закате — летняя жара" class="rounded-2xl shadow-lg mx-auto w-full" /></div>
    <div class="flex items-center gap-3 mb-6">
      <span class="text-4xl">🌡️</span>
      <h3 class="text-2xl md:text-3xl font-bold text-gray-900">Почему лето в ОАЭ — особо тяжёлое испытание для кожи</h3>
    </div>
    <div class="grid md:grid-cols-2 gap-5">
      <div class="bg-white/80 rounded-xl p-5 shadow-sm">
        <div class="flex items-center gap-3 mb-3"><span class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-xl">☀️</span><h4 class="font-bold text-gray-900">UV-индекс 11+ пять месяцев подряд</h4></div>
        <p class="text-gray-600 text-sm leading-relaxed">С мая по сентябрь UV-индекс держится на «экстремальном» уровне ежедневно. Без защиты кожа накапливает пигмент, теряет коллаген и стареет в 2–3 раза быстрее, чем в европейское лето.</p>
      </div>
      <div class="bg-white/80 rounded-xl p-5 shadow-sm">
        <div class="flex items-center gap-3 mb-3"><span class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-xl">💧</span><h4 class="font-bold text-gray-900">Влажность 80–95% на улице</h4></div>
        <p class="text-gray-600 text-sm leading-relaxed">При такой влажности пот не испаряется. Себум, пот и SPF смешиваются в тёплую плёнку — идеальную среду для <em>C. acnes</em> и закупорки пор.</p>
      </div>
      <div class="bg-white/80 rounded-xl p-5 shadow-sm">
        <div class="flex items-center gap-3 mb-3"><span class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-xl">❄️</span><h4 class="font-bold text-gray-900">Кондиционер +18–22°, влажность 30%</h4></div>
        <p class="text-gray-600 text-sm leading-relaxed">Как только вы заходите в моллa, офис или машину, влажность падает с 90% до 30%. Барьер кожи компенсирует это 10–20 раз в день. Именно поэтому щёки могут стягиваться и шелушиться, даже если Т-зона блестит.</p>
      </div>
      <div class="bg-white/80 rounded-xl p-5 shadow-sm">
        <div class="flex items-center gap-3 mb-3"><span class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-xl">🌪️</span><h4 class="font-bold text-gray-900">Пыль, песок и жёсткая вода</h4></div>
        <p class="text-gray-600 text-sm leading-relaxed">Водопроводная вода в ОАЭ — одна из самых жёстких в мире (кальций, магний, хлор). Вместе с песочной пылью каждое умывание слегка стягивает кожу, если вы не используете правильное средство.</p>
      </div>
    </div>
  </div>

  <!-- 7 Steps -->
  <div class="bg-gradient-to-br from-sky-50 via-white to-emerald-50 rounded-2xl p-6 md:p-10 mb-10 border border-sky-100">
    <div class="text-center mb-8">
      <h3 class="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Летний протокол GENOSYS в 7 шагах</h3>
      <p class="text-gray-600 max-w-2xl mx-auto">Утро + вечер + раз в неделю. Всего 8–10 минут в день.</p>
    </div>

    <div class="space-y-4">
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div class="flex items-center gap-3 mb-3"><span class="w-9 h-9 bg-sky-600 text-white rounded-full flex items-center justify-center font-bold">1</span><h4 class="text-lg font-bold text-gray-900">Очищение — без травмирования</h4></div>
        <p class="text-gray-700 leading-relaxed mb-3">Летом коже нужно <strong>больше</strong> очищения (пот, SPF, пыль), но <strong>мягче</strong> (жёсткая вода уже истощает барьер). Ответ — кислородная пенка, а не сульфатная чистка.</p>
        <p class="text-gray-700 leading-relaxed mb-3">Наш выбор — <a href="https://genosys.ae/products/10" class="text-sky-700 font-semibold hover:underline">SNOW O₂ CLEANSER</a>. Вспенивается при контакте с водой, снимает себум и SPF, не стягивает.</p>
        <a href="https://genosys.ae/products/10" class="inline-flex items-center gap-2 bg-sky-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">Snow O₂ Cleanser — 330 AED →</a>
      </div>

      <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div class="flex items-center gap-3 mb-3"><span class="w-9 h-9 bg-sky-600 text-white rounded-full flex items-center justify-center font-bold">2</span><h4 class="text-lg font-bold text-gray-900">Тоник — раскрой поры до того, как они забьются</h4></div>
        <p class="text-gray-700 leading-relaxed mb-3">Тоник с BHA растворяет сальную пробку до того, как она станет прыщом. Ежедневно с мая — самый эффективный шаг против летнего акне. Используйте <a href="https://genosys.ae/products/15" class="text-sky-700 font-semibold hover:underline">INTENSIVE PROBLEM CONTROL TONER</a>.</p>
        <a href="https://genosys.ae/products/15" class="inline-flex items-center gap-2 bg-sky-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">Problem Control Toner — 260 AED →</a>
      </div>

      <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div class="flex items-center gap-3 mb-3"><span class="w-9 h-9 bg-sky-600 text-white rounded-full flex items-center justify-center font-bold">3</span><h4 class="text-lg font-bold text-gray-900">Сыворотка — верните то, что забрал кондиционер</h4></div>
        <p class="text-gray-700 leading-relaxed mb-3">Большинство жителей ОАЭ хронически <em>обезвожены</em>, не сухие. Это важная разница: жирная кожа тоже может быть обезвоженной. <a href="https://genosys.ae/products/18" class="text-sky-700 font-semibold hover:underline">MOISTURE REPLENISHING HYALURON SERUM</a> содержит 5 молекулярных весов гиалуроновой кислоты — увлажнение на всех глубинах.</p>
        <a href="https://genosys.ae/products/18" class="inline-flex items-center gap-2 bg-sky-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">Hyaluron Serum — 330 AED →</a>
      </div>

      <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div class="flex items-center gap-3 mb-3"><span class="w-9 h-9 bg-sky-600 text-white rounded-full flex items-center justify-center font-bold">4</span><h4 class="text-lg font-bold text-gray-900">Увлажнение — фиксируй, но не души</h4></div>
        <p class="text-gray-700 leading-relaxed mb-3">Главная летняя ошибка — зимний крем. Плотные кремы на ши/минеральном масле «запирают» жар и пот — именно так возникает тепловая сыпь. Нужна текстура гель-крема с керамидами или пантенолом.</p>
        <div class="grid md:grid-cols-2 gap-3 mt-3">
          <a href="https://genosys.ae/products/29" class="bg-sky-600 text-white px-4 py-3 rounded-lg text-sm font-semibold text-center">Hyaluron Cream (комби/жирная) — 290 AED</a>
          <a href="https://genosys.ae/products/27" class="bg-emerald-600 text-white px-4 py-3 rounded-lg text-sm font-semibold text-center">Skin Barrier Cream (чувств.) — 450 AED</a>
        </div>
      </div>

      <div class="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 shadow-sm border border-amber-200">
        <div class="flex items-center gap-3 mb-3"><span class="w-9 h-9 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold">5</span><h4 class="text-lg font-bold text-gray-900">SPF — единственный шаг без компромиссов</h4></div>
        <div class="my-4"><img src="/blog/summer-sunscreen2.jpg" alt="Сравнение SPF" class="rounded-xl shadow-sm mx-auto max-w-sm w-full" /></div>
        <p class="text-gray-700 leading-relaxed mb-3">С мая по октябрь — SPF 50+ PA++++ каждое утро. Обновлять каждые 2 часа на улице или в 12:00 и 15:00 в помещении.</p>
        <div class="grid md:grid-cols-2 gap-3">
          <div class="bg-white rounded-xl p-4 border-2 border-amber-300">
            <h5 class="font-bold text-gray-900 mb-1">Ultra Shield SPF 50+ PA++++</h5>
            <p class="text-gray-600 text-xs mb-2">Рабочая лошадка лета. Пляж, гольф, школа.</p>
            <a href="https://genosys.ae/products/39" class="inline-flex items-center gap-2 bg-amber-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold">250 AED →</a>
          </div>
          <div class="bg-white rounded-xl p-4 border border-gray-200">
            <h5 class="font-bold text-gray-900 mb-1">Multi Sun SPF 40 PA++</h5>
            <p class="text-gray-600 text-xs mb-2">Лёгкий вариант для «в основном внутри» дней.</p>
            <a href="https://genosys.ae/products/40" class="inline-flex items-center gap-2 bg-gray-900 text-white px-3 py-1.5 rounded-lg text-sm font-semibold">210 AED →</a>
          </div>
        </div>
        <p class="text-amber-900 text-sm mt-4 bg-amber-100/60 rounded-lg p-3"><strong>Вердикт для лета в ОАЭ:</strong> Ultra Shield с мая по октябрь. Multi Sun с ноября по апрель. Никаких компромиссов в пиковые месяцы.</p>
      </div>

      <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div class="flex items-center gap-3 mb-3"><span class="w-9 h-9 bg-sky-600 text-white rounded-full flex items-center justify-center font-bold">6</span><h4 class="text-lg font-bold text-gray-900">Освежение в середине дня — хак для ОАЭ</h4></div>
        <p class="text-gray-700 leading-relaxed mb-3">К 13–14 часам кожа уже 3–4 раза прошла цикл «+45° → +22°». Двухсекундный мист сбрасывает всё, не портя макияж. <a href="https://genosys.ae/products/14" class="text-sky-700 font-semibold hover:underline">MICROBIOME ENERGY INFUSING MIST</a> укрепляет микробиом — кожа становится устойчивее к следующему раунду жары и кондиционера.</p>
        <a href="https://genosys.ae/products/14" class="inline-flex items-center gap-2 bg-sky-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">Microbiome Mist — 160 AED →</a>
      </div>

      <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div class="flex items-center gap-3 mb-3"><span class="w-9 h-9 bg-sky-600 text-white rounded-full flex items-center justify-center font-bold">7</span><h4 class="text-lg font-bold text-gray-900">Еженедельная процедура — перезагрузка</h4></div>
        <p class="text-gray-700 leading-relaxed mb-3">Раз в неделю дайте коже серьёзный ребут. Для тусклости — <a href="https://genosys.ae/products/38" class="text-sky-700 font-semibold hover:underline">EZ CO₂ MASK KIT</a> (460 AED): CO₂ принудительно насыщает ткани кислородом. Для жара и красноты — <a href="https://genosys.ae/products/36" class="text-emerald-700 font-semibold hover:underline">SOOTHING BOMB</a> (всего 36 AED): охлаждает и успокаивает.</p>
      </div>
    </div>
  </div>

  <!-- Quick Reference -->
  <div class="mb-10">
    <h3 class="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">Шпаргалка — вся летняя линейка</h3>
    <div class="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left font-semibold text-gray-900">Шаг</th>
            <th class="px-4 py-3 text-left font-semibold text-gray-900">Продукт</th>
            <th class="px-4 py-3 text-right font-semibold text-gray-900">Цена</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr><td class="px-4 py-3 text-gray-500">1 · Очищение</td><td class="px-4 py-3"><a href="https://genosys.ae/products/10" class="text-sky-700 hover:underline font-semibold">Snow O₂ Cleanser</a></td><td class="px-4 py-3 text-right font-semibold">330 AED</td></tr>
          <tr><td class="px-4 py-3 text-gray-500">2 · Тоник</td><td class="px-4 py-3"><a href="https://genosys.ae/products/15" class="text-sky-700 hover:underline font-semibold">Intensive Problem Control Toner</a></td><td class="px-4 py-3 text-right font-semibold">260 AED</td></tr>
          <tr><td class="px-4 py-3 text-gray-500">3 · Сыворотка</td><td class="px-4 py-3"><a href="https://genosys.ae/products/18" class="text-sky-700 hover:underline font-semibold">Moisture Replenishing Hyaluron Serum</a></td><td class="px-4 py-3 text-right font-semibold">330 AED</td></tr>
          <tr><td class="px-4 py-3 text-gray-500">4 · Крем</td><td class="px-4 py-3"><a href="https://genosys.ae/products/29" class="text-sky-700 hover:underline font-semibold">Hyaluron Cream</a> <span class="text-gray-400">или</span> <a href="https://genosys.ae/products/27" class="text-sky-700 hover:underline font-semibold">Skin Barrier</a></td><td class="px-4 py-3 text-right font-semibold">290–450 AED</td></tr>
          <tr class="bg-amber-50/40"><td class="px-4 py-3 text-gray-500">5 · SPF</td><td class="px-4 py-3"><a href="https://genosys.ae/products/39" class="text-amber-700 hover:underline font-semibold">Ultra Shield SPF 50+ PA++++</a></td><td class="px-4 py-3 text-right font-semibold">250 AED</td></tr>
          <tr><td class="px-4 py-3 text-gray-500">6 · Мист</td><td class="px-4 py-3"><a href="https://genosys.ae/products/14" class="text-sky-700 hover:underline font-semibold">Microbiome Mist</a></td><td class="px-4 py-3 text-right font-semibold">160 AED</td></tr>
          <tr><td class="px-4 py-3 text-gray-500">7 · Еженед.</td><td class="px-4 py-3"><a href="https://genosys.ae/products/38" class="text-sky-700 hover:underline font-semibold">EZ CO₂ Mask</a> <span class="text-gray-400">или</span> <a href="https://genosys.ae/products/36" class="text-sky-700 hover:underline font-semibold">Soothing Bomb</a></td><td class="px-4 py-3 text-right font-semibold">36–460 AED</td></tr>
        </tbody>
      </table>
    </div>
    <p class="text-sm text-gray-500 text-center mt-4">При заказе от 1 000 AED доставка по ОАЭ бесплатная.</p>
  </div>

  <!-- Results -->
  <div class="bg-gradient-to-br from-rose-50 via-white to-amber-50 rounded-2xl p-6 md:p-10 mb-10 border border-rose-100">
    <div class="grid md:grid-cols-2 gap-8 items-center">
      <div><img src="/blog/summer-glow.jpg" alt="Сияющая кожа — результат ухода" class="rounded-2xl shadow-lg w-full" /></div>
      <div>
        <h3 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Что будет с кожей через 2–3 недели</h3>
        <ul class="space-y-3 text-gray-700">
          <li class="flex items-start gap-3"><span class="text-xl">✓</span><span><strong>Неделя 1:</strong> уходят лобные бугорки и тепловая сыпь. Кожа перестаёт стягиваться во второй половине дня.</span></li>
          <li class="flex items-start gap-3"><span class="text-xl">✓</span><span><strong>Неделя 2:</strong> Т-зона успокаивается, щёки перестают шелушиться. Макияж держится до обеда.</span></li>
          <li class="flex items-start gap-3"><span class="text-xl">✓</span><span><strong>Неделя 3+:</strong> возвращается настоящее сияние. Пигмент с прошлого лета начинает уходить. Подруги спрашивают, что вы делаете.</span></li>
        </ul>
        <p class="text-gray-500 text-sm italic mt-5">Важнее регулярность, чем интенсивность. 7 шагов дважды в день ежедневно побеждают 15-шаговую рутину три раза в неделю.</p>
      </div>
    </div>
  </div>

  <!-- CTA -->
  <div class="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-8 md:p-12 text-center text-white mb-10">
    <h3 class="text-2xl md:text-3xl font-bold mb-3">Соберите свою летнюю линейку</h3>
    <p class="text-lg text-gray-300 mb-6 max-w-xl mx-auto">Вся линейка — на genosys.ae. Не уверены, что подходит именно вам — напишите нам в WhatsApp. Помогаем бесплатно каждую неделю десяткам клиентов в ОАЭ.</p>
    <a href="https://genosys.ae" class="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-xl text-lg font-bold hover:bg-gray-100 transition-colors shadow-lg">Открыть магазин</a>
    <p class="text-sm text-gray-500 mt-4">Бесплатная доставка от 1 000 AED · Все эмираты</p>
  </div>

  <!-- Contact -->
  <div class="bg-gray-50 rounded-2xl p-6 md:p-8 mb-8 border border-gray-100">
    <h3 class="text-xl font-bold text-gray-900 mb-4 text-center">Есть вопросы? Мы поможем.</h3>
    <div class="flex flex-wrap justify-center gap-6 text-center">
      <div><p class="font-semibold text-gray-900 mb-1">Email</p><a href="mailto:sales@genosys.ae" class="text-sky-700 hover:underline text-sm">sales@genosys.ae</a></div>
      <div><p class="font-semibold text-gray-900 mb-1">WhatsApp</p><a href="https://wa.me/971585487665" class="text-sky-700 hover:underline text-sm">+971 58 548 76 65</a></div>
      <div><p class="font-semibold text-gray-900 mb-1">Магазин</p><a href="https://genosys.ae" class="text-sky-700 hover:underline text-sm">genosys.ae</a></div>
    </div>
  </div>

  <div class="text-center pt-6 border-t border-gray-200">
    <p class="text-gray-700 font-semibold">Команда GENOSYS Middle East</p>
    <p class="text-gray-500 text-sm italic mt-1">Профессиональная корейская дермакосметика — собранная под климат ОАЭ.</p>
  </div>
</div>`

// ============================================================
// CREATE / UPDATE THE POST
// ============================================================
const featuredImage = '/blog/summer-splash.jpg'
const authorName = 'GENOSYS Team'
const publishedAt = new Date('2026-04-17T10:00:00+04:00')
const tags = JSON.stringify([
  'Summer Skincare',
  'UAE',
  'Dubai',
  'SPF',
  'Sun Protection',
  'Korean Skincare',
  'Hydration',
  'Acne',
  'Skincare Routine',
  'GENOSYS UAE',
])

async function createBlogPost() {
  try {
    console.log('Creating UAE Summer Survival Guide blog post...')
    console.log('')

    const existingPost = await prisma.blogPost.findUnique({ where: { slug } })

    if (existingPost) {
      console.log(`Post with slug "${slug}" already exists. Updating...`)
      const updatedPost = await prisma.blogPost.update({
        where: { id: existingPost.id },
        data: {
          title,
          titleAr,
          titleRu,
          slug,
          excerpt,
          excerptAr,
          excerptRu,
          content,
          contentAr,
          contentRu,
          featuredImage,
          authorName,
          published: true,
          publishedAt,
          tags,
        },
      })

      console.log('Blog post UPDATED successfully!')
      console.log(`   ID: ${updatedPost.id}`)
      console.log(`   Slug: ${updatedPost.slug}`)
    } else {
      const newPost = await prisma.blogPost.create({
        data: {
          title,
          titleAr,
          titleRu,
          slug,
          excerpt,
          excerptAr,
          excerptRu,
          content,
          contentAr,
          contentRu,
          featuredImage,
          authorName,
          published: true,
          publishedAt,
          tags,
        },
      })

      console.log('Blog post CREATED successfully!')
      console.log(`   ID: ${newPost.id}`)
      console.log(`   Slug: ${newPost.slug}`)
    }

    console.log('')
    console.log('URLs:')
    console.log(`   EN: https://genosys.ae/blog/${slug}`)
    console.log(`   AR: https://genosys.ae/ar/blog/${slug}`)
    console.log(`   RU: https://genosys.ae/ru/blog/${slug}`)

    await prisma.$disconnect()
    process.exit(0)
  } catch (error) {
    console.error('Error creating blog post:', error)
    await prisma.$disconnect()
    process.exit(1)
  }
}

createBlogPost()
