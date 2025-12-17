import 'dotenv/config'
import { prisma } from '@/lib/prisma'
import { debugLog, errorLog } from '@/lib/logger'

async function createIOSAppAnnouncementBlogPost() {
  try {
    const slug = 'native-ios-app-coming-january-2026'
    
    // Check if post already exists
    const existing = await prisma.blogPost.findUnique({
      where: { slug }
    })

    if (existing) {
      console.log(`⚠️  Blog post with slug "${slug}" already exists. Deleting and recreating...`)
      await prisma.blogPost.delete({
        where: { slug }
      })
    }
    
    // English content
    const title = '📱 GENOSYS Native iOS App Coming January 1st, 2026!'
    const excerpt = 'Experience the future of skincare shopping! Our brand-new native iOS app launches January 1st, 2026, featuring Apple Pay, seamless checkout, and exclusive mobile-only benefits. Download from the App Store soon!'
    const content = `<div class="blog-content">
  <div class="intro-section bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6 md:p-8 mb-8">
    <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">📱 GENOSYS Native iOS App</h2>
    <p class="text-xl md:text-2xl text-primary-600 font-bold text-center mb-2">Launching January 1st, 2026!</p>
    <p class="text-lg text-gray-700 text-center">The Ultimate Skincare Shopping Experience on iPhone & iPad</p>
  </div>

  <div class="feature-section mb-8">
    <p class="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
      We're thrilled to announce that <strong class="text-primary-600">GENOSYS Middle East is launching a native iOS app</strong> exclusively for iPhone and iPad users! Mark your calendars for <strong>January 1st, 2026</strong>—the day premium Korean skincare shopping goes mobile.
    </p>
    <p class="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
      Our development team has been working tirelessly to create an app that's not just beautiful, but incredibly powerful, fast, and intuitive. This isn't just a mobile version of our website—it's a completely reimagined shopping experience designed specifically for iOS.
    </p>
  </div>

  <div class="feature-section mb-8">
    <h3 class="text-2xl font-bold text-gray-900 mb-4">✨ What Makes Our iOS App Special</h3>
    <div class="space-y-4 text-gray-700 text-lg mb-6">
      <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <h4 class="font-bold text-primary-600 mb-2">🍎 Apple Pay Integration</h4>
        <p>Check out in seconds with Apple Pay! No need to type card details—just authenticate with Face ID or Touch ID and you're done.</p>
      </div>
      <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <h4 class="font-bold text-primary-600 mb-2">💳 Multiple Payment Options</h4>
        <p>Pay your way with Apple Pay, Stripe, payment links, and all major credit cards. Secure, fast, and convenient.</p>
      </div>
      <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <h4 class="font-bold text-primary-600 mb-2">⚡️ Lightning-Fast Performance</h4>
        <p>Native iOS technology means instant loading, smooth animations, and a buttery-smooth experience that feels amazing on your iPhone or iPad.</p>
      </div>
      <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <h4 class="font-bold text-primary-600 mb-2">🛍️ Seamless Shopping Cart</h4>
        <p>Add products, adjust quantities, and checkout faster than ever. Your cart syncs across all your devices automatically.</p>
      </div>
      <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <h4 class="font-bold text-primary-600 mb-2">❤️ Favorites & Wishlist</h4>
        <p>Save your favorite products with a single tap. Build your wishlist and get notified about restocks and special offers.</p>
      </div>
      <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <h4 class="font-bold text-primary-600 mb-2">📦 Real-Time Order Tracking</h4>
        <p>Track your orders in real-time from purchase to delivery. Get push notifications at every step of your order journey.</p>
      </div>
      <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <h4 class="font-bold text-primary-600 mb-2">🌍 Multi-Language Support</h4>
        <p>Shop in English, Arabic, or Russian with full RTL support for Arabic speakers. Everything is localized just for you.</p>
      </div>
      <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <h4 class="font-bold text-primary-600 mb-2">🔐 Touch ID & Face ID Security</h4>
        <p>Your account is protected with biometric authentication. Quick login with Face ID or Touch ID—no passwords needed.</p>
      </div>
      <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <h4 class="font-bold text-primary-600 mb-2">📱 Beautiful Product Gallery</h4>
        <p>Stunning high-resolution product images optimized for Retina displays. Pinch to zoom and see every detail.</p>
      </div>
      <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <h4 class="font-bold text-primary-600 mb-2">🎁 Exclusive Mobile Offers</h4>
        <p>Get access to app-only deals, early product launches, and special promotions just for iOS users.</p>
      </div>
    </div>
  </div>

  <div class="feature-section mb-8 text-center">
    <img 
      src="/images/genosys-products.jpg" 
      alt="GENOSYS Professional Korean Dermacosmetics Products" 
      class="rounded-xl shadow-lg mx-auto max-w-full h-auto mb-4"
    />
    <p class="text-sm text-gray-600 italic">Browse our complete collection on your iPhone or iPad</p>
  </div>

  <div class="feature-section mb-8 bg-gradient-to-r from-primary-50 to-purple-50 rounded-xl p-6 md:p-8">
    <h3 class="text-2xl font-bold text-gray-900 mb-4">💰 Payment Options Built for Convenience</h3>
    <p class="text-lg md:text-xl text-gray-700 leading-relaxed mb-4">
      We know how important it is to have flexible payment options. That's why our iOS app supports:
    </p>
    <ul class="list-disc list-inside space-y-2 text-gray-700 text-lg mb-4">
      <li><strong>Apple Pay</strong> – The fastest, most secure way to pay on iOS</li>
      <li><strong>Stripe</strong> – Industry-leading payment processing with bank-level security</li>
      <li><strong>Payment Links</strong> – Share and pay via secure links</li>
      <li><strong>Visa, Mastercard, Amex</strong> – All major credit and debit cards accepted</li>
      <li><strong>Saved Cards</strong> – Securely save your payment methods for one-tap checkout</li>
    </ul>
    <p class="text-lg md:text-xl text-gray-700 leading-relaxed font-semibold text-primary-600">
      Every transaction is encrypted and secured with industry-standard SSL technology. Your payment information is never stored on your device.
    </p>
  </div>

  <div class="feature-section mb-8">
    <h3 class="text-2xl font-bold text-gray-900 mb-4">🚀 Why Native iOS?</h3>
    <p class="text-lg text-gray-700 leading-relaxed mb-4">
      You might be wondering: "Why not just use the website?" Great question! Here's why native iOS apps are game-changers:
    </p>
    <div class="space-y-3 text-gray-700 text-lg mb-6">
      <div class="flex items-start gap-3">
        <span class="text-2xl">⚡️</span>
        <div>
          <strong>Speed:</strong> Native apps are up to 5x faster than web apps. No waiting, no loading spinners.
        </div>
      </div>
      <div class="flex items-start gap-3">
        <span class="text-2xl">🎨</span>
        <div>
          <strong>Design:</strong> Beautiful, native iOS design that follows Apple's Human Interface Guidelines. It feels right at home on your iPhone.
        </div>
      </div>
      <div class="flex items-start gap-3">
        <span class="text-2xl">🔔</span>
        <div>
          <strong>Notifications:</strong> Get instant push notifications for order updates, special offers, and restocks—even when the app is closed.
        </div>
      </div>
      <div class="flex items-start gap-3">
        <span class="text-2xl">📵</span>
        <div>
          <strong>Offline Mode:</strong> Browse your favorites and order history even without internet. Your data syncs automatically when you're back online.
        </div>
      </div>
      <div class="flex items-start gap-3">
        <span class="text-2xl">🔐</span>
        <div>
          <strong>Security:</strong> Face ID and Touch ID integration means your account is ultra-secure without remembering passwords.
        </div>
      </div>
    </div>
  </div>

  <div class="feature-section mb-8 text-center">
    <img 
      src="/images/genosys-logo.png" 
      alt="GENOSYS Logo - Professional Korean Dermacosmetics" 
      class="rounded-xl shadow-lg mx-auto max-w-xs h-auto mb-4"
    />
  </div>

  <div class="feature-section mb-8 bg-blue-50 rounded-xl p-6 md:p-8">
    <h3 class="text-2xl font-bold text-gray-900 mb-4">🎯 Who Is This App For?</h3>
    <p class="text-lg text-gray-700 leading-relaxed mb-4">
      Our iOS app is perfect for:
    </p>
    <ul class="list-disc list-inside space-y-2 text-gray-700 text-lg mb-4">
      <li>Busy professionals who need quick, convenient shopping on-the-go</li>
      <li>Skincare enthusiasts who want instant access to new products and launches</li>
      <li>Beauty professionals and clinic owners who order regularly</li>
      <li>Anyone who loves the smoothness and speed of native iOS apps</li>
      <li>Customers who prefer shopping on their iPhone or iPad</li>
    </ul>
  </div>

  <div class="feature-section mb-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 md:p-8">
    <h3 class="text-2xl font-bold text-gray-900 mb-4">📅 Launch Timeline</h3>
    <div class="space-y-4 text-gray-700 text-lg">
      <div class="flex items-center gap-4">
        <span class="text-3xl">✅</span>
        <div>
          <strong>December 2025:</strong> Final testing and App Store submission
        </div>
      </div>
      <div class="flex items-center gap-4">
        <span class="text-3xl">🎉</span>
        <div>
          <strong>January 1st, 2026:</strong> Official launch on the Apple App Store!
        </div>
      </div>
      <div class="flex items-center gap-4">
        <span class="text-3xl">📲</span>
        <div>
          <strong>Post-Launch:</strong> Continuous updates, new features, and improvements based on your feedback
        </div>
      </div>
    </div>
  </div>

  <div class="cta-section bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-xl p-6 md:p-8 text-center">
    <p class="text-2xl md:text-3xl font-bold mb-4">🎊 Get Ready for Launch!</p>
    <p class="text-lg md:text-xl mb-4">
      We can't wait for you to experience the new GENOSYS iOS app. It's been months in the making, and we're confident you'll love every pixel.
    </p>
    <p class="text-base md:text-lg font-semibold mb-2">
      Mark your calendars: <strong>January 1st, 2026</strong>
    </p>
    <p class="text-base md:text-lg mb-4">
      Download from the Apple App Store and be among the first to shop with our revolutionary new app!
    </p>
    <p class="text-base md:text-lg font-semibold">
      🚚 Free shipping on orders over 1,000 AED • ⚡️ Lightning-fast checkout • 🍎 Apple Pay ready
    </p>
  </div>

  <div class="feature-section mt-8 mb-8 bg-gray-50 rounded-xl p-6 md:p-8">
    <h3 class="text-2xl font-bold text-gray-900 mb-4">💬 We'd Love to Hear From You!</h3>
    <p class="text-lg text-gray-700 leading-relaxed mb-4">
      Have questions about the app? Want to request a specific feature? Reach out to us:
    </p>
    <ul class="list-none space-y-2 text-gray-700 text-lg">
      <li>📧 Email: <a href="mailto:sales@genosys.ae" class="text-primary-600 hover:underline">sales@genosys.ae</a></li>
      <li>📱 WhatsApp: <a href="https://wa.me/971585487665" class="text-primary-600 hover:underline">+971 58 548 76 65</a></li>
      <li>🌐 Website: <a href="https://genosys.ae" class="text-primary-600 hover:underline">genosys.ae</a></li>
    </ul>
  </div>

  <div class="feature-section mt-8 text-center">
    <p class="text-lg text-gray-600 italic mb-4">
      Thank you for being part of our journey. We're building this app for you, with love and attention to every detail. See you on January 1st! 🎉
    </p>
    <p class="text-base text-gray-500 mt-4">
      — The GENOSYS Middle East Team
    </p>
  </div>
</div>`

    // Arabic content
    const titleAr = '📱 تطبيق iOS الأصلي من GENOSYS قريباً في 1 يناير 2026!'
    const excerptAr = 'اختبر مستقبل التسوق لمنتجات العناية بالبشرة! سيتم إطلاق تطبيق iOS الأصلي الجديد تماماً في 1 يناير 2026، ويتميز بـ Apple Pay، والدفع السلس، والمزايا الحصرية للجوال فقط. قم بالتنزيل من App Store قريباً!'
    const contentAr = `<div class="blog-content" dir="rtl">
  <div class="intro-section bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6 md:p-8 mb-8">
    <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">📱 تطبيق iOS الأصلي من GENOSYS</h2>
    <p class="text-xl md:text-2xl text-primary-600 font-bold text-center mb-2">الإطلاق في 1 يناير 2026!</p>
    <p class="text-lg text-gray-700 text-center">تجربة التسوق النهائية للعناية بالبشرة على iPhone و iPad</p>
  </div>

  <div class="feature-section mb-8">
    <p class="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
      يسعدنا الإعلان عن أن <strong class="text-primary-600">GENOSYS الشرق الأوسط سيطلق تطبيق iOS أصلي</strong> حصرياً لمستخدمي iPhone و iPad! ضع علامة على تقاويمك في <strong>1 يناير 2026</strong>—اليوم الذي سيصبح فيه التسوق لمنتجات العناية بالبشرة الكورية الفاخرة متنقلاً.
    </p>
    <p class="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
      عمل فريق التطوير لدينا بلا كلل لإنشاء تطبيق ليس جميلاً فحسب، بل قوي للغاية وسريع وبديهي. هذا ليس مجرد نسخة محمولة من موقعنا الإلكتروني—إنها تجربة تسوق معاد تصميمها بالكامل مصممة خصيصاً لنظام iOS.
    </p>
  </div>

  <div class="feature-section mb-8">
    <h3 class="text-2xl font-bold text-gray-900 mb-4">✨ ما الذي يجعل تطبيق iOS الخاص بنا مميزاً</h3>
    <div class="space-y-4 text-gray-700 text-lg mb-6">
      <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <h4 class="font-bold text-primary-600 mb-2">🍎 تكامل Apple Pay</h4>
        <p>الدفع في ثوانٍ مع Apple Pay! لا حاجة لكتابة تفاصيل البطاقة—فقط قم بالمصادقة باستخدام Face ID أو Touch ID وانتهى الأمر.</p>
      </div>
      <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <h4 class="font-bold text-primary-600 mb-2">💳 خيارات دفع متعددة</h4>
        <p>ادفع بطريقتك مع Apple Pay و Stripe وروابط الدفع وجميع بطاقات الائتمان الرئيسية. آمن وسريع ومريح.</p>
      </div>
      <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <h4 class="font-bold text-primary-600 mb-2">⚡️ أداء فائق السرعة</h4>
        <p>تقنية iOS الأصلية تعني تحميل فوري ورسوم متحركة سلسة وتجربة ناعمة للغاية تشعر بها رائعة على iPhone أو iPad.</p>
      </div>
      <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <h4 class="font-bold text-primary-600 mb-2">🛍️ سلة تسوق سلسة</h4>
        <p>أضف المنتجات واضبط الكميات والدفع أسرع من أي وقت مضى. تتزامن سلة التسوق الخاصة بك عبر جميع أجهزتك تلقائياً.</p>
      </div>
      <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <h4 class="font-bold text-primary-600 mb-2">❤️ المفضلة وقائمة الرغبات</h4>
        <p>احفظ منتجاتك المفضلة بنقرة واحدة. قم ببناء قائمة رغباتك واحصل على إشعارات حول إعادة التخزين والعروض الخاصة.</p>
      </div>
      <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <h4 class="font-bold text-primary-600 mb-2">📦 تتبع الطلب في الوقت الفعلي</h4>
        <p>تتبع طلباتك في الوقت الفعلي من الشراء إلى التسليم. احصل على إشعارات دفع في كل خطوة من رحلة طلبك.</p>
      </div>
      <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <h4 class="font-bold text-primary-600 mb-2">🌍 دعم متعدد اللغات</h4>
        <p>تسوق بالإنجليزية أو العربية أو الروسية مع دعم RTL الكامل للمتحدثين بالعربية. كل شيء مترجم خصيصاً لك.</p>
      </div>
      <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <h4 class="font-bold text-primary-600 mb-2">🔐 أمان Touch ID و Face ID</h4>
        <p>حسابك محمي بالمصادقة البيومترية. تسجيل دخول سريع باستخدام Face ID أو Touch ID—لا حاجة لكلمات المرور.</p>
      </div>
      <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <h4 class="font-bold text-primary-600 mb-2">📱 معرض منتجات جميل</h4>
        <p>صور منتجات مذهلة عالية الدقة محسّنة لشاشات Retina. اضغط للتكبير وانظر إلى كل التفاصيل.</p>
      </div>
      <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <h4 class="font-bold text-primary-600 mb-2">🎁 عروض حصرية للجوال</h4>
        <p>احصل على وصول إلى صفقات التطبيق فقط وإطلاقات المنتجات المبكرة والعروض الترويجية الخاصة فقط لمستخدمي iOS.</p>
      </div>
    </div>
  </div>

  <div class="feature-section mb-8 text-center">
    <img 
      src="/images/genosys-products.jpg" 
      alt="منتجات GENOSYS المهنية الكورية" 
      class="rounded-xl shadow-lg mx-auto max-w-full h-auto mb-4"
    />
    <p class="text-sm text-gray-600 italic">تصفح مجموعتنا الكاملة على iPhone أو iPad</p>
  </div>

  <div class="feature-section mb-8 bg-gradient-to-r from-primary-50 to-purple-50 rounded-xl p-6 md:p-8">
    <h3 class="text-2xl font-bold text-gray-900 mb-4">💰 خيارات الدفع المصممة للراحة</h3>
    <p class="text-lg md:text-xl text-gray-700 leading-relaxed mb-4">
      نعلم مدى أهمية وجود خيارات دفع مرنة. لهذا السبب يدعم تطبيق iOS الخاص بنا:
    </p>
    <ul class="list-disc list-inside space-y-2 text-gray-700 text-lg mb-4">
      <li><strong>Apple Pay</strong> – أسرع وأكثر طرق الدفع أماناً على iOS</li>
      <li><strong>Stripe</strong> – معالجة الدفع الرائدة في الصناعة بأمان على مستوى البنوك</li>
      <li><strong>روابط الدفع</strong> – شارك وادفع عبر روابط آمنة</li>
      <li><strong>Visa و Mastercard و Amex</strong> – جميع بطاقات الائتمان والخصم الرئيسية مقبولة</li>
      <li><strong>البطاقات المحفوظة</strong> – احفظ طرق الدفع الخاصة بك بشكل آمن لدفع بنقرة واحدة</li>
    </ul>
    <p class="text-lg md:text-xl text-gray-700 leading-relaxed font-semibold text-primary-600">
      يتم تشفير كل معاملة وتأمينها بتقنية SSL القياسية في الصناعة. لا يتم تخزين معلومات الدفع الخاصة بك على جهازك مطلقاً.
    </p>
  </div>

  <div class="feature-section mb-8">
    <h3 class="text-2xl font-bold text-gray-900 mb-4">🚀 لماذا iOS الأصلي؟</h3>
    <p class="text-lg text-gray-700 leading-relaxed mb-4">
      قد تتساءل: "لماذا لا نستخدم الموقع الإلكتروني فقط؟" سؤال رائع! إليك لماذا تطبيقات iOS الأصلية تغير قواعد اللعبة:
    </p>
    <div class="space-y-3 text-gray-700 text-lg mb-6">
      <div class="flex items-start gap-3">
        <span class="text-2xl">⚡️</span>
        <div>
          <strong>السرعة:</strong> التطبيقات الأصلية أسرع بما يصل إلى 5 أضعاف من تطبيقات الويب. لا انتظار، لا دوّارات تحميل.
        </div>
      </div>
      <div class="flex items-start gap-3">
        <span class="text-2xl">🎨</span>
        <div>
          <strong>التصميم:</strong> تصميم iOS أصلي جميل يتبع إرشادات واجهة Apple البشرية. يبدو في منزله على iPhone الخاص بك.
        </div>
      </div>
      <div class="flex items-start gap-3">
        <span class="text-2xl">🔔</span>
        <div>
          <strong>الإشعارات:</strong> احصل على إشعارات دفع فورية لتحديثات الطلب والعروض الخاصة وإعادة التخزين—حتى عندما يكون التطبيق مغلقاً.
        </div>
      </div>
      <div class="flex items-start gap-3">
        <span class="text-2xl">📵</span>
        <div>
          <strong>وضع عدم الاتصال:</strong> تصفح مفضلاتك وتاريخ طلباتك حتى بدون إنترنت. تتزامن بياناتك تلقائياً عندما تعود إلى الاتصال بالإنترنت.
        </div>
      </div>
      <div class="flex items-start gap-3">
        <span class="text-2xl">🔐</span>
        <div>
          <strong>الأمان:</strong> تكامل Face ID و Touch ID يعني أن حسابك آمن للغاية دون تذكر كلمات المرور.
        </div>
      </div>
    </div>
  </div>

  <div class="cta-section bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-xl p-6 md:p-8 text-center">
    <p class="text-2xl md:text-3xl font-bold mb-4">🎊 استعد للإطلاق!</p>
    <p class="text-lg md:text-xl mb-4">
      لا يمكننا الانتظار حتى تختبر تطبيق GENOSYS iOS الجديد. استغرق الأمر شهوراً في الإعداد، ونحن واثقون من أنك ستحب كل بكسل.
    </p>
    <p class="text-base md:text-lg font-semibold mb-2">
      ضع علامة على تقاويمك: <strong>1 يناير 2026</strong>
    </p>
    <p class="text-base md:text-lg mb-4">
      قم بالتنزيل من Apple App Store وكن من بين الأوائل الذين يتسوقون بتطبيقنا الثوري الجديد!
    </p>
    <p class="text-base md:text-lg font-semibold">
      🚚 شحن مجاني للطلبات التي تزيد عن 1000 درهم إماراتي • ⚡️ دفع فائق السرعة • 🍎 جاهز لـ Apple Pay
    </p>
  </div>

  <div class="feature-section mt-8 text-center">
    <p class="text-lg text-gray-600 italic mb-4">
      شكراً لك لكونك جزءاً من رحلتنا. نحن نبني هذا التطبيق من أجلك، بحب واهتمام بكل التفاصيل. نراكم في 1 يناير! 🎉
    </p>
    <p class="text-base text-gray-500 mt-4">
      — فريق GENOSYS الشرق الأوسط
    </p>
  </div>
</div>`

    // Russian content
    const titleRu = '📱 Нативное iOS-приложение GENOSYS выходит 1 января 2026 года!'
    const excerptRu = 'Почувствуйте будущее покупок средств по уходу за кожей! Наше совершенно новое нативное iOS-приложение запускается 1 января 2026 года с Apple Pay, удобной оплатой и эксклюзивными преимуществами только для мобильных устройств. Скачайте из App Store скоро!'
    const contentRu = `<div class="blog-content">
  <div class="intro-section bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6 md:p-8 mb-8">
    <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">📱 Нативное iOS-приложение GENOSYS</h2>
    <p class="text-xl md:text-2xl text-primary-600 font-bold text-center mb-2">Запуск 1 января 2026 года!</p>
    <p class="text-lg text-gray-700 text-center">Лучший опыт покупок средств по уходу за кожей на iPhone и iPad</p>
  </div>

  <div class="feature-section mb-8">
    <p class="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
      Мы рады объявить, что <strong class="text-primary-600">GENOSYS Middle East запускает нативное iOS-приложение</strong> эксклюзивно для пользователей iPhone и iPad! Отметьте в календарях <strong>1 января 2026 года</strong>—день, когда покупка премиальной корейской косметики станет мобильной.
    </p>
    <p class="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
      Наша команда разработчиков неустанно работала над созданием приложения, которое не просто красиво, но невероятно мощное, быстрое и интуитивно понятное. Это не просто мобильная версия нашего сайта—это полностью переосмысленный опыт покупок, специально разработанный для iOS.
    </p>
  </div>

  <div class="feature-section mb-8">
    <h3 class="text-2xl font-bold text-gray-900 mb-4">✨ Что делает наше iOS-приложение особенным</h3>
    <div class="space-y-4 text-gray-700 text-lg mb-6">
      <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <h4 class="font-bold text-primary-600 mb-2">🍎 Интеграция с Apple Pay</h4>
        <p>Оплачивайте за секунды с помощью Apple Pay! Не нужно вводить данные карты—просто авторизуйтесь с Face ID или Touch ID, и готово.</p>
      </div>
      <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <h4 class="font-bold text-primary-600 mb-2">💳 Множество способов оплаты</h4>
        <p>Платите как вам удобно: Apple Pay, Stripe, платёжные ссылки и все основные кредитные карты. Безопасно, быстро и удобно.</p>
      </div>
      <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <h4 class="font-bold text-primary-600 mb-2">⚡️ Молниеносная производительность</h4>
        <p>Нативная технология iOS означает мгновенную загрузку, плавные анимации и невероятно гладкий опыт на вашем iPhone или iPad.</p>
      </div>
      <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <h4 class="font-bold text-primary-600 mb-2">🛍️ Удобная корзина</h4>
        <p>Добавляйте товары, изменяйте количество и оформляйте заказ быстрее, чем когда-либо. Ваша корзина автоматически синхронизируется на всех устройствах.</p>
      </div>
      <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <h4 class="font-bold text-primary-600 mb-2">❤️ Избранное и список желаний</h4>
        <p>Сохраняйте любимые товары одним касанием. Создавайте список желаний и получайте уведомления о поступлениях и специальных предложениях.</p>
      </div>
      <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <h4 class="font-bold text-primary-600 mb-2">📦 Отслеживание заказа в реальном времени</h4>
        <p>Отслеживайте свои заказы в реальном времени от покупки до доставки. Получайте push-уведомления на каждом этапе вашего заказа.</p>
      </div>
      <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <h4 class="font-bold text-primary-600 mb-2">🌍 Многоязычная поддержка</h4>
        <p>Делайте покупки на английском, арабском или русском языке с полной поддержкой RTL для арабоязычных пользователей. Всё локализовано специально для вас.</p>
      </div>
      <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <h4 class="font-bold text-primary-600 mb-2">🔐 Безопасность Touch ID и Face ID</h4>
        <p>Ваш аккаунт защищён биометрической аутентификацией. Быстрый вход с Face ID или Touch ID—пароли не нужны.</p>
      </div>
      <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <h4 class="font-bold text-primary-600 mb-2">📱 Красивая галерея товаров</h4>
        <p>Потрясающие изображения товаров в высоком разрешении, оптимизированные для Retina-дисплеев. Увеличивайте и смотрите каждую деталь.</p>
      </div>
      <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <h4 class="font-bold text-primary-600 mb-2">🎁 Эксклюзивные мобильные предложения</h4>
        <p>Получайте доступ к эксклюзивным предложениям только в приложении, ранним запускам продуктов и специальным акциям только для пользователей iOS.</p>
      </div>
    </div>
  </div>

  <div class="feature-section mb-8 text-center">
    <img 
      src="/images/genosys-products.jpg" 
      alt="Профессиональная корейская дермакосметика GENOSYS" 
      class="rounded-xl shadow-lg mx-auto max-w-full h-auto mb-4"
    />
    <p class="text-sm text-gray-600 italic">Просматривайте всю нашу коллекцию на вашем iPhone или iPad</p>
  </div>

  <div class="feature-section mb-8 bg-gradient-to-r from-primary-50 to-purple-50 rounded-xl p-6 md:p-8">
    <h3 class="text-2xl font-bold text-gray-900 mb-4">💰 Способы оплаты для вашего удобства</h3>
    <p class="text-lg md:text-xl text-gray-700 leading-relaxed mb-4">
      Мы знаем, насколько важно иметь гибкие способы оплаты. Поэтому наше iOS-приложение поддерживает:
    </p>
    <ul class="list-disc list-inside space-y-2 text-gray-700 text-lg mb-4">
      <li><strong>Apple Pay</strong> – самый быстрый и безопасный способ оплаты на iOS</li>
      <li><strong>Stripe</strong> – ведущая в отрасли обработка платежей с банковской безопасностью</li>
      <li><strong>Платёжные ссылки</strong> – делитесь и платите через безопасные ссылки</li>
      <li><strong>Visa, Mastercard, Amex</strong> – принимаются все основные кредитные и дебетовые карты</li>
      <li><strong>Сохранённые карты</strong> – надёжно сохраняйте способы оплаты для оплаты в одно касание</li>
    </ul>
    <p class="text-lg md:text-xl text-gray-700 leading-relaxed font-semibold text-primary-600">
      Каждая транзакция зашифрована и защищена отраслевым стандартом SSL. Ваша платёжная информация никогда не хранится на вашем устройстве.
    </p>
  </div>

  <div class="feature-section mb-8">
    <h3 class="text-2xl font-bold text-gray-900 mb-4">🚀 Почему нативный iOS?</h3>
    <p class="text-lg text-gray-700 leading-relaxed mb-4">
      Вы можете спросить: "Почему бы просто не использовать веб-сайт?" Отличный вопрос! Вот почему нативные iOS-приложения меняют правила игры:
    </p>
    <div class="space-y-3 text-gray-700 text-lg mb-6">
      <div class="flex items-start gap-3">
        <span class="text-2xl">⚡️</span>
        <div>
          <strong>Скорость:</strong> Нативные приложения до 5 раз быстрее веб-приложений. Никакого ожидания, никаких загрузочных индикаторов.
        </div>
      </div>
      <div class="flex items-start gap-3">
        <span class="text-2xl">🎨</span>
        <div>
          <strong>Дизайн:</strong> Красивый нативный iOS-дизайн, следующий рекомендациям Apple по интерфейсу. Он как дома на вашем iPhone.
        </div>
      </div>
      <div class="flex items-start gap-3">
        <span class="text-2xl">🔔</span>
        <div>
          <strong>Уведомления:</strong> Получайте мгновенные push-уведомления об обновлениях заказов, специальных предложениях и поступлениях—даже когда приложение закрыто.
        </div>
      </div>
      <div class="flex items-start gap-3">
        <span class="text-2xl">📵</span>
        <div>
          <strong>Офлайн-режим:</strong> Просматривайте избранное и историю заказов даже без интернета. Данные автоматически синхронизируются, когда вы снова в сети.
        </div>
      </div>
      <div class="flex items-start gap-3">
        <span class="text-2xl">🔐</span>
        <div>
          <strong>Безопасность:</strong> Интеграция Face ID и Touch ID означает, что ваш аккаунт сверхбезопасен без необходимости запоминать пароли.
        </div>
      </div>
    </div>
  </div>

  <div class="cta-section bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-xl p-6 md:p-8 text-center">
    <p class="text-2xl md:text-3xl font-bold mb-4">🎊 Готовьтесь к запуску!</p>
    <p class="text-lg md:text-xl mb-4">
      Мы не можем дождаться, чтобы вы испытали новое iOS-приложение GENOSYS. Оно создавалось месяцами, и мы уверены, что вам понравится каждый пиксель.
    </p>
    <p class="text-base md:text-lg font-semibold mb-2">
      Отметьте в календарях: <strong>1 января 2026 года</strong>
    </p>
    <p class="text-base md:text-lg mb-4">
      Скачайте из Apple App Store и будьте среди первых, кто делает покупки с нашим революционным новым приложением!
    </p>
    <p class="text-base md:text-lg font-semibold">
      🚚 Бесплатная доставка при заказе от 1000 дирхамов • ⚡️ Молниеносная оплата • 🍎 Готово для Apple Pay
    </p>
  </div>

  <div class="feature-section mt-8 text-center">
    <p class="text-lg text-gray-600 italic mb-4">
      Спасибо, что вы с нами на этом пути. Мы создаём это приложение для вас, с любовью и вниманием к каждой детали. Увидимся 1 января! 🎉
    </p>
    <p class="text-base text-gray-500 mt-4">
      — Команда GENOSYS Middle East
    </p>
  </div>
</div>`

    const featuredImage = '/images/ios.png'
    const authorName = 'GENOSYS Team'
    const publishedAt = new Date('2024-12-14T18:30:00Z') // Today's date
    const tags = JSON.stringify(['iOS App', 'Mobile Shopping', 'Apple Pay', 'Technology', 'News', 'Announcement'])

    const blogPost = await prisma.blogPost.create({
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

    debugLog('✅ Blog post created successfully!')
    debugLog('📝 Post ID:', blogPost.id)
    debugLog('🔗 Slug:', blogPost.slug)
    debugLog('📅 Published at:', blogPost.publishedAt)
    console.log('\n🎉 Blog post created successfully!')
    console.log(`🌐 View at: https://genosys.ae/blog/${slug}`)
    console.log(`🌐 View (AR): https://genosys.ae/ar/blog/${slug}`)
    console.log(`🌐 View (RU): https://genosys.ae/ru/blog/${slug}`)

  } catch (error) {
    errorLog('❌ Error creating blog post:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

createIOSAppAnnouncementBlogPost()


