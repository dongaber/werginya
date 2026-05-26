export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody<{ name?: string; icon?: string }>(event)

  if (!id) throw createError({ statusCode: 400, message: 'invalid id' })
  if (!body?.name?.trim() && !body?.icon?.trim()) {
    throw createError({ statusCode: 400, message: 'name or icon required' })
  }

  return prisma.equipmentType.update({
    where: { id },
    data: {
      ...(body.name?.trim() && { name: body.name.trim() }),
      ...(body.icon?.trim() && { icon: body.icon.trim() }),
    },
  })
})
