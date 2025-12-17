import Link from 'next/link'
import { ArrowLeft, Shield, Mail, Phone } from 'lucide-react'
import type { Metadata } from 'next'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

export const metadata: Metadata = {
  title: 'Политика конфиденциальности - GENOSYS Middle East FZ-LLC | Защита данных и ваши права',
  description: 'Ознакомьтесь с нашей комплексной политикой конфиденциальности. Узнайте, как GENOSYS Middle East FZ-LLC защищает ваши личные данные, обрабатывает информацию и уважает ваши права на конфиденциальность в ОАЭ.',
  keywords: [
    'политика конфиденциальности',
    'защита данных',
    'личная информация',
    'права на конфиденциальность',
    'безопасность данных',
    'конфиденциальность GENOSYS'
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Политика конфиденциальности - GENOSYS Middle East FZ-LLC',
    description: 'Узнайте, как GENOSYS Middle East FZ-LLC защищает ваши личные данные и уважает ваши права на конфиденциальность.',
    type: 'website',
    url: 'https://genosys.ae/ru/privacy-policy',
    siteName: 'GENOSYS Middle East FZ-LLC',
    locale: 'ru_RU',
  },
  alternates: {
    canonical: 'https://genosys.ae/ru/privacy-policy',
    languages: {
      'en': 'https://genosys.ae/privacy-policy',
      'ar': 'https://genosys.ae/ar/privacy-policy',
      'ru': 'https://genosys.ae/ru/privacy-policy',
    },
  },
}

