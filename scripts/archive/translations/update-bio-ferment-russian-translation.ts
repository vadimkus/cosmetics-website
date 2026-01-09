import 'dotenv/config'
import { prisma } from '@/lib/prisma'
import { debugLog, errorLog } from '@/lib/logger'

async function updateBioFermentRussianTranslation() {
  try {
    const slug = 'bio-ferment-age-defying-powder-mask-launch'
    
    const titleRu = 'НОВИНКА: Маска BIO-FERMENT AGE DEFYING POWDER — продвинутая антивозрастная защита с факторами роста и ферментированной энергией'
    const excerptRu = 'Представляем маску GENOSYS BIO-FERMENT AGE DEFYING POWDER MASK — революционную порошковую маску, обогащенную ферментированной энергией и факторами роста, которая обеспечивает быстрое успокоение и глубокое питание кожи, ослабленной внешними стрессорами.'
    
    const contentRu = `<div class="blog-content">
  <div class="intro-section mb-8 pb-8 border-b border-gray-200">
    <p class="text-xl text-gray-700 leading-relaxed mb-4">
      Мы рады представить новейшее дополнение к профессиональной коллекции ухода за кожей GENOSYS: <a href="/ru/products/51" class="text-primary-600 hover:text-primary-700 font-semibold underline transition-colors">маску BIO-FERMENT AGE DEFYING POWDER MASK</a>. Эта революционная порошковая маска сочетает силу ферментированной энергии и факторов роста для быстрого успокоения и глубокого питания кожи, ослабленной внешними стрессорами.
    </p>
    <p class="text-lg text-gray-700 leading-relaxed">
      В отличие от традиционных масок, которые высыхают, эта маска премиального качества на основе диатомита с технологией удержания влаги обеспечивает мощные антивозрастные преимущества с исключительными увлажняющими эффектами и временным снижением температуры кожи для охлаждающего ощущения.
    </p>
  </div>

  <div class="feature-section mb-10">
    <h2 class="text-3xl font-bold text-gray-800 mb-6 mt-8">Что делает эту порошковую маску особенной?</h2>
    <p class="text-lg text-gray-700 mb-6 leading-relaxed">
      <a href="/ru/products/51" class="text-primary-600 hover:text-primary-700 font-semibold underline transition-colors">Маска GENOSYS BIO-FERMENT AGE DEFYING POWDER MASK</a> — это профессиональная порошковая маска, разработанная как для профессионального использования, так и для домашнего ухода. Она выделяется уникальным сочетанием передовых ингредиентов:
    </p>

    <div class="grid md:grid-cols-3 gap-6 mb-8">
      <div class="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200">
        <div class="text-4xl mb-4">🌿</div>
        <h3 class="text-xl font-bold text-gray-800 mb-3">6 типов регенеративных пептидов</h3>
        <p class="text-gray-700 leading-relaxed">
          Содержит комплексный комплекс факторов роста, включая EGF, FGF, IGF, KGF, VEGF и TGF. Эти мощные пептиды стимулируют пролиферацию клеток, способствуют синтезу коллагена, ускоряют заживление ран и улучшают естественный процесс обновления кожи.
        </p>
      </div>

      <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
        <div class="text-4xl mb-4">⚗️</div>
        <h3 class="text-xl font-bold text-gray-800 mb-3">4 типа ферментированных продуктов</h3>
        <p class="text-gray-700 leading-relaxed">
          Использует силу ферментации с Lactobacillus/Punica Granatum Fruit Ferment, Bacillus/Soybean Ferment, Galactomyces Ferment Filtrate и Bifida Ferment Lysate. Ферментация повышает эффективность и безопасность ингредиентов, одновременно поддерживая барьер кожи.
        </p>
      </div>

      <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
        <div class="text-4xl mb-4">💧</div>
        <h3 class="text-xl font-bold text-gray-800 mb-3">Технология удержания влаги</h3>
        <p class="text-gray-700 leading-relaxed">
          Создана на основе диатомита премиального качества, эта маска не высыхает, как традиционные маски. Она удерживает влагу, обеспечивая глубокое увлажнение и временный охлаждающий эффект, который снижает температуру кожи.
        </p>
      </div>
    </div>
  </div>

  <div class="comparison-section mb-10 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-8 border border-purple-100">
    <h2 class="text-3xl font-bold text-gray-800 mb-6">Сравнение: BIO-FERMENT vs HYDRO COOL MODELING MASK</h2>
    <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div class="grid md:grid-cols-2 gap-6">
        <div>
          <h3 class="text-xl font-semibold text-gray-800 mb-4">BIO-FERMENT AGE DEFYING POWDER MASK</h3>
          <ul class="space-y-2 text-gray-700">
            <li class="flex items-start gap-2">
              <span class="text-primary-600 mt-1">•</span>
              <span><strong>Размер:</strong> 300г / 10.582 унций</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-primary-600 mt-1">•</span>
              <span><strong>Использование:</strong> Профессиональное / Домашний уход</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-primary-600 mt-1">•</span>
              <span><strong>Особенность:</strong> Увлажняющая маска, которая не высыхает</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-primary-600 mt-1">•</span>
              <span><strong>Лучше всего для:</strong> Увлажнения и успокоения с дополнительными питательными веществами</span>
            </li>
          </ul>
        </div>
        <div>
          <h3 class="text-xl font-semibold text-gray-800 mb-4">HYDRO COOL MODELING MASK</h3>
          <ul class="space-y-2 text-gray-700">
            <li class="flex items-start gap-2">
              <span class="text-gray-400 mt-1">•</span>
              <span><strong>Размер:</strong> 1кг / 35.2 унций</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-gray-400 mt-1">•</span>
              <span><strong>Использование:</strong> Профессиональное использование</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-gray-400 mt-1">•</span>
              <span><strong>Особенность:</strong> Охлаждающая маска до удаления</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-gray-400 mt-1">•</span>
              <span><strong>Лучше всего для:</strong> Быстрого снижения температуры кожи</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <div class="clinical-results-section mb-10 bg-gradient-to-r from-primary-50 to-red-50 rounded-xl p-8 border border-primary-100">
    <h2 class="text-3xl font-bold text-gray-800 mb-6">Клинические результаты</h2>
    <p class="text-lg text-gray-700 mb-6 leading-relaxed">
      Клинические исследования продемонстрировали исключительные результаты как в увлажнении кожи, так и в охлаждающих эффектах:
    </p>
    
    <div class="grid md:grid-cols-2 gap-6 mb-6">
      <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Улучшение увлажнения кожи</h3>
        <div class="space-y-3">
          <div>
            <div class="text-2xl font-bold text-primary-600 mb-1">322.971%</div>
            <p class="text-sm text-gray-600">Улучшение содержания влаги в коже</p>
            <p class="text-xs text-gray-500 mt-1">Середина 50-х, нормальная до сухой кожи</p>
          </div>
          <div class="border-t border-gray-200 pt-3">
            <div class="text-2xl font-bold text-primary-600 mb-1">327.066%</div>
            <p class="text-sm text-gray-600">Улучшение содержания влаги в коже</p>
            <p class="text-xs text-gray-500 mt-1">Конец 40-х, сухая кожа</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Снижение температуры кожи (охлаждающий эффект)</h3>
        <div class="space-y-3">
          <div>
            <div class="text-2xl font-bold text-primary-600 mb-1">29.569%</div>
            <p class="text-sm text-gray-600">Снижение температуры (-11°C)</p>
            <p class="text-xs text-gray-500 mt-1">Середина 50-х, нормальная до сухой кожи</p>
          </div>
          <div class="border-t border-gray-200 pt-3">
            <div class="text-2xl font-bold text-primary-600 mb-1">27.520%</div>
            <p class="text-sm text-gray-600">Снижение температуры (-10°C)</p>
            <p class="text-xs text-gray-500 mt-1">Конец 30-х, жирная кожа</p>
          </div>
        </div>
      </div>
    </div>
    
    <p class="text-gray-700 mt-4 leading-relaxed">
      Эти клинически доказанные результаты демонстрируют исключительную способность маски улучшать увлажнение кожи, одновременно обеспечивая значительный охлаждающий эффект, что делает её идеальной для успокоения раздраженной или перегретой кожи.
    </p>
  </div>

  <div class="images-section mb-10">
    <div class="grid md:grid-cols-3 gap-6">
      <div class="bg-white rounded-xl overflow-hidden shadow-md border border-gray-200">
        <img src="/blog/biof.jpeg" alt="Маска BIO-FERMENT AGE DEFYING POWDER MASK" class="w-full h-64 object-cover" />
      </div>
      <div class="bg-white rounded-xl overflow-hidden shadow-md border border-gray-200">
        <img src="/blog/biof2.jpeg" alt="Применение маски BIO-FERMENT AGE DEFYING POWDER MASK" class="w-full h-64 object-cover" />
      </div>
      <div class="bg-white rounded-xl overflow-hidden shadow-md border border-gray-200">
        <img src="/blog/biof3.jpeg" alt="Результаты маски BIO-FERMENT AGE DEFYING POWDER MASK" class="w-full h-64 object-cover" />
      </div>
    </div>
  </div>

  <div class="ingredients-section mb-10">
    <h2 class="text-3xl font-bold text-gray-800 mb-6">Ключевые ингредиенты</h2>
    <p class="text-lg text-gray-700 mb-6 leading-relaxed">
      <a href="/ru/products/51" class="text-primary-600 hover:text-primary-700 font-semibold underline transition-colors">Маска BIO-FERMENT AGE DEFYING POWDER MASK</a> создана с комплексной смесью научно доказанных ингредиентов, организованных в три ключевых комплекса:
    </p>

    <div class="grid md:grid-cols-3 gap-6 mb-8">
      <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
        <h3 class="text-xl font-bold text-gray-800 mb-4">Комплекс факторов роста (6GFs)</h3>
        <ul class="space-y-3 text-gray-700">
          <li class="flex items-start gap-2">
            <span class="text-primary-600 font-bold mt-1">•</span>
            <div>
              <strong class="text-gray-800">EGF (Эпидермальный фактор роста):</strong> Стимулирует пролиферацию и дифференцировку кератиноцитов, способствует естественному обновлению клеток и заживлению ран.
            </div>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-primary-600 font-bold mt-1">•</span>
            <div>
              <strong class="text-gray-800">FGF (Фактор роста фибробластов):</strong> Стимулирует рост клеток фибробластов, способствует синтезу коллагена, эластина и компонентов внеклеточного матрикса.
            </div>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-primary-600 font-bold mt-1">•</span>
            <div>
              <strong class="text-gray-800">IGF (Инсулиноподобный фактор роста):</strong> Стимулирует пролиферацию клеток и способствует заживлению ран.
            </div>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-primary-600 font-bold mt-1">•</span>
            <div>
              <strong class="text-gray-800">KGF (Фактор роста кератиноцитов):</strong> Стимулирует пролиферацию и миграцию кератиноцитов, ускоряет естественное заживление, способствует росту рогового слоя.
            </div>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-primary-600 font-bold mt-1">•</span>
            <div>
              <strong class="text-gray-800">VEGF (Сосудистый эндотелиальный фактор роста):</strong> Стимулирует образование кровеносных сосудов, способствуя доставке кислорода и питательных веществ к коже.
            </div>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-primary-600 font-bold mt-1">•</span>
            <div>
              <strong class="text-gray-800">TGF (Трансформирующий фактор роста):</strong> Стимулирует пролиферацию и дифференцировку клеток, заживляет раны.
            </div>
          </li>
        </ul>
      </div>

      <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
        <h3 class="text-xl font-bold text-gray-800 mb-4">Комплекс ферментированной энергии</h3>
        <ul class="space-y-3 text-gray-700">
          <li class="flex items-start gap-2">
            <span class="text-primary-600 font-bold mt-1">•</span>
            <div>
              <strong class="text-gray-800">Экстракт фермента Lactobacillus/Punica Granatum Fruit:</strong> Пробиотические преимущества, которые поддерживают барьер кожи и уменьшают воспаление.
            </div>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-primary-600 font-bold mt-1">•</span>
            <div>
              <strong class="text-gray-800">Экстракт фермента Bacillus/Soybean:</strong> Повышенная биодоступность и эффективность благодаря процессу ферментации.
            </div>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-primary-600 font-bold mt-1">•</span>
            <div>
              <strong class="text-gray-800">Фильтрат фермента Galactomyces:</strong> Богат аминокислотами и витаминами, осветляет и увлажняет кожу.
            </div>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-primary-600 font-bold mt-1">•</span>
            <div>
              <strong class="text-gray-800">Лизат фермента Bifida:</strong> Укрепляет барьер кожи, улучшает устойчивость кожи и снижает чувствительность.
            </div>
          </li>
        </ul>
        <p class="text-sm text-gray-600 mt-4 italic">
          Ферментация использует естественные биохимические реакции для повышения эффективности и безопасности, в результате чего получаются пробиотики или постбиотики, которые поддерживают барьер кожи и уменьшают воспаление.
        </p>
      </div>

      <div class="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200">
        <h3 class="text-xl font-bold text-gray-800 mb-4">Увлажняющий и успокаивающий комплекс</h3>
        <ul class="space-y-3 text-gray-700">
          <li class="flex items-start gap-2">
            <span class="text-primary-600 font-bold mt-1">•</span>
            <div>
              <strong class="text-gray-800">Экстракт корня Glycyrrhiza Glabra (солодка):</strong> Богат флавоноидами (глабридин, ликвиритин, ликохалкон) и сапонином (глицирризин). Ингибирует меланогенез, обеспечивает противовоспалительные эффекты, нейтрализует свободные радикалы.
            </div>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-primary-600 font-bold mt-1">•</span>
            <div>
              <strong class="text-gray-800">Экстракт отрубей Oryza Sativa (риса):</strong> Богатый источник более 100 антиоксидантных соединений, включая витамин E, феруловую кислоту и оризанол. Защищает от окислительного стресса, сохраняет кожу гладкой и увлажненной.
            </div>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-primary-600 font-bold mt-1">•</span>
            <div>
              <strong class="text-gray-800">Вода Chamaecyparis Obtusa (кипарисовая вода):</strong> Богата фитонцидами с антимикробными, противовоспалительными и успокаивающими свойствами. Успокаивает раздраженную кожу и улучшает кожные инфекции.
            </div>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-primary-600 font-bold mt-1">•</span>
            <div>
              <strong class="text-gray-800">Экстракт листьев Aloe Barbadensis:</strong> Богат витаминами (A,B,C,E,B12), аминокислотами и минералами. Обладает антиоксидантными качествами, уменьшает раздражение, способствует заживлению и увлажняет кожу.
            </div>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-primary-600 font-bold mt-1">•</span>
            <div>
              <strong class="text-gray-800">Гидролизованный коллаген:</strong> Способствует росистому и гладкому внешнему виду за счет увеличения уровня влаги в коже, подтягивает кожу.
            </div>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-primary-600 font-bold mt-1">•</span>
            <div>
              <strong class="text-gray-800">Аллантоин:</strong> Отличные противовоспалительные и противовоспалительные свойства. Увеличивает содержание воды, отшелушивает омертвевшие клетки кожи для более чистого и яркого цвета лица.
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>

  <div class="how-to-use-section mb-10 bg-blue-50 rounded-xl p-8 border border-blue-100">
    <h2 class="text-3xl font-bold text-gray-800 mb-4">Как использовать</h2>
    <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <ol class="space-y-4 text-gray-700">
        <li class="flex items-start gap-3">
          <span class="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">1</span>
          <span class="pt-1">Смешайте три мерные ложки порошка (40г) с четырьмя с половиной мерными ложками воды, используя прилагаемую мерную чашку. Используйте соотношение Порошок 1: Вода 1.5.</span>
        </li>
        <li class="flex items-start gap-3">
          <span class="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">2</span>
          <span class="pt-1">Нанесите равномерно на область обработки, избегая глаз и бровей.</span>
        </li>
        <li class="flex items-start gap-3">
          <span class="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">3</span>
          <span class="pt-1">Снимите через 15-20 минут и удалите остатки тоником.</span>
        </li>
      </ol>
      <div class="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p class="text-sm text-gray-700 font-semibold mb-2">⚠️ Важное предупреждение:</p>
        <ul class="text-sm text-gray-600 space-y-1">
          <li>• После использования закройте крышку и держите её плотно закрытой.</li>
          <li>• Из-за природы порошкового типа продукт может испортиться при воздействии света или влаги в воздухе.</li>
        </ul>
      </div>
    </div>
  </div>

  <div class="benefits-section mb-10">
    <h2 class="text-3xl font-bold text-gray-800 mb-6">Ключевые преимущества</h2>
    <div class="grid md:grid-cols-2 gap-4">
      <div class="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
        <div class="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
          <span class="text-primary-600 font-bold">✓</span>
        </div>
        <div>
          <h3 class="font-semibold text-gray-800 mb-1">Исключительное увлажнение</h3>
          <p class="text-gray-600 text-sm">Клинически доказано улучшение содержания влаги в коже более чем на 320%</p>
        </div>
      </div>
      <div class="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
        <div class="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
          <span class="text-primary-600 font-bold">✓</span>
        </div>
        <div>
          <h3 class="font-semibold text-gray-800 mb-1">Охлаждающий эффект</h3>
          <p class="text-gray-600 text-sm">Снижает температуру кожи до 11°C, обеспечивая мгновенное охлаждающее ощущение</p>
        </div>
      </div>
      <div class="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
        <div class="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
          <span class="text-primary-600 font-bold">✓</span>
        </div>
        <div>
          <h3 class="font-semibold text-gray-800 mb-1">Антивозрастная сила</h3>
          <p class="text-gray-600 text-sm">6 типов факторов роста стимулируют синтез коллагена и обновление клеток</p>
        </div>
      </div>
      <div class="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
        <div class="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
          <span class="text-primary-600 font-bold">✓</span>
        </div>
        <div>
          <h3 class="font-semibold text-gray-800 mb-1">Технология удержания влаги</h3>
          <p class="text-gray-600 text-sm">Не высыхает, как традиционные маски, поддерживает увлажнение на протяжении всего использования</p>
        </div>
      </div>
      <div class="flex items-start gap-3 p-4 bg-gray-50 rounded-lg md:col-span-2">
        <div class="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
          <span class="text-primary-600 font-bold">✓</span>
        </div>
        <div>
          <h3 class="font-semibold text-gray-800 mb-1">Двойное использование</h3>
          <p class="text-gray-600 text-sm">Подходит как для профессионального использования в клиниках, так и для домашнего ухода</p>
        </div>
      </div>
    </div>
  </div>

  <div class="beneficiaries-section mb-10">
    <h2 class="text-3xl font-bold text-gray-800 mb-6">Кому это подходит?</h2>
    <p class="text-lg text-gray-700 mb-4 leading-relaxed">
      Эта порошковая маска идеальна для:
    </p>
    <ul class="space-y-3 text-gray-700">
      <li class="flex items-start gap-3">
        <span class="text-primary-600 mt-1">•</span>
        <span>Клиентов, ищущих продвинутые антивозрастные процедуры</span>
      </li>
      <li class="flex items-start gap-3">
        <span class="text-primary-600 mt-1">•</span>
        <span>Тех, у кого обезвоженная или сухая кожа</span>
      </li>
      <li class="flex items-start gap-3">
        <span class="text-primary-600 mt-1">•</span>
        <span>Людей, испытывающих раздражение или воспаление кожи</span>
      </li>
      <li class="flex items-start gap-3">
        <span class="text-primary-600 mt-1">•</span>
        <span>Клиентов, нуждающихся в восстановлении после процедур и успокоении</span>
      </li>
      <li class="flex items-start gap-3">
        <span class="text-primary-600 mt-1">•</span>
        <span>Профессиональных клиник, требующих эффективных антивозрастных процедур</span>
      </li>
      <li class="flex items-start gap-3">
        <span class="text-primary-600 mt-1">•</span>
        <span>Пользователей домашнего ухода, ищущих результаты профессионального уровня</span>
      </li>
    </ul>
  </div>

  <div class="application-section mb-10 bg-blue-50 rounded-xl p-8 border border-blue-100">
    <h2 class="text-3xl font-bold text-gray-800 mb-4">Профессиональное применение</h2>
    <p class="text-lg text-gray-700 leading-relaxed">
      <a href="/ru/products/51" class="text-primary-600 hover:text-primary-700 font-semibold underline transition-colors">Маска GENOSYS BIO-FERMENT AGE DEFYING POWDER MASK</a> разработана как для профессионального использования в клиниках и спа, так и для домашнего применения. Она может быть включена в процедуры для лица, использоваться как восстановительная маска после процедур или рекомендована для регулярного домашнего использования. Размер 300г обеспечивает множественные применения, что делает её экономически эффективной как для профессионального, так и для личного использования.
    </p>
  </div>

  <div class="about-section mb-10">
    <h2 class="text-3xl font-bold text-gray-800 mb-4">О GENOSYS</h2>
    <p class="text-lg text-gray-700 leading-relaxed">
      GENOSYS — это профессиональный корейский бренд дерматокосметики, распространяемый GENOSYS Middle East FZ-LLC в ОАЭ. Все наши продукты сертифицированы муниципалитетом Дубая и подходят для лицензированных специалистов и профессиональных клиник красоты. Мы являемся официальным дистрибьютором DTS MG Co., Ltd. Korea, что гарантирует подлинные и сертифицированные продукты.
    </p>
  </div>

  <div class="cta-section bg-gradient-to-r from-primary-50 to-red-50 rounded-xl p-8 border border-primary-100 mb-8">
    <h2 class="text-3xl font-bold text-gray-800 mb-4">Ощутите клинически доказанные результаты</h2>
    <p class="text-lg mb-6 text-gray-700 leading-relaxed">
      Ощутите исключительные антивозрастные и увлажняющие эффекты с новой <a href="/ru/products/51" class="text-primary-600 hover:text-primary-700 font-semibold underline transition-colors">маской GENOSYS BIO-FERMENT AGE DEFYING POWDER MASK</a>. Этот инновационный продукт сочетает передовые корейские технологии ухода за кожей с ферментированной энергией и факторами роста для достижения исключительных результатов.
    </p>
    <div class="flex flex-col sm:flex-row gap-4">
      <a href="/ru/products/51" class="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors text-center shadow-md hover:shadow-lg">
        Посмотреть детали продукта
      </a>
      <a href="mailto:sales@genosys.ae" class="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-center border border-primary-600 shadow-md hover:shadow-lg">
        Связаться с отделом продаж
      </a>
      <a href="https://wa.me/971585487665" target="_blank" rel="noopener noreferrer" class="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors text-center shadow-md hover:shadow-lg">
        Написать в WhatsApp
      </a>
    </div>
  </div>

  <div class="source-section text-sm text-gray-500 border-t border-gray-200 pt-6">
    <p>
      <em>Источник: <a href="/documents/ppt/GENOSYS%20BIO-FERMENT%20AGE%20DEFYING%20POWDER%20MASK.pdf" target="_blank" rel="noopener noreferrer" class="text-primary-600 hover:text-primary-700 underline">Документация продукта PDF</a></em>
    </p>
  </div>
</div>`

    const post = await prisma.blogPost.findUnique({
      where: { slug }
    })

    if (!post) {
      errorLog(`Blog post with slug "${slug}" not found.`)
      return
    }

    await prisma.blogPost.update({
      where: { slug },
      data: {
        titleRu,
        excerptRu,
        contentRu,
      }
    })

    debugLog('✅ Updated Russian translation for BIO-FERMENT blog post')
    debugLog(`   Title: ${titleRu}`)
    debugLog(`   Excerpt length: ${excerptRu.length}`)
    debugLog(`   Content length: ${contentRu.length}`)
  } catch {
    errorLog('❌ Failed to update Russian translation:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

updateBioFermentRussianTranslation()
  .then(() => {
    console.log('\n🎉 Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Error:', error)
    process.exit(1)
  })

