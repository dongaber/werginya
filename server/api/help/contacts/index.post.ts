export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const body = await readBody<{ label: string; type: string; value: string; url: string; order?: number }>(event)
  if (!body?.label?.trim() || !body?.type?.trim() || !body?.value?.trim() || !body?.url?.trim()) {
    throw createError({ statusCode: 400, message: 'label, type, value and url are required' })
  }
  return prisma.helpContact.create({
    data: {
      label: body.label.trim(),
      type: body.type.trim(),
      value: body.value.trim(),
      url: body.url.trim(),
      order: body.order ?? 0,
    },
  })
})
