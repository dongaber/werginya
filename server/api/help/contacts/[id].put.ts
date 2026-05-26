export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, message: 'invalid id' })
  const body = await readBody<{ label?: string; type?: string; value?: string; url?: string; order?: number }>(event)
  return prisma.helpContact.update({
    where: { id },
    data: {
      ...(body.label?.trim() && { label: body.label.trim() }),
      ...(body.type?.trim() && { type: body.type.trim() }),
      ...(body.value?.trim() && { value: body.value.trim() }),
      ...(body.url?.trim() && { url: body.url.trim() }),
      ...(body.order !== undefined && { order: body.order }),
    },
  })
})
