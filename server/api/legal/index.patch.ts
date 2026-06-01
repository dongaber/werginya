export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const body = await readBody(event)
  const data: { termsUrl?: string; privacyUrl?: string } = {}
  if (typeof body?.termsUrl === 'string') data.termsUrl = body.termsUrl
  if (typeof body?.privacyUrl === 'string') data.privacyUrl = body.privacyUrl

  const settings = await prisma.appSettings.upsert({
    where: { id: 1 },
    update: data,
    create: { id: 1, termsUrl: data.termsUrl ?? '', privacyUrl: data.privacyUrl ?? '' },
  })

  return { termsUrl: settings.termsUrl, privacyUrl: settings.privacyUrl }
})
