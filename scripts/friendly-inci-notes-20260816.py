"""Rewrite every product page's INCI note in a friendlier voice.

The old lines read like a filing clerk ("The complete ingredient list, exactly
as it appears on the carton."). The note exists to reassure the reader that
what is on screen matches the pack in their hand, so it should sound like a
person saying so.

House voice takes no contractions, so the base line is "Every ingredient, ..."
rather than "Everything that's in it, ...".

Substance is preserved everywhere: pH figures, ppm/ppb figures, and the honest
disclosures about a carton panel differing from the registered formula all
stay. What goes is the dossier phrasing and the self-undercutting hedge
"This list is not claimed to match every language panel", replaced by a plain
statement of which list this page follows.
"""

import sys

EN_BASE = 'Every ingredient, in the same order as the box in your hand.'
AR_BASE = 'كل مكوّن، بالترتيب نفسه الذي على العلبة بين يديك.'
RU_BASE = 'Каждый ингредиент, в том же порядке, что и на коробке у вас в руках.'

EN_ORDER = 'Every ingredient, strongest first.'
AR_ORDER = 'كل مكوّن، من الأعلى نسبةً إلى الأقل.'
RU_ORDER = 'Каждый ингредиент, от большего к меньшему.'

EN_BASE_OPEN = EN_BASE[:-1]  # drop the full stop to append a clause
AR_BASE_OPEN = AR_BASE[:-1]
RU_BASE_OPEN = RU_BASE[:-1]

EN_ORDER_OPEN = EN_ORDER[:-1]
AR_ORDER_OPEN = AR_ORDER[:-1]
RU_ORDER_OPEN = RU_ORDER[:-1]


def ph(en_last, en_spec, ru_last, ru_spec):
    """The five Power Solution ampoules differ only in their pH figures."""
    return [
        (f'As printed on the carton. pH is tested on every batch, and the last came back at {en_last} against a{"n" if en_spec.startswith("8") else ""} {en_spec} ± 1.00 specification.',
         f'{EN_BASE_OPEN}. Every batch is tested for pH, and the last came back at {en_last} inside a{"n" if en_spec.startswith("8") else ""} {en_spec} ± 1.00 specification.'),
        (None, None),  # AR and RU handled per file below
        (None, None),
    ]


