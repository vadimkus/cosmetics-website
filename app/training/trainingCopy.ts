/**
 * Every label on /training, in the three languages the site ships.
 *
 * The library itself (documents, product sheets, video lessons) is in
 * trainingLibrary.ts and is the same in all three. Only the words around it
 * change, which is what this file holds.
 */

export interface TrainingCopy {
  breadcrumb: string
  backHome: string
  eyebrow: string
  title: string
  lead: string

  countGuides: string
  countSheets: string
  countVideos: string

  guidesEyebrow: string
  guidesTitle: string
  guidesLead: string

  sheetsEyebrow: string
  sheetsTitle: string
  sheetsLead: string

  videosEyebrow: string
  videosTitle: string
  videosLead: string

  /** Button on each row. The PWA opens the file rather than downloading it. */
  download: string
  view: string

  minutes: string
  levelProfessional: string
  levelAdvanced: string

  closing: string
}

export const TRAINING_COPY: Record<'en' | 'ar' | 'ru', TrainingCopy> = {
  en: {
    breadcrumb: 'Training',
    backHome: 'Back to home',
    eyebrow: 'For GENOSYS partners',
    title: 'The training library',
    lead: 'Treatment protocols, product sheets and filmed lessons, in one place. Everything here is the material we train clinics on, free to download and use in your own practice.',

    countGuides: 'Protocols and guides',
    countSheets: 'Product sheets',
    countVideos: 'Filmed lessons',

    guidesEyebrow: 'Start here',
    guidesTitle: 'Protocols and guides',
    guidesLead: 'The catalogue, the professional manual and the treatment protocols. Read these first.',

    sheetsEyebrow: 'One per product',
    sheetsTitle: 'Product sheets',
    sheetsLead: 'The manufacturer deck for each product, with the actives, the protocol and the claims. Tap a thumbnail to open the product page.',

    videosEyebrow: 'Watch',
    videosTitle: 'Filmed lessons',
    videosLead: 'Full treatments filmed end to end, so you can see the hand movements rather than read about them.',

    download: 'PDF',
    view: 'Open',

    minutes: 'min',
    levelProfessional: 'Professional',
    levelAdvanced: 'Advanced professional',

    closing: 'New protocols and lessons are added as they are released. If there is something you need that is not here, ask us and we will send it.',
  },

  ar: {
    breadcrumb: 'التدريب',
    backHome: 'العودة إلى الرئيسية',
    eyebrow: 'لشركاء GENOSYS',
    title: 'مكتبة التدريب',
    lead: 'بروتوكولات العلاج وملفات المنتجات والدروس المصوّرة، في مكان واحد. كل ما هنا هو المادة التي ندرّب بها العيادات، متاحة للتحميل والاستخدام في عملك.',

    countGuides: 'بروتوكولات وأدلة',
    countSheets: 'ملفات المنتجات',
    countVideos: 'دروس مصوّرة',

    guidesEyebrow: 'ابدأ من هنا',
    guidesTitle: 'بروتوكولات وأدلة',
    guidesLead: 'الكتالوج والدليل المهني وبروتوكولات العلاج. اقرأ هذه أولاً.',

    sheetsEyebrow: 'ملف لكل منتج',
    sheetsTitle: 'ملفات المنتجات',
    sheetsLead: 'عرض الشركة المصنّعة لكل منتج، بمكوّناته الفعّالة وبروتوكوله. اضغط على الصورة لفتح صفحة المنتج.',

    videosEyebrow: 'شاهد',
    videosTitle: 'دروس مصوّرة',
    videosLead: 'علاجات كاملة مصوّرة من البداية إلى النهاية، لترى حركة اليد بدل أن تقرأ عنها.',

    download: 'PDF',
    view: 'فتح',

    minutes: 'دقيقة',
    levelProfessional: 'مهني',
    levelAdvanced: 'مهني متقدّم',

    closing: 'نضيف البروتوكولات والدروس الجديدة فور صدورها. إن احتجت شيئاً غير موجود هنا، اطلبه منّا ونرسله لك.',
  },

  ru: {
    breadcrumb: 'Обучение',
    backHome: 'На главную',
    eyebrow: 'Для партнёров GENOSYS',
    title: 'Библиотека обучения',
    lead: 'Протоколы процедур, карточки продуктов и снятые уроки в одном месте. Здесь всё, чему мы обучаем клиники, доступно для скачивания и работы.',

    countGuides: 'Протоколы и руководства',
    countSheets: 'Карточки продуктов',
    countVideos: 'Снятые уроки',

    guidesEyebrow: 'Начните отсюда',
    guidesTitle: 'Протоколы и руководства',
    guidesLead: 'Каталог, профессиональное руководство и протоколы процедур. Прочитайте их первыми.',

    sheetsEyebrow: 'По одной на продукт',
    sheetsTitle: 'Карточки продуктов',
    sheetsLead: 'Презентация производителя для каждого продукта: активы, протокол, заявления. Нажмите на миниатюру, чтобы открыть страницу продукта.',

    videosEyebrow: 'Смотреть',
    videosTitle: 'Снятые уроки',
    videosLead: 'Процедуры сняты целиком, от начала до конца, чтобы движения рук можно было увидеть, а не прочитать о них.',

    download: 'PDF',
    view: 'Открыть',

    minutes: 'мин',
    levelProfessional: 'Профессиональный',
    levelAdvanced: 'Продвинутый профессиональный',

    closing: 'Новые протоколы и уроки добавляются по мере выхода. Если нужного материала здесь нет, напишите нам, и мы пришлём его.',
  },
}
