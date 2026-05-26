import type { H3Event } from 'h3'
import { prisma } from './prisma'

export async function requireAdmin(event: H3Event): Promise<void> {
  const telegramId = getHeader(event, 'x-telegram-id')
  if (!telegramId) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const user = await prisma.user.findUnique({
    where: { telegramId: BigInt(telegramId) },
    select: { isAdmin: true },
  })

  if (!user?.isAdmin) {
    throw createError({ statusCode: 403, message: 'Forbidden' })
  }
}
