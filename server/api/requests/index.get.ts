export default defineEventHandler(async (event) => {
  const { status, type, userId } = getQuery(event)

  const data = await prisma.request.findMany({
    where: {
      ...(status && { status: String(status) as any }),
      ...(type && { type: String(type) as any }),
      ...(userId && { userId: Number(userId) }),
    },
    include: requestInclude,
    orderBy: { createdAt: 'desc' },
  })

  return serialize(data)
})
