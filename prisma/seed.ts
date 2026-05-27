import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../app/generated/prisma/client'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const equipmentTypes = [
  { name: 'Автобетононасосы', icon: 'https://imgp24.ru/img_beta/icons_grey/p2-ic4.png' },
  { name: 'Автовышки', icon: 'https://imgp24.ru/img_beta/icons_grey/p2-ic1.png' },
  { name: 'Автокраны', icon: 'https://imgp24.ru/img_beta/icons_grey/p2-ic2.png' },
  { name: 'Ассенизаторы и илососы', icon: 'https://imgp24.ru/img_beta/icons_grey/p2-ic3.png' },
  { name: 'Бензовозы и автоцистерны', icon: 'https://imgp24.ru/img_beta/icons_grey/p2-ic5.png' },
  { name: 'Бетоновозы', icon: 'https://imgp24.ru/img_beta/icons_grey/p2-ic6.png' },
  { name: 'Бульдозеры', icon: 'https://imgp24.ru/img_beta/icons_grey/p2-ic7.png' },
  { name: 'Гидромолоты', icon: 'https://imgp24.ru/img_beta/icons_grey/p2-ic8.png' },
  { name: 'Грейдеры', icon: 'https://imgp24.ru/img_beta/icons_grey/p2-ic9.png' },
  { name: 'Грейферные погрузчики', icon: 'https://imgp24.ru/img_beta/icons_grey/p2-ic10.png' },
  { name: 'Дорожные катки и асфальтоукладчики', icon: 'https://imgp24.ru/img_beta/icons_grey/p2-ic11.png' },
  { name: 'Манипуляторы', icon: 'https://imgp24.ru/img_beta/icons_grey/p2-ic12.png' },
  { name: 'Мини-погрузчики', icon: 'https://imgp24.ru/img_beta/icons_grey/p2-ic13.png' },
  { name: 'Мини-экскаваторы', icon: 'https://imgp24.ru/img_beta/icons_grey/p2-ic14.png' },
  { name: 'Мусоровозы бункеровозы и ломовозы', icon: 'https://imgp24.ru/img_beta/icons_grey/p2-ic15.png' },
  { name: 'Тралы и низкорамные платформы', icon: 'https://imgp24.ru/img_beta/icons_grey/p2-ic16.png' },
  { name: 'Поливомоечные машины', icon: 'https://imgp24.ru/img_beta/icons_grey/p2-ic17.png' },
  { name: 'Самосвалы и тонары', icon: 'https://imgp24.ru/img_beta/icons_grey/p2-ic18.png' },
  { name: 'Тракторы', icon: 'https://imgp24.ru/img_beta/icons_grey/p2-ic19.png' },
  { name: 'Фронтальные погрузчики', icon: 'https://imgp24.ru/img_beta/icons_grey/p2-ic20.png' },
  { name: 'Эвакуаторы и автовозы', icon: 'https://imgp24.ru/img_beta/icons_grey/p2-ic21.png' },
  { name: 'Экскаваторы', icon: 'https://imgp24.ru/img_beta/icons_grey/p2-ic22.png' },
  { name: 'Экскаваторы-погрузчики', icon: 'https://imgp24.ru/img_beta/icons_grey/p2-ic23.png' },
  { name: 'Ямобуры', icon: 'https://imgp24.ru/img_beta/icons_grey/p2-ic24.png' },
  { name: 'Другая техника', icon: 'https://imgp24.ru/img_beta/icons_grey/tehnika1.png' },
]

const helpFaq = [
  {
    question: 'Как создать заявку?',
    answer: 'Нажмите кнопку + на главной странице и заполните форму пошагово: выберите тип заявки, укажите детали, контакты и способ оплаты.',
    order: 0,
  },
  {
    question: 'Какие типы заявок доступны?',
    answer: 'Доступно три типа: аренда спецтехники (на несколько дней), перевозка груза (с адресом отправки и назначения) и доставка (только конечный адрес).',
    order: 1,
  },
  {
    question: 'Как отменить заявку?',
    answer: 'Перейдите в раздел «Мои заявки», найдите нужную и нажмите кнопку «Отменить». Отменить можно только заявки в статусе «Черновик» или «Опубликована».',
    order: 2,
  },
  {
    question: 'Зачем нужна подписка?',
    answer: 'Подписка открывает доступ к просмотру контактов исполнителей и приоритетному размещению заявок в общем списке.',
    order: 3,
  },
  {
    question: 'Сколько стоит аренда техники?',
    answer: 'Стоимость определяется исполнителем при отклике на заявку. Вы можете указать ставку в час при создании заявки.',
    order: 4,
  },
  {
    question: 'Что делать, если исполнитель не вышел на связь?',
    answer: 'Свяжитесь с нашей службой поддержки через Telegram или по телефону — мы поможем разобраться в ситуации.',
    order: 5,
  },
]

