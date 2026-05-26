export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)

  if (!id) throw createError({ statusCode: 400, message: 'invalid id' })

  const { status, paymentType, rental, transportation, delivery } = body

  const data = await prisma.request.update({
    where: { id },
    data: {
      ...(status && { status }),
      ...(paymentType && { paymentType }),
      ...(rental && {
        rental: {
          update: {
            ...(rental.equipmentTypeId && { equipmentTypeId: rental.equipmentTypeId }),
            ...(rental.address && { address: rental.address }),
            ...(rental.lat !== undefined && { lat: rental.lat }),
            ...(rental.lng !== undefined && { lng: rental.lng }),
            ...(rental.startsAt && { startsAt: new Date(rental.startsAt) }),
            ...(rental.durationDays && { durationDays: rental.durationDays }),
          },
        },
      }),
      ...(transportation && {
        transportation: {
          update: {
            ...(transportation.equipmentTypeId && { equipmentTypeId: transportation.equipmentTypeId }),
            ...(transportation.cargo && { cargo: transportation.cargo }),
            ...(transportation.fromAddress && { fromAddress: transportation.fromAddress }),
            ...(transportation.fromLat !== undefined && { fromLat: transportation.fromLat }),
            ...(transportation.fromLng !== undefined && { fromLng: transportation.fromLng }),
            ...(transportation.toAddress && { toAddress: transportation.toAddress }),
            ...(transportation.toLat !== undefined && { toLat: transportation.toLat }),
            ...(transportation.toLng !== undefined && { toLng: transportation.toLng }),
            ...(transportation.startsAt && { startsAt: new Date(transportation.startsAt) }),
            ...(transportation.ratePerHour && { ratePerHour: transportation.ratePerHour }),
          },
        },
      }),
      ...(delivery && {
        delivery: {
          update: {
            ...(delivery.cargo && { cargo: delivery.cargo }),
            ...(delivery.toAddress && { toAddress: delivery.toAddress }),
            ...(delivery.toLat !== undefined && { toLat: delivery.toLat }),
            ...(delivery.toLng !== undefined && { toLng: delivery.toLng }),
            ...(delivery.startsAt && { startsAt: new Date(delivery.startsAt) }),
            ...(delivery.volume && { volume: delivery.volume }),
          },
        },
      }),
    },
    include: requestInclude,
  })

  return serialize(data)
})
