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
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
