export default defineEventHandler(async (event) => {
  const body = await readBody<{ name: string; icon: string }>(event)

  if (!body?.name?.trim() || !body?.icon?.trim()) {
    throw createError({ statusCode: 400, message: 'name and icon are required' })
  }

  return prisma.equipmentType.create({
    data: { name: body.name.trim(), icon: body.icon.trim() },
  })
})