const helpContacts = [
  {
    label: 'Telegram',
    type: 'telegram',
    value: '@special_equipment_support',
    url: 'https://t.me/special_equipment_support',
    order: 0,
  },
  {
    label: 'Телефон',
    type: 'phone',
    value: '8 800 123-45-67',
    url: 'tel:+78001234567',
    order: 1,
  },
  {
    label: 'Email',
    type: 'email',
    value: 'support@special-equipment.ru',
    url: 'mailto:support@special-equipment.ru',
    order: 2,
  },
]

const seedUsers = [
  { telegramId: 100000001n, firstName: 'Иван', lastName: 'Петров', username: 'ivan_petrov', isAdmin: true },
  { telegramId: 100000002n, firstName: 'Алексей', lastName: 'Смирнов', username: 'alexey_smirnov', subscriptionExpiresAt: new Date('2027-01-01') },
  { telegramId: 100000003n, firstName: 'Сергей', lastName: 'Козлов', username: 'sergey_kozlov' },
  { telegramId: 100000004n, firstName: 'Михаил', lastName: 'Новиков', username: 'misha_novikov' },
  { telegramId: 100000005n, firstName: 'Дмитрий', lastName: 'Федоров', username: null },
]

async function main() {
  console.log('Seeding equipment types...')

  for (const item of equipmentTypes) {
    await prisma.equipmentType.upsert({
      where: { name: item.name },
      update: { icon: item.icon },
      create: item,
    })
  }

  console.log(`Seeded ${equipmentTypes.length} equipment types`)

  console.log('Seeding help content...')

  const faqCount = await prisma.helpFaq.count()
  if (faqCount === 0) {
    await prisma.helpFaq.createMany({ data: helpFaq })
    console.log(`Seeded ${helpFaq.length} FAQ items`)
  } else {
    console.log('FAQ already seeded, skipping')
  }

  const contactCount = await prisma.helpContact.count()
  if (contactCount === 0) {
    await prisma.helpContact.createMany({ data: helpContacts })
    console.log(`Seeded ${helpContacts.length} contacts`)
  } else {
    console.log('Contacts already seeded, skipping')
  }

  console.log('Seeding users...')

  const userCount = await prisma.user.count()
  if (userCount > 0) {
    console.log('Users already seeded, skipping')
    return
  }

  const users = await Promise.all(
    seedUsers.map(u =>
      prisma.user.upsert({
        where: { telegramId: u.telegramId },
        update: {},
        create: u,
      })
    )
  )
  console.log(`Seeded ${users.length} users`)

  // Fetch equipment type IDs by name for use in requests
  const eqTypes = await prisma.equipmentType.findMany({ select: { id: true, name: true } })
  const eq = (name: string) => eqTypes.find(e => e.name.includes(name))!.id

  console.log('Seeding requests...')

  const now = new Date()
  const d = (days: number) => new Date(now.getTime() + days * 86400_000)

  await prisma.request.createMany({
    data: [
      // PUBLISHED — appear on public feed
      { type: 'RENTAL', paymentType: 'CASH', status: 'PUBLISHED', userId: users[0].id, contactPhone: '+7 (916) 123-45-67', contactTelegram: '@ivan_petrov', createdAt: d(-5) },
      { type: 'RENTAL', paymentType: 'NON_CASH', status: 'PUBLISHED', userId: users[1].id, contactPhone: '+7 (926) 234-56-78', createdAt: d(-4) },
      { type: 'TRANSPORTATION', paymentType: 'CASH', status: 'PUBLISHED', userId: users[2].id, contactPhone: '+7 (936) 345-67-89', contactWhatsapp: '+79363456789', createdAt: d(-3) },
      { type: 'TRANSPORTATION', paymentType: 'NON_CASH', status: 'PUBLISHED', userId: users[3].id, contactPhone: '+7 (946) 456-78-90', createdAt: d(-2) },
      { type: 'DELIVERY', paymentType: 'CASH', status: 'PUBLISHED', userId: users[4].id, contactPhone: '+7 (956) 567-89-01', createdAt: d(-1) },
      { type: 'DELIVERY', paymentType: 'NON_CASH', status: 'PUBLISHED', userId: users[0].id, contactPhone: '+7 (916) 111-22-33', createdAt: d(-6) },
      { type: 'RENTAL', paymentType: 'CASH', status: 'PUBLISHED', userId: users[1].id, contactPhone: '+7 (926) 222-33-44', createdAt: d(-7) },
      { type: 'TRANSPORTATION', paymentType: 'CASH', status: 'PUBLISHED', userId: users[2].id, contactPhone: '+7 (936) 333-44-55', createdAt: d(-8) },
      // PENDING — drafts
      { type: 'RENTAL', paymentType: 'CASH', status: 'PENDING', userId: users[0].id, contactPhone: '+7 (916) 999-88-77', createdAt: d(-1) },
      { type: 'DELIVERY', paymentType: 'NON_CASH', status: 'PENDING', userId: users[3].id, contactPhone: '+7 (946) 777-66-55', createdAt: d(-2) },
      // DONE
      { type: 'RENTAL', paymentType: 'CASH', status: 'DONE', userId: users[1].id, contactPhone: '+7 (926) 444-55-66', createdAt: d(-20) },
      { type: 'TRANSPORTATION', paymentType: 'NON_CASH', status: 'DONE', userId: users[2].id, contactPhone: '+7 (936) 555-66-77', createdAt: d(-15) },
      // CANCELLED
      { type: 'DELIVERY', paymentType: 'CASH', status: 'CANCELLED', userId: users[4].id, contactPhone: '+7 (956) 666-77-88', createdAt: d(-10) },
    ],
  })

  // Fetch created requests to add sub-records
  const requests = await prisma.request.findMany({ orderBy: { createdAt: 'asc' } })
  const byIdx = (i: number) => requests[i].id

  // Rentals
  await prisma.rental.createMany({
    data: [
      { requestId: byIdx(0), equipmentTypeId: eq('Экскаватор'), address: 'Москва, ул. Строителей, 15', lat: 55.7558, lng: 37.6173, startsAt: d(3), durationDays: 5 },
      { requestId: byIdx(1), equipmentTypeId: eq('Автокран'), address: 'Санкт-Петербург, пр. Невский, 88', lat: 59.9343, lng: 30.3351, startsAt: d(7), durationDays: 3 },
      { requestId: byIdx(6), equipmentTypeId: eq('Бульдозер'), address: 'Казань, ул. Победы, 42', lat: 55.8304, lng: 49.0661, startsAt: d(10), durationDays: 2 },
      { requestId: byIdx(8), equipmentTypeId: eq('Грейдер'), address: 'Москва, ш. Варшавское, 101', lat: 55.6253, lng: 37.6056, startsAt: d(5), durationDays: 1 },
      { requestId: byIdx(10), equipmentTypeId: eq('Фронтальные'), address: 'Нижний Новгород, ул. Горького, 7', lat: 56.3269, lng: 44.0059, startsAt: d(-10), durationDays: 4 },
    ],
  })

  // Transportations
  await prisma.transportation.createMany({
    data: [
      { requestId: byIdx(2), equipmentTypeId: eq('Самосвал'), cargo: 'Строительный мусор, 20 тонн', fromAddress: 'Москва, ул. Профсоюзная, 5', fromLat: 55.6698, fromLng: 37.5655, toAddress: 'Москва, полигон Саларьево', toLat: 55.6264, toLng: 37.4053, startsAt: d(2), ratePerHour: 3500 },
      { requestId: byIdx(3), equipmentTypeId: eq('Манипулятор'), cargo: 'Металлоконструкции, 5 тонн', fromAddress: 'Подольск, ул. Кирова, 18', fromLat: 55.4309, fromLng: 37.5445, toAddress: 'Москва, ул. Коровинское, 33', toLat: 55.8782, toLng: 37.5601, startsAt: d(4), ratePerHour: 4200 },
      { requestId: byIdx(7), equipmentTypeId: eq('Трал'), cargo: 'Спецтехника, негабаритный груз', fromAddress: 'Екатеринбург, ул. Ленина, 20', fromLat: 56.8389, fromLng: 60.6057, toAddress: 'Тюмень, ул. Республики, 55', toLat: 57.1553, toLng: 65.5619, startsAt: d(14), ratePerHour: 6000 },
      { requestId: byIdx(11), equipmentTypeId: eq('Экскаватор'), cargo: 'Грунт, 30 тонн', fromAddress: 'Краснодар, ул. Красная, 10', fromLat: 45.0355, fromLng: 38.9753, toAddress: 'Краснодар, р-н Прикубанский', toLat: 45.0718, toLng: 39.0232, startsAt: d(-5), ratePerHour: 2800 },
    ],
  })

  // Deliveries
  await prisma.delivery.createMany({
    data: [
      { requestId: byIdx(4), cargo: 'Песок и щебень', toAddress: 'Москва, ул. Садовая, 12', toLat: 55.7522, toLng: 37.6176, startsAt: d(1), volume: '15 м³' },
      { requestId: byIdx(5), cargo: 'Бетон М300', toAddress: 'Люберцы, ул. Котельническая, 7', toLat: 55.6777, toLng: 37.9019, startsAt: d(6), volume: '8 м³' },
      { requestId: byIdx(9), cargo: 'Кирпич, 2000 шт', toAddress: 'Балашиха, мкр. Авиаторов, 15', toLat: 55.8236, toLng: 37.9388, startsAt: d(3), volume: '4 м³' },
      { requestId: byIdx(12), cargo: 'Строительные отходы', toAddress: 'Мытищи, ул. Колонцова, 20', toLat: 55.9105, toLng: 37.7317, startsAt: d(-2), volume: '10 м³' },
    ],
  })

  console.log(`Seeded ${requests.length} requests`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
