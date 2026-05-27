import type { H3Event } from 'h3'

export async function requireOwnerOrAdmin(event: H3Event, requestId: number): Promise<void> {
  const telegramId = event.context.telegramId
  if (!telegramId) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const user = await prisma.user.findUnique({
    where: { telegramId: BigInt(telegramId) },
    select: { id: true, isAdmin: true },
  })
  if (!user) throw createError({ statusCode: 401, message: 'Unauthorized' })

  if (user.isAdmin) return

  const request = await prisma.request.findUnique({
    where: { id: requestId },
    select: { userId: true },
  })
  if (!request || request.userId !== user.id) {
    throw createError({ statusCode: 403, message: 'Forbidden' })
  }
}
