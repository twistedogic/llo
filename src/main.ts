import { mount } from 'svelte'
import './app.css'
import App from './App.svelte'
import { getSetting, setSetting } from './lib/db/index'

let deferredInstallPrompt: Event | null = null

window.addEventListener('beforeinstallprompt', async (e) => {
  e.preventDefault()
  deferredInstallPrompt = e

  const firstCommitDone = await getSetting<boolean>('firstCommitDone')
  if (firstCommitDone) {
    showInstallPrompt()
  }
})

export function showInstallPrompt() {
  if (deferredInstallPrompt) {
    (deferredInstallPrompt as any).prompt()
    deferredInstallPrompt = null
  }
}

export async function markFirstCommit() {
  await setSetting('firstCommitDone', true)
  showInstallPrompt()
}

const app = mount(App, {
  target: document.getElementById('app')!,
})

export default app
