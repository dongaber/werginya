import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../app/generated/prisma/client'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const equipmentTypes = [
  { name: 'Экскаватор', icon: '🦾' },
  { name: 'Бульдозер', icon: '🚜' },
  { name: 'Автокран', icon: '🏗️' },
  { name: 'Башенный кран', icon: '🗼' },
  { name: 'Погрузчик', icon: '🔧' },
  { name: 'Самосвал', icon: '🚛' },
  { name: 'Бетономешалка', icon: '🌀' },
  { name: 'Манипулятор', icon: '🦺' },
  { name: 'Грейдер', icon: '🛣️' },
  { name: 'Каток', icon: '⚙️' },
  { name: 'Ямобур', icon: '🕳️' },
  { name: 'Асфальтоукладчик', icon: '🏚️' },
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
