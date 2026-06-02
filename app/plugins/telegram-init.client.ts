import { retrieveLaunchParams } from '@tma.js/sdk'
import { initTMA } from '~/utils/tma-init'

export default defineNuxtPlugin(() => {
  const tmaError = useState('tmaError', () => false)

  let launchParams
  try {
    launchParams = retrieveLaunchParams()
  } catch {
    tmaError.value = true
    return
  }

  const debug = launchParams.tgWebAppStartParam === 'debug' || import.meta.dev

  try {
    initTMA({
      eruda: debug,
      mockForMacOS: launchParams.tgWebAppPlatform === 'macos',
    })
  } catch (e) {
    console.error('[TMA] Init failed:', e)
    tmaError.value = true
  }
})
