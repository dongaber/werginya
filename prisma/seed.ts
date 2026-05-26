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
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
