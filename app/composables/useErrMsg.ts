export function errMsg(err: unknown): string {
  const e = err as any
  return e?.data?.message || e?.message || 'Неизвестная ошибка'
}
