export default defineEventHandler(async (event) => {
  const { status, type, userId, telegramId } = getQuery(event)

  let resolvedUserId: number | undefined
  if (telegramId) {
    const user = await prisma.user.findUnique({ where: { telegramId: BigInt(String(telegramId)) } })
    if (!user) return []
    resolvedUserId = user.id
  } else if (userId) {
    resolvedUserId = Number(userId)
  }

  const data = await prisma.request.findMany({
    where: {
      ...(status && { status: String(status) as any }),
      ...(type && { type: String(type) as any }),
      ...(resolvedUserId && { userId: resolvedUserId }),
    },
    include: requestInclude,
    orderBy: { createdAt: 'desc' },
  })

  return serialize(data)
})