# Each entry: file -> list of (old, new) pairs, EN then AR then RU.
EDITS = {
    'components/product/afs/afsCopy.ts': [
        ('As printed on the pack.', EN_BASE),
        ('كما طُبعت على العبوة.', AR_BASE),
        ('Так, как напечатано на упаковке.', RU_BASE),
    ],
    'components/product/collagenmask/collagenMaskCopy.ts': [
        ('As printed on the pack.', EN_BASE),
        ('كما هي مطبوعة على العبوة.', AR_BASE),
        ('Так, как напечатано на упаковке.', RU_BASE),
    ],
    'components/product/bioferment/bioFermentCopy.ts': [
        ('The registered formula.', 'Every ingredient, straight from the registered formula.'),
        ('التركيبة المسجّلة.', 'كل مكوّن، كما هو في التركيبة المسجّلة.'),
        ('Зарегистрированная формула.', 'Каждый ингредиент, прямо из зарегистрированной формулы.'),
    ],
    'components/product/epi/epiCopy.ts': [
        ('The registered formula.', 'Every ingredient, straight from the registered formula.'),
        ('التركيبة المسجّلة.', 'كل مكوّن، كما هو في التركيبة المسجّلة.'),
        ('Зарегистрированная формула.', 'Каждый ингредиент, прямо из зарегистрированной формулы.'),
    ],
    'components/product/ezco2/ezco2Copy.ts': [
        ('The registered gel formula, then the registered mask formula.',
         'Every ingredient in the gel first, then every ingredient in the mask.'),
        ('تركيبة الجل المسجّلة، ثم تركيبة القناع المسجّلة.',
         'كل مكوّن في الجل أولاً، ثم كل مكوّن في القناع.'),
        ('Зарегистрированная формула геля, затем зарегистрированная формула маски.',
         'Сначала каждый ингредиент геля, затем каждый ингредиент маски.'),
    ],
    'components/product/biomeso/biomesoCopy.ts': [
        ('The complete ingredient list as printed on the carton.', EN_BASE),
        ('قائمة المكوّنات الكاملة كما هي مطبوعة على العبوة.', AR_BASE),
        ('Полный список ингредиентов, как он напечатан на упаковке.', RU_BASE),
    ],
    'components/product/biomeso/biomesoExpertCopy.ts': [
        ('The complete ingredient list, exactly as it appears on the carton.', EN_BASE),
        ('قائمة المكونات الكاملة كما تظهر تماماً على العبوة.', AR_BASE),
        ('Полный список ингредиентов ровно в том виде, в каком он приведён на упаковке.', RU_BASE),
    ],
    'components/product/cerabarrier/cerabarrierCopy.ts': [
        ('The complete ingredient list, exactly as it appears on the carton.', EN_BASE),
        ('قائمة المكونات الكاملة كما هي على العبوة.', AR_BASE),
        ('Полный состав в точности как на упаковке.', RU_BASE),
    ],
    'components/product/mvcream/mvcreamCopy.ts': [
        ('The complete list, as printed on the carton.', EN_BASE),
        ('القائمة الكاملة كما هي مطبوعة على العلبة.', AR_BASE),
        ('Полный список, как он напечатан на упаковке.', RU_BASE),
    ],
    'components/product/pccream/pccreamCopy.ts': [
        ('The complete list, as printed on the carton.', EN_BASE),
        ('القائمة الكاملة كما هي مطبوعة على العلبة.', AR_BASE),
        ('Полный список, как он напечатан на коробке.', RU_BASE),
    ],
    'components/product/pcserum/pcserumCopy.ts': [
        ('The complete list, as printed on the carton.', EN_BASE),
        ('القائمة الكاملة كما هي مطبوعة على العلبة.', AR_BASE),
        ('Полный список, как он напечатан на коробке.', RU_BASE),
    ],
    'components/product/spcream/spcreamCopy.ts': [
        ('The complete list, as printed on the carton.', EN_BASE),
        ('القائمة الكاملة كما هي مطبوعة على العلبة.', AR_BASE),
        ('Полный список, как он напечатан на упаковке.', RU_BASE),
    ],
    'components/product/mhcream/mhcreamCopy.ts': [
        ('The complete list, as printed on the carton, ppm and ppb figures included.',
         f'{EN_BASE_OPEN}, ppm and ppb figures included.'),
        ('القائمة الكاملة كما هي مطبوعة على العلبة، بأرقام الأجزاء بالمليون والمليار.',
         f'{AR_BASE_OPEN}، مع أرقام الأجزاء بالمليون والمليار.'),
        ('Полный список, как он напечатан на упаковке, включая значения в ppm и ppb.',
         f'{RU_BASE_OPEN}, включая значения в ppm и ppb.'),
    ],
    'components/product/mvserum/mvserumCopy.ts': [
        ('The complete list, as printed on the carton, with the ppm and ppb figures.',
         f'{EN_BASE_OPEN}, ppm and ppb figures included.'),
        ('القائمة الكاملة كما هي مطبوعة على العلبة، بأرقام الأجزاء بالمليون والمليار.',
         f'{AR_BASE_OPEN}، مع أرقام الأجزاء بالمليون والمليار.'),
        ('Полный список, как он напечатан на упаковке, со значениями в ppm и ppb.',
         f'{RU_BASE_OPEN}, включая значения в ppm и ppb.'),
    ],
    'components/product/hsserum/hsserumCopy.ts': [
        ('As printed on the carton, in the same order as the registered formula.',
         f'{EN_BASE_OPEN}, which is the order of the registered formula.'),
        ('كما طُبع على العلبة، بنفس ترتيب التركيبة المسجّلة.',
         f'{AR_BASE_OPEN}، وهو ترتيب التركيبة المسجّلة.'),
        ('Как на коробке, в том же порядке, что и зарегистрированная формула.',
         f'{RU_BASE_OPEN}, а это порядок зарегистрированной формулы.'),
    ],
    'components/product/hydrocool/hydroCoolCopy.ts': [
        ('As printed on the English carton.',
         'Every ingredient, in the same order as the English box in your hand.'),
        ('كما طُبعت على الكرتون الإنجليزي.',
         'كل مكوّن، بالترتيب نفسه الذي على العلبة الإنجليزية بين يديك.'),
        ('Как напечатано на английском картоне.',
         'Каждый ингредиент, в том же порядке, что и на английской коробке у вас в руках.'),
    ],
    'components/product/srs/srsCopy.ts': [
        ('The registered formula in descending concentration, matching the carton list.',
         f'{EN_ORDER_OPEN}, matching the box in your hand.'),
        ('التركيبة المسجّلة بترتيب التركيز التنازلي، مطابقة لقائمة العلبة.',
         f'{AR_ORDER_OPEN}، مطابقاً للعلبة بين يديك.'),
        ('Зарегистрированная формула по убыванию концентрации, как на коробке.',
         f'{RU_ORDER_OPEN}, как на коробке у вас в руках.'),
    ],
    'components/product/revitaglow/revitaGlowCopy.ts': [
        ('The complete ingredient list as printed on the carton. Identical for #01 Bright and #02 Natural apart from the pigments.',
         f'{EN_BASE_OPEN}. Identical for #01 Bright and #02 Natural apart from the pigments.'),
        ('قائمة المكوّنات الكاملة كما هي مطبوعة على العبوة. متطابقة للدرجتين ٠١ Bright و٠٢ Natural باستثناء الصبغات.',
         f'{AR_BASE_OPEN}. متطابقة للدرجتين ٠١ Bright و٠٢ Natural باستثناء الصبغات.'),
        ('Полный список ингредиентов, как он напечатан на упаковке. Идентичен для #01 Bright и #02 Natural, кроме пигментов.',
         f'{RU_BASE_OPEN}. Идентичен для #01 Bright и #02 Natural, кроме пигментов.'),
    ],
    'components/product/mist/mistCopy.ts': [
        ('The registered list, as printed on the carton. The carton also prints 879.5 ppm on the ferment, 800 ppm on inulin and 200 ppm on the oligosaccharide. Those are the same three figures as 0.08795%, 0.08% and 0.02%.',
         f'{EN_BASE_OPEN}. The box also prints 879.5 ppm on the ferment, 800 ppm on inulin and 200 ppm on the oligosaccharide. Those are the same three figures as 0.08795%, 0.08% and 0.02%.'),
        ('القائمة المسجّلة، كما على العلبة. العلبة تطبع أيضاً 879.5 جزء في المليون على التخمير، و800 على الإينولين، و200 على السكر قليل التعدد. تلك الأرقام نفسها 0.08795% و0.08% و0.02%.',
         f'{AR_BASE_OPEN}. وتطبع العلبة أيضاً 879.5 جزء في المليون على التخمير، و800 على الإينولين، و200 على السكر قليل التعدد. وهي الأرقام نفسها: 0.08795% و0.08% و0.02%.'),
        ('Зарегистрированный список, как на коробке. Коробка также печатает 879,5 ppm на ферменте, 800 ppm на инулине и 200 ppm на олигосахариде. Это те же три цифры, что 0,08795%, 0,08% и 0,02%.',
         f'{RU_BASE_OPEN}. Коробка также печатает 879,5 ppm на ферменте, 800 ppm на инулине и 200 ppm на олигосахариде. Это те же три цифры, что 0,08795%, 0,08% и 0,02%.'),
    ],
    'components/product/pdrnmask/pdrnMaskCopy.ts': [
        ('As printed on the carton. Every batch is tested for pH; the latest came back at 6.37, near neutral, so it does not sting skin that has just been through something.',
         f'{EN_BASE_OPEN}. Every batch is tested for pH, and the latest came back at 6.37, near neutral, so it does not sting skin that has just been through something.'),
        ('كما هي مطبوعة على العبوة. تُختبر درجة الحموضة في كل دفعة، وسجّلت الأخيرة 6.37، أي قريبة من المحايدة، فلا تلسع بشرة مرّت للتو بشيء ما.',
         f'{AR_BASE_OPEN}. تُختبر درجة الحموضة في كل دفعة، وسجّلت الأخيرة 6.37، أي قريبة من المحايدة، فلا تلسع بشرة مرّت للتو بشيء ما.'),
        ('Как напечатано на упаковке. pH проверяют в каждой партии, последняя показала 6,37, почти нейтральный, поэтому маска не щиплет кожу, которая только что через что-то прошла.',
         f'{RU_BASE_OPEN}. pH проверяют в каждой партии, последняя показала 6,37, почти нейтральный, поэтому маска не щиплет кожу, которая только что через что-то прошла.'),
    ],
    'components/product/overnight/overnightCopy.ts': [
        ('As printed on the English carton. Oxygen and the growth-factor names sit after Ceramide NP. The formula sheet prints those at 0%. We do not claim this list matches every language panel.',
         'Every ingredient, in the same order as the English box in your hand. Oxygen and the growth-factor names sit after Ceramide NP, and the formula sheet prints every one of them at 0%.'),
        ('كما طُبعت على الكرتون الإنجليزي. الأكسجين وأسماء عوامل النمو تجلس بعد سيراميد NP. ورقة التركيبة تطبعها عند ٠٪. لا ندّعي أن هذه القائمة تطابق كل لوحة لغة.',
         'كل مكوّن، بالترتيب نفسه الذي على العلبة الإنجليزية بين يديك. الأكسجين وأسماء عوامل النمو تأتي بعد سيراميد NP، وورقة التركيبة تطبعها جميعاً عند ٠٪.'),
        ('Как напечатано на английском картоне. Кислород и имена факторов роста стоят после церамида NP. Лист формулы печатает их как 0%. Мы не утверждаем, что список совпадает с каждой языковой панелью.',
         'Каждый ингредиент, в том же порядке, что и на английской коробке у вас в руках. Кислород и названия факторов роста стоят после церамида NP, и лист формулы печатает каждый из них как 0%.'),
    ],
    'components/product/eyecream/eyecreamCopy.ts': [
        ('Registered Formula_up list in descending order. The carton lifts some peptide names earlier. This list is not claimed to match every language panel.',
         f'{EN_ORDER_OPEN}. Your box may print one or two of the peptide names higher up, and this page follows the registered formula.'),
        ('قائمة Formula_up المسجّلة بترتيب تنازلي. الكرتون يرفع بعض أسماء الببتيدات أعلى. لا ندّعي أن هذه القائمة تطابق كل لوحة لغة.',
         f'{AR_ORDER_OPEN}. قد تطبع علبتك اسماً أو اسمين من الببتيدات في موضع أعلى، وهذه الصفحة تتبع التركيبة المسجّلة.'),
        ('Зарегистрированный список Formula_up в убывающем порядке. Картон поднимает часть пептидных имён выше. Мы не утверждаем, что список совпадает с каждой языковой панелью.',
         f'{RU_ORDER_OPEN}. На вашей коробке одно-два названия пептидов могут стоять выше, а эта страница следует зарегистрированной формуле.'),
    ],
    'components/product/eyeserum/eyeserumCopy.ts': [
        ('Registered Formula_up list in descending order. The carton lifts some peptide names earlier. This list is not claimed to match every language panel.',
         f'{EN_ORDER_OPEN}. Your box may print one or two of the peptide names higher up, and this page follows the registered formula.'),
        ('قائمة Formula_up المسجّلة بترتيب تنازلي. الكرتون يرفع بعض أسماء الببتيدات أعلى. لا ندّعي أن هذه القائمة تطابق كل لوحة لغة.',
         f'{AR_ORDER_OPEN}. قد تطبع علبتك اسماً أو اسمين من الببتيدات في موضع أعلى، وهذه الصفحة تتبع التركيبة المسجّلة.'),
        ('Зарегистрированный список Formula_up в убывающем порядке. Картон поднимает часть пептидных имён выше. Мы не утверждаем, что список совпадает с каждой языковой панелью.',
         f'{RU_ORDER_OPEN}. На вашей коробке одно-два названия пептидов могут стоять выше, а эта страница следует зарегистрированной формуле.'),
    ],
    'components/product/eyepatch/eyepatchCopy.ts': [
        ('Registered Formula_up list in descending order. The carton lifts Acetyl Hexapeptide-8 after Chondrus and prints 46.5ppb. This list is not claimed to match every language panel.',
         f'{EN_ORDER_OPEN}. Your box prints Acetyl Hexapeptide-8 just after Chondrus, at 46.5 ppb, and this page follows the registered formula.'),
        ('قائمة Formula_up المسجّلة بترتيب تنازلي. الكرتون يرفع Acetyl Hexapeptide-8 بعد Chondrus ويطبع 46.5ppb. لا ندّعي أن هذه القائمة تطابق كل لوحة لغة.',
         f'{AR_ORDER_OPEN}. علبتك تطبع Acetyl Hexapeptide-8 بعد Chondrus مباشرة عند 46.5 جزء في المليار، وهذه الصفحة تتبع التركيبة المسجّلة.'),
        ('Зарегистрированный список Formula_up в убывающем порядке. Картон поднимает Acetyl Hexapeptide-8 после Chondrus и печатает 46.5ppb. Мы не утверждаем, что список совпадает с каждой языковой панелью.',
         f'{RU_ORDER_OPEN}. На вашей коробке Acetyl Hexapeptide-8 стоит сразу после Chondrus, при 46,5 ppb, а эта страница следует зарегистрированной формуле.'),
    ],
    'components/product/peptidegel/peptideGelCopy.ts': [
        ('Registered Formula_up list in descending order. The carton lifts Acetyl Hexapeptide-8 after Chondrus and prints 0.05ppm. This list is not claimed to match every language panel.',
         f'{EN_ORDER_OPEN}. Your box prints Acetyl Hexapeptide-8 just after Chondrus, at 0.05 ppm, and this page follows the registered formula.'),
        ('قائمة Formula_up المسجّلة تنازلياً. الكرتون يرفع أسيتيل هكسا ببتيد-٨ بعد الشوندروس ويطبع 0.05ppm. لا ندّعي تطابق كل لغة على العلبة.',
         f'{AR_ORDER_OPEN}. علبتك تطبع أسيتيل هكسا ببتيد-٨ بعد الشوندروس مباشرة عند 0.05 جزء في المليون، وهذه الصفحة تتبع التركيبة المسجّلة.'),
        ('Зарегистрированный список Formula_up по убыванию. Картон поднимает ацетилгексапептид-8 после хондруса и печатает 0.05ppm. Список не претендует совпадать с каждой языковой панелью.',
         f'{RU_ORDER_OPEN}. На вашей коробке ацетилгексапептид-8 стоит сразу после хондруса, при 0,05 ppm, а эта страница следует зарегистрированной формуле.'),
    ],
    'components/product/booster/boosterCopy.ts': [
        ('The registered descending list. Some bottles print grapefruit as Citrus Paradisi fruit. The formula is Citrus Grandis seed. The list on this page is the formula.',
         f'{EN_ORDER_OPEN}. Some bottles print the grapefruit as Citrus Paradisi fruit, where the formula is Citrus Grandis seed, and the formula is what this page follows.'),
        ('القائمة المسجّلة تنازلياً. بعض الزجاجات تطبع الجريب فروت كـ Citrus Paradisi. التركيبة Citrus Grandis seed. القائمة في هذه الصفحة هي التركيبة.',
         f'{AR_ORDER_OPEN}. بعض الزجاجات تطبع الجريب فروت باسم Citrus Paradisi، بينما التركيبة هي Citrus Grandis seed، وهي ما تتبعه هذه الصفحة.'),
        ('Зарегистрированный список по убыванию. Некоторые флаконы печатают грейпфрут как Citrus Paradisi fruit. Формула - Citrus Grandis seed. Список на этой странице - формула.',
         f'{RU_ORDER_OPEN}. На некоторых флаконах грейпфрут напечатан как Citrus Paradisi fruit, тогда как в формуле стоит Citrus Grandis seed, и эта страница следует формуле.'),
    ],
    'components/product/pcttoner/pctTonerCopy.ts': [
        ('The registered descending list. The carton prints a shorter panel. The list on this page is the formula.',
         f'{EN_ORDER_OPEN}. Your box prints a shorter panel, so this page gives you the full formula.'),
        ('القائمة المسجّلة تنازلياً. العلبة تطبع لوحة أقصر. القائمة في هذه الصفحة هي التركيبة.',
         f'{AR_ORDER_OPEN}. علبتك تطبع لوحة أقصر، وهذه الصفحة تعطيك التركيبة كاملة.'),
        ('Зарегистрированный список по убыванию. Коробка печатает более короткую панель. Список на этой странице - формула.',
         f'{RU_ORDER_OPEN}. На вашей коробке панель короче, поэтому здесь формула целиком.'),
    ],
    'components/product/snowo2/snowo2Copy.ts': [
        ('The registered descending list. The carton prints a shorter order and names grapefruit and triethanolamine that the finished formula does not carry at those places. The list on this page is the formula.',
         f'{EN_ORDER_OPEN}. Your box prints a shorter order and names grapefruit and triethanolamine in places the finished formula does not carry them, so this page follows the formula.'),
        ('القائمة المسجّلة تنازلياً. العلبة تطبع ترتيباً أقصر وتسمّي الجريب فروت وتريإيثانولامين في مواضع لا تحملها التركيبة النهائية. القائمة في هذه الصفحة هي التركيبة.',
         f'{AR_ORDER_OPEN}. علبتك تطبع ترتيباً أقصر وتذكر الجريب فروت وتريإيثانولامين في مواضع لا تحملها التركيبة النهائية، وهذه الصفحة تتبع التركيبة.'),
        ('Зарегистрированный список по убыванию. На коробке более короткий порядок и названы грейпфрут и триэтаноламин там, где готовая формула их не несёт. Список на этой странице - формула.',
         f'{RU_ORDER_OPEN}. На вашей коробке порядок короче, а грейпфрут и триэтаноламин названы там, где готовая формула их не несёт, поэтому эта страница следует формуле.'),
    ],
    'components/product/remover/removerCopy.ts': [
        ('The registered formula in descending concentration. The carton lifts some botanicals above their finished percentages.',
         f'{EN_ORDER_OPEN}. Your box lifts some of the botanicals above the percentage they actually finish at, and this page follows the formula.'),
        ('التركيبة المسجّلة بترتيب التركيز التنازلي. العلبة ترفع بعض النباتات فوق نسبها النهائية.',
         f'{AR_ORDER_OPEN}. علبتك ترفع بعض النباتات فوق نسبتها النهائية، وهذه الصفحة تتبع التركيبة.'),
        ('Зарегистрированная формула по убыванию концентрации. Коробка поднимает часть растений выше их готовых процентов.',
         f'{RU_ORDER_OPEN}. На вашей коробке часть растений стоит выше своей реальной доли, а эта страница следует формуле.'),
    ],
    'components/product/powersolution/hesCopy.ts': [
        ('Exactly as printed on the carton, in the order the carton prints it. Ingredient lists stay in Latin script in every language because that is the regulatory form.',
         f'{EN_BASE_OPEN}. Ingredient lists stay in Latin script in every language, because that is the form regulators require.'),
        ('كما هي مطبوعة على العلبة تماماً، وبالترتيب نفسه. وتبقى قوائم المكوّنات بالحرف اللاتيني في كل اللغات لأن هذا هو شكلها النظامي.',
         f'{AR_BASE_OPEN}. وتبقى قوائم المكوّنات بالحرف اللاتيني في كل اللغات لأن هذا هو الشكل الذي تطلبه الجهات التنظيمية.'),
        ('Точно как напечатано на упаковке и в том же порядке. Списки состава остаются в латинице на всех языках, потому что это их регуляторная форма.',
         f'{RU_BASE_OPEN}. Списки состава остаются в латинице на всех языках, потому что этого требуют регуляторы.'),
    ],
}

