export default defineEventHandler(async () => {
  const [faq, contacts] = await Promise.all([
    prisma.helpFaq.findMany({ orderBy: { order: 'asc' } }),
    prisma.helpContact.findMany({ orderBy: { order: 'asc' } }),
  ])
  return { faq, contacts }
})
