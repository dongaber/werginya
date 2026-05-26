export default defineEventHandler(() => {
  return prisma.equipmentType.findMany({
    orderBy: { name: 'asc' },
  })
})
