export default defineEventHandler(async () => {
  const settings = await prisma.appSettings.findUnique({ where: { id: 1 } })
  return { termsUrl: settings?.termsUrl ?? '', privacyUrl: settings?.privacyUrl ?? '' }
})
