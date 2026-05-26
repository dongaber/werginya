export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)

  if (!id) throw createError({ statusCode: 400, message: 'invalid id' })
  if (!body?.status) throw createError({ statusCode: 400, message: 'status is required' })

  const allowed = ['PENDING', 'PUBLISHED', 'IN_PROGRESS', 'DONE', 'CANCELLED']
  if (!allowed.includes(body.status)) {
    throw createError({ statusCode: 400, message: 'invalid status' })
  }

  const data = await prisma.request.update({
    where: { id },
    data: { status: body.status },
    include: requestInclude,
  })

  return serialize(data)
})