# The five Power Solution ampoules share one sentence shape and differ only in
# their pH figures, so they are generated rather than transcribed.
PH_FILES = {
    'components/product/powersolution/powerSolutionCopy.ts': ('5.94', '6.00', 'a', '5,94', '6,00', 'تشغيلة', 'последняя показала', ';'),
    'components/product/powersolution/awsCopy.ts': ('4.93', '4.80', 'a', '4,93', '4,80', 'دفعة', 'последняя пришла', ','),
    'components/product/powersolution/ctsCopy.ts': ('7.61', '7.00', 'a', '7,61', '7,00', 'دفعة', 'последняя дала', ','),
    'components/product/powersolution/pcsCopy.ts': ('7.98', '7.70', 'a', '7,98', '7,70', 'دفعة', 'последняя дала', ','),
    'components/product/powersolution/swsCopy.ts': ('7.72', '8.00', 'an', '7,72', '8,00', 'دفعة', 'последняя дала', ','),
}

AR_PH_OLD = {
    'components/product/powersolution/powerSolutionCopy.ts': 'كما هي مطبوعة على العلبة. تُختبر الحموضة في كل تشغيلة، وسجّلت الأخيرة 5.94 مقابل مواصفة 6.00 ± 1.00.',
    'components/product/powersolution/awsCopy.ts': 'كما طُبعت على العلبة. تُختبر الحموضة في كل دفعة، وجاءت الأخيرة 4.93 مقابل مواصفة 4.80 ± 1.00.',
    'components/product/powersolution/ctsCopy.ts': 'كما طُبعت على العلبة. تُختبر الحموضة في كل دفعة، وجاءت الأخيرة 7.61 مقابل مواصفة 7.00 ± 1.00.',
    'components/product/powersolution/pcsCopy.ts': 'كما طُبعت على العلبة. يُختبر الأس الهيدروجيني في كل دفعة، وآخر نتيجة جاءت 7.98 مقابل مواصفة 7.70 ± 1.00.',
    'components/product/powersolution/swsCopy.ts': 'كما طُبعت على العلبة. تُختبر الحموضة في كل دفعة، وجاءت الأخيرة 7.72 مقابل مواصفة 8.00 ± 1.00.',
}

