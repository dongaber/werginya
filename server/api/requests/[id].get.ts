export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))

  if (!id) throw createError({ statusCode: 400, message: 'invalid id' })

  const request = await prisma.request.findUnique({
    where: { id },
    include: requestInclude,
  })

  if (!request) throw createError({ statusCode: 404, message: 'not found' })

  return serialize(request)
})
