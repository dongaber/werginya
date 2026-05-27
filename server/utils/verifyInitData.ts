import { createHmac } from 'node:crypto'

const MAX_AGE_SECONDS = 86400 // 24h

export function verifyInitData(initData: string, botToken: string): string | null {
  if (!initData) return null

  const params = new URLSearchParams(initData)
  const hash = params.get('hash')
  if (!hash) return null

  const authDate = Number(params.get('auth_date'))
  if (!authDate || Date.now() / 1000 - authDate > MAX_AGE_SECONDS) return null

  params.delete('hash')

  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('\n')

  const secretKey = createHmac('sha256', 'WebAppData').update(botToken).digest()
  const expectedHash = createHmac('sha256', secretKey).update(dataCheckString).digest('hex')

  if (expectedHash !== hash) return null

  try {
    const user = JSON.parse(params.get('user') ?? '{}')
    return user.id ? String(user.id) : null
  } catch {
    return null
  }
}
