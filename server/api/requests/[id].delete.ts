export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))

  if (!id) throw createError({ statusCode: 400, message: 'invalid id' })

  await requireOwnerOrAdmin(event, id)

  await prisma.request.delete({ where: { id } })

  return { success: true }
})
