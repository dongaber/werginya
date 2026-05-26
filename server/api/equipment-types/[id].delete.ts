export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))

  if (!id) throw createError({ statusCode: 400, message: 'invalid id' })

  await prisma.equipmentType.delete({ where: { id } })

  return { success: true }
})
