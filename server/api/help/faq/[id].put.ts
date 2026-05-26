export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, message: 'invalid id' })
  const body = await readBody<{ question?: string; answer?: string; order?: number }>(event)
  return prisma.helpFaq.update({
    where: { id },
    data: {
      ...(body.question?.trim() && { question: body.question.trim() }),
      ...(body.answer?.trim() && { answer: body.answer.trim() }),
      ...(body.order !== undefined && { order: body.order }),
    },
  })
})