export default function PrivacyPolicyPageRussian() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Главная', url: 'https://genosys.ae/ru' },
          { name: 'Политика конфиденциальности', url: 'https://genosys.ae/ru/privacy-policy' },
        ]}
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
          {/* Back Button */}
          <Link 
            href="/ru"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Назад на главную</span>
          </Link>

          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-primary-100 p-4 rounded-xl">
                <Shield className="w-8 h-8 text-primary-600" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Политика конфиденциальности</h1>
                <p className="text-gray-600 mt-1">Ваши данные, ваши права</p>
              </div>
            </div>
            <p className="text-gray-600 text-lg">
              Последнее обновление: <span className="font-semibold">14 декабря 2024</span>
            </p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-8">
            {/* Introduction */}
            <section>
              <p className="text-lg text-gray-700 leading-relaxed">
                В <strong className="text-primary-600">GENOSYS Middle East FZ-LLC</strong> (далее именуемая «Компания») мы привержены защите вашей конфиденциальности и обеспечению безопасности вашей личной информации. Настоящая Политика конфиденциальности объясняет, как мы собираем, используем, храним и защищаем ваши данные при использовании нашего веб-сайта и услуг.
              </p>
            </section>

            {/* Section 1 */}
            <section className="border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                Личная информация, которую мы собираем
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed ml-10">
                <p>
                  Мы собираем и обрабатываем следующие типы личной информации для предоставления вам наших услуг:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Информация об учётной записи:</strong> Имя, адрес электронной почты, номер телефона, адрес доставки и выставления счёта</li>
                  <li><strong>Данные аутентификации:</strong> Учётные данные для входа, пароль (зашифрованный), токены аутентификации</li>
                  <li><strong>Информация о заказах:</strong> История покупок, детали заказа, платёжная информация (обрабатывается безопасно через Stripe)</li>
                  <li><strong>Данные профиля:</strong> Фото профиля, день рождения, предпочтения клиента</li>
                  <li><strong>Данные коммуникации:</strong> Обращения через контактную форму, запросы в службу поддержки, переписка по электронной почте</li>
                  <li><strong>Технические данные:</strong> IP-адрес, тип браузера, информация об устройстве, файлы cookie и аналитика использования</li>
                </ul>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                  <h3 className="font-bold text-gray-900 mb-2">1.1. Методы аутентификации</h3>
                  <p className="mb-2">Мы предлагаем три безопасных метода аутентификации:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><strong>Аутентификация Email/Пароль:</strong> Ваш пароль зашифрован и надёжно хранится</li>
                    <li><strong>Google OAuth 2.0:</strong> Войдите с помощью своей учётной записи Google для более быстрого и безопасного доступа</li>
                    <li><strong>Вход через Apple:</strong> Используйте свой Apple ID для безопасной аутентификации на устройствах iOS</li>
                  </ul>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mt-4">
                  <h3 className="font-bold text-gray-900 mb-2">1.2. Аутентификация Google</h3>
                  <p className="mb-2">Когда вы выбираете вход через Google, мы собираем:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Адрес электронной почты вашей учётной записи Google</li>
                    <li>Ваше полное имя из профиля Google</li>
                    <li>Фото вашего профиля Google (необязательно)</li>
                  </ul>
                  <p className="mt-3 text-sm">
                    <strong>Важно:</strong> Мы не храним ваш пароль Google. Аутентификация обрабатывается безопасно Google. Вы можете ознакомиться с Политикой конфиденциальности Google на{' '}
                    <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                      https://policies.google.com/privacy
                    </a>
                  </p>
                  <p className="mt-2 text-sm">
                    Ваши данные Google используются исключительно для аутентификации учётной записи и создания профиля. Мы никогда не передаём вашу информацию Google третьим лицам. Вы можете отвязать свою учётную запись Google в любое время в настройках профиля.
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
                  <h3 className="font-bold text-gray-900 mb-2">1.3. Вход через Apple</h3>
                  <p className="mb-2">Когда вы используете Вход через Apple, мы собираем:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Адрес электронной почты вашего Apple ID (или приватный email, если вы выбрали скрыть свою почту)</li>
                    <li>Ваше полное имя из вашего Apple ID (если предоставлено)</li>
                  </ul>
                  <p className="mt-3 text-sm">
                    <strong>Важно:</strong> Мы не храним ваш пароль Apple ID. Аутентификация обрабатывается безопасно Apple. Вход через Apple предоставляет дополнительные функции конфиденциальности, включая возможность скрыть ваш адрес электронной почты с помощью сервиса приватной почтовой ретрансляции Apple. Вы можете ознакомиться с Политикой конфиденциальности Apple на{' '}
                    <a href="https://www.apple.com/legal/privacy/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                      https://www.apple.com/legal/privacy/
                    </a>
                  </p>
                  <p className="mt-2 text-sm">
                    Ваши данные Apple ID используются исключительно для аутентификации учётной записи и создания профиля. Мы никогда не передаём вашу информацию Apple третьим лицам. Вы можете управлять настройками Входа через Apple непосредственно через настройки вашей учётной записи Apple ID или отвязать свою учётную запись Apple в настройках профиля.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section className="border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                Как мы используем вашу информацию
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed ml-10">
                <p>Мы обрабатываем вашу личную информацию для следующих целей:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Управление учётной записью:</strong> Создание и управление вашей учётной записью клиента, аутентификация и профиль</li>
                  <li><strong>Обработка заказов:</strong> Обработка ваших заказов, управление платежами и организация доставки</li>
                  <li><strong>Обслуживание клиентов:</strong> Ответы на ваши запросы, предоставление поддержки и решение проблем</li>
                  <li><strong>Маркетинговые коммуникации:</strong> Отправка рекламных писем, специальных предложений и обновлений продуктов (с вашего согласия)</li>
                  <li><strong>Улучшение веб-сайта:</strong> Анализ паттернов использования для улучшения нашего веб-сайта, продуктов и услуг</li>
                  <li><strong>Безопасность:</strong> Защита от мошенничества, несанкционированного доступа и других угроз безопасности</li>
                  <li><strong>Соблюдение законодательства:</strong> Выполнение наших юридических обязательств и соблюдение наших условий обслуживания</li>
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section className="border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
                Хранение данных и безопасность
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed ml-10">
                <p>Мы серьёзно относимся к безопасности данных и применяем отраслевые стандарты безопасности:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Шифрование:</strong> Все конфиденциальные данные шифруются с использованием технологии SSL/TLS</li>
                  <li><strong>Безопасное хранение:</strong> Ваши данные хранятся на защищённых серверах с ограниченным доступом</li>
                  <li><strong>Защита паролей:</strong> Пароли хешируются и шифруются с помощью bcrypt</li>
                  <li><strong>Безопасность платежей:</strong> Вся обработка платежей осуществляется через Stripe, платёжный процессор, соответствующий стандарту PCI DSS</li>
                  <li><strong>Регулярные проверки:</strong> Мы проводим регулярные проверки безопасности и обновления</li>
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section className="border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">4</span>
                Хранение данных
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed ml-10">
                <p>Мы храним вашу личную информацию в течение следующих периодов:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Данные учётной записи:</strong> Хранятся, пока ваша учётная запись активна, плюс 3 года после удаления учётной записи (для соблюдения законодательства)</li>
                  <li><strong>История заказов:</strong> Хранится в течение 7 лет (требования ведения коммерческого учёта ОАЭ)</li>
                  <li><strong>Маркетинговые данные:</strong> Хранятся до отзыва вами согласия или отказа от подписки</li>
                  <li><strong>Технические логи:</strong> Хранятся в течение 90 дней для целей безопасности и устранения неполадок</li>
                </ul>
                <p className="mt-4">
                  Вы можете запросить удаление ваших данных в любое время, связавшись с нами или удалив учётную запись через настройки профиля.
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section className="border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">5</span>
                Ваши права на конфиденциальность
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed ml-10">
                <p>У вас есть следующие права в отношении ваших личных данных:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Право на доступ:</strong> Запросить копию ваших личных данных</li>
                  <li><strong>Право на исправление:</strong> Исправить неточные или неполные данные</li>
                  <li><strong>Право на удаление:</strong> Запросить удаление ваших личных данных</li>
                  <li><strong>Право на ограничение:</strong> Ограничить использование ваших данных</li>
                  <li><strong>Право на переносимость данных:</strong> Получить ваши данные в структурированном, машиночитаемом формате</li>
                  <li><strong>Право на возражение:</strong> Возразить против обработки ваших данных в маркетинговых целях</li>
                  <li><strong>Право на отзыв согласия:</strong> Отозвать согласие в любое время (не затрагивая предыдущую обработку)</li>
                </ul>
              </div>
            </section>

            {/* Section 6 */}
            <section className="border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">6</span>
                Файлы cookie и отслеживание
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed ml-10">
                <p>Мы используем файлы cookie и аналогичные технологии для:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Запоминания вашего статуса входа и предпочтений</li>
                  <li>Анализа трафика веб-сайта и поведения пользователей</li>
                  <li>Предоставления персонализированного контента и рекомендаций</li>
                  <li>Измерения эффективности наших маркетинговых кампаний</li>
                </ul>
                <p className="mt-4">
                  Вы можете управлять файлами cookie через настройки вашего браузера. Однако отключение файлов cookie может повлиять на функциональность нашего веб-сайта.
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section className="border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">7</span>
                Сторонние сервисы
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed ml-10">
                <p>Мы работаем с надёжными сторонними поставщиками услуг:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Stripe:</strong> Обработка платежей (соответствует PCI DSS)</li>
                  <li><strong>Google OAuth:</strong> Услуги аутентификации</li>
                  <li><strong>Vercel:</strong> Хостинг веб-сайта и инфраструктура</li>
                  <li><strong>Провайдеры электронной почты:</strong> Транзакционные и маркетинговые письма</li>
                  <li><strong>Провайдеры аналитики:</strong> Аналитика веб-сайта и мониторинг производительности</li>
                </ul>
                <p className="mt-4">
                  Эти провайдеры имеют доступ к вашей личной информации только для выполнения услуг от нашего имени и обязаны соблюдать конфиденциальность.
                </p>
              </div>
            </section>

            {/* Section 8 */}
            <section className="border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">8</span>
                Право на отказ от согласия
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed ml-10">
                <p>
                  У вас есть право отказать или отозвать согласие на сбор и обработку вашей личной информации. Однако обратите внимание:
                </p>
                <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4 mt-4">
                  <p className="font-semibold text-amber-900 mb-2">⚠️ Важное уведомление</p>
                  <p className="text-amber-800">
                    Если вы откажетесь предоставить необходимую личную информацию, мы можем быть не в состоянии предоставить определённые услуги, включая регистрацию учётной записи, обработку заказов и поддержку клиентов. Основные данные необходимы для базовой функциональности веб-сайта.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 9 */}
            <section className="border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">9</span>
                Конфиденциальность детей
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed ml-10">
                <p>
                  Наши услуги не предназначены для лиц младше 18 лет. Мы сознательно не собираем личную информацию от детей. Если вы являетесь родителем или опекуном и считаете, что ваш ребёнок предоставил нам личную информацию, пожалуйста, свяжитесь с нами немедленно.
                </p>
              </div>
            </section>

            {/* Section 10 */}
            <section className="border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">10</span>
                Изменения в этой политике
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed ml-10">
                <p>
                  Мы можем обновлять эту Политику конфиденциальности время от времени, чтобы отразить изменения в наших практиках или юридических требованиях. Мы уведомим вас о любых существенных изменениях:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Размещением обновлённой политики на нашем веб-сайте</li>
                  <li>Отправкой уведомления по электронной почте зарегистрированным пользователям</li>
                  <li>Размещением заметного уведомления на нашем веб-сайте</li>
                </ul>
                <p className="mt-4">
                  Ваше дальнейшее использование наших услуг после таких изменений означает принятие обновлённой Политики конфиденциальности.
                </p>
              </div>
            </section>

            {/* Contact Section */}
            <section className="border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">11</span>
                Свяжитесь с нами
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed ml-10">
                <p className="mb-4">
                  Если у вас есть вопросы, опасения или запросы относительно этой Политики конфиденциальности или ваших личных данных, пожалуйста, свяжитесь с нами:
                </p>
                
                <div className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-xl p-6 space-y-4">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-3">GENOSYS Middle East FZ-LLC</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-primary-600 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-900">Email:</p>
                          <a href="mailto:sales@genosys.ae" className="text-primary-600 hover:underline">
                            sales@genosys.ae
                          </a>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-primary-600 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-900">Телефон / WhatsApp:</p>
                          <a href="tel:+971585487665" className="text-primary-600 hover:underline">
                            +971 58 548 76 65
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    Мы стремимся отвечать на все запросы, связанные с конфиденциальностью, в течение 1 рабочего дня.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Footer Note */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Эта Политика конфиденциальности вступает в силу с 14 декабря 2024 года</p>
            <p className="mt-2">© 2026 GENOSYS Middle East FZ-LLC. Все права защищены.</p>
          </div>
        </div>
      </div>
    </>
  )
}


