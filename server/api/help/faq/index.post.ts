export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const body = await readBody<{ question: string; answer: string; order?: number }>(event)
  if (!body?.question?.trim() || !body?.answer?.trim()) {
    throw createError({ statusCode: 400, message: 'question and answer are required' })
  }
  return prisma.helpFaq.create({
    data: { question: body.question.trim(), answer: body.answer.trim(), order: body.order ?? 0 },
  })
})
