import type { Prisma } from '../../app/generated/prisma'
import { prisma } from '../utils/prisma'

type RequestWithDetails = Prisma.RequestGetPayload<{
  include: { rental: true; transportation: true; delivery: true }
}>

type UserFilter = {
  telegramId: bigint
  filterGeoLat: Prisma.Decimal | null
  filterGeoLng: Prisma.Decimal | null
  filterGeoRadiusKm: number | null
  filterEquipIds: number[]
}

interface RequestGeo {
  lat: number | null
  lng: number | null
  equipTypeId: number | null
}

export default defineTask({
  meta: {
    name: 'notify-new-request',
    description: 'Notify users whose filters match a newly created request',
  },

  async run({ payload }) {
    const { requestId, dryRun } = payload as { requestId: number; dryRun?: boolean }

    const botToken = process.env.BOT_TOKEN
    if (!botToken && !dryRun) return { result: 'skipped: no BOT_TOKEN' }

    const request = await prisma.request.findUnique({
      where: { id: requestId },
      include: { rental: true, transportation: true, delivery: true },
    })
    if (!request) return { result: 'request not found' }

    const creator = await prisma.user.findUnique({
      where: { id: request.userId },
      select: { telegramId: true },
    })

    const geo = extractGeo(request)
    const candidates = await loadCandidates(creator?.telegramId ?? BigInt(0))
    const toNotify = candidates.filter(u => matchesFilters(u, geo))

    if (toNotify.length === 0) return { result: 'no matching users' }
    if (dryRun) {
      return {
        result: `dry-run: would notify ${toNotify.length} users`,
        users: toNotify.map(u => u.telegramId.toString()),
      }
    }

    const sent = await sendAll(toNotify, buildMessage(request), botToken!)
    return { result: `notified ${sent}/${toNotify.length} users` }
  },
})

// --- helpers ---

function extractGeo(request: RequestWithDetails): RequestGeo {
  if (request.rental) return {
    lat: request.rental.lat != null ? Number(request.rental.lat) : null,
    lng: request.rental.lng != null ? Number(request.rental.lng) : null,
    equipTypeId: request.rental.equipmentTypeId,
  }
  if (request.transportation) return {
    lat: request.transportation.toLat != null ? Number(request.transportation.toLat) : null,
    lng: request.transportation.toLng != null ? Number(request.transportation.toLng) : null,
    equipTypeId: request.transportation.equipmentTypeId,
  }
  if (request.delivery) return {
    lat: request.delivery.toLat != null ? Number(request.delivery.toLat) : null,
    lng: request.delivery.toLng != null ? Number(request.delivery.toLng) : null,
    equipTypeId: null,
  }
  return { lat: null, lng: null, equipTypeId: null }
}

async function loadCandidates(excludeTelegramId: bigint): Promise<UserFilter[]> {
  return prisma.user.findMany({
    where: {
      telegramId: { not: excludeTelegramId },
      OR: [
        { filterGeoRadiusKm: { not: null } },
        { filterEquipIds: { isEmpty: false } },
      ],
    },
    select: {
      telegramId: true,
      filterGeoLat: true,
      filterGeoLng: true,
      filterGeoRadiusKm: true,
      filterEquipIds: true,
    },
  })
}

function matchesFilters(user: UserFilter, geo: RequestGeo): boolean {
  const { filterGeoLat, filterGeoLng, filterGeoRadiusKm, filterEquipIds } = user

  if (filterGeoLat != null && filterGeoLng != null && filterGeoRadiusKm != null) {
    if (geo.lat == null || geo.lng == null) return false
    const dist = haversineKm(Number(filterGeoLat), Number(filterGeoLng), geo.lat, geo.lng)
    if (dist > filterGeoRadiusKm) return false
  }

  if (filterEquipIds.length > 0) {
    if (geo.equipTypeId == null || !filterEquipIds.includes(geo.equipTypeId)) return false
  }

  return true
}

async function sendAll(users: UserFilter[], text: string, botToken: string): Promise<number> {
  const appUrl = process.env.TELEGRAM_APP_URL
  const replyMarkup = appUrl
    ? { inline_keyboard: [[{ text: '📋 Открыть заявку', web_app: { url: appUrl } }]] }
    : undefined

  let sent = 0
  for (let i = 0; i < users.length; i++) {
    try {
      await $fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        body: {
          chat_id: users[i]!.telegramId.toString(),
          text,
          parse_mode: 'HTML',
          ...(replyMarkup && { reply_markup: replyMarkup }),
        },
      })
      sent++
    } catch {
      // continue on individual failure
    }
    // Telegram: 30 msg/sec global limit — pause every 25 attempts
    if ((i + 1) % 25 === 0) await new Promise(r => setTimeout(r, 1000))
  }
  return sent
}

const TYPE_LABEL: Record<string, string> = {
  RENTAL: 'Аренда техники',
  TRANSPORTATION: 'Перевозка',
  DELIVERY: 'Доставка груза',
}

function buildMessage(request: RequestWithDetails): string {
  const type = TYPE_LABEL[request.type] ?? request.type
  const address = request.rental?.address
    ?? request.transportation?.toAddress
    ?? request.delivery?.toAddress
    ?? ''
  const payment = request.paymentType === 'CASH' ? 'Наличные' : 'Безнал'

  return [
    `🔔 <b>Новая заявка: ${type}</b>`,
    address && `📍 ${address}`,
    `💳 ${payment}`,
  ].filter(Boolean).join('\n')
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}
