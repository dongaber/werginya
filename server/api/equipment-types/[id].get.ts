export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))

  if (!id) throw createError({ statusCode: 400, message: 'invalid id' })

  const item = await prisma.equipmentType.findUnique({ where: { id } })

  if (!item) throw createError({ statusCode: 404, message: 'not found' })

  return item
})
