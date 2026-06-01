let loadPromise: Promise<any> | null = null

export async function loadYandexMaps(apikey: string): Promise<any | null> {
  if (!apikey) return null

  const win = window as any
  if (win.__ymaps3Loaded) {
    await win.ymaps3.ready
    return win.ymaps3
  }

  if (!loadPromise) {
    loadPromise = new Promise<any>((resolve, reject) => {
      const existing = document.querySelector('script[data-ymaps3]')
      if (existing) {
        const wait = () => win.ymaps3 ? win.ymaps3.ready.then(resolve) : setTimeout(wait, 50)
        wait()
        return
      }
      const script = document.createElement('script')
      script.dataset.ymaps3 = '1'
      script.src = `https://api-maps.yandex.ru/v3/?apikey=${apikey}&lang=ru_RU`
      script.addEventListener('load', () => {
        win.ymaps3.ready.then(() => {
          win.__ymaps3Loaded = true
          resolve(win.ymaps3)
        })
      })
      script.addEventListener('error', reject)
      document.head.appendChild(script)
    })
  }

  return loadPromise
}