RU_PH_OLD = {
    'components/product/powersolution/powerSolutionCopy.ts': 'Как напечатано на упаковке. pH проверяют в каждой партии; последняя показала 5,94 при спецификации 6,00 ± 1,00.',
    'components/product/powersolution/awsCopy.ts': 'Как напечатано на коробке. pH проверяют в каждой партии, последняя пришла 4,93 при спецификации 4,80 ± 1,00.',
    'components/product/powersolution/ctsCopy.ts': 'Как напечатано на коробке. pH проверяют в каждой партии, последняя дала 7,61 при спецификации 7,00 ± 1,00.',
    'components/product/powersolution/pcsCopy.ts': 'Как напечатано на коробке. pH проверяют в каждой партии, последняя дала 7,98 при спецификации 7,70 ± 1,00.',
    'components/product/powersolution/swsCopy.ts': 'Как напечатано на коробке. pH проверяют в каждой партии, последняя дала 7,72 при спецификации 8,00 ± 1,00.',
}

for path, (en_v, en_spec, article, ru_v, ru_spec, ar_batch, _ru_verb, _sep) in PH_FILES.items():
    en_old = (f'As printed on the carton. pH is tested on every batch, and the last came back at '
              f'{en_v} against {article} {en_spec} ± 1.00 specification.')
    EDITS[path] = [
        (en_old,
         f'{EN_BASE_OPEN}. Every batch is tested for pH, and the last came back at '
         f'{en_v} inside {article} {en_spec} ± 1.00 specification.'),
        (AR_PH_OLD[path],
         f'{AR_BASE_OPEN}. تُختبر الحموضة في كل {ar_batch}، وجاءت الأخيرة {en_v} داخل مواصفة {en_spec} ± 1.00.'),
        (RU_PH_OLD[path],
         f'{RU_BASE_OPEN}. pH проверяют в каждой партии, последняя дала {ru_v} '
         f'внутри спецификации {ru_spec} ± 1,00.'),
    ]


failures = []
changed = 0

for path, pairs in sorted(EDITS.items()):
    src = open(path, encoding='utf-8').read()
    original = src
    for old, new in pairs:
        quoted_old = f"'{old}'"
        if quoted_old not in src:
            failures.append(f'{path}\n    MISSING: {old[:90]}')
            continue
        if src.count(quoted_old) != 1:
            failures.append(f'{path}\n    {src.count(quoted_old)} MATCHES: {old[:90]}')
            continue
        src = src.replace(quoted_old, f"'{new}'")
    if src != original:
        open(path, 'w', encoding='utf-8').write(src)
        changed += 1

print(f'files rewritten: {changed} / {len(EDITS)}')
if failures:
    print('\nFAILURES:')
    for f in failures:
        print(' ', f)
    sys.exit(1)
