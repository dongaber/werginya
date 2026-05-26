export const requestInclude = {
  user: { select: { id: true, telegramId: true, firstName: true, lastName: true, username: true } },
  rental: { include: { equipmentType: true } },
  transportation: { include: { equipmentType: true } },
  delivery: true,
} as const
