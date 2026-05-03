import type { DayLog } from '../metrics/types'

export interface AppSettings {
  installPromptDeferred: boolean
  firstCommitDone: boolean
}

export interface LloDb {
  daily_logs: {
    key: string
    value: DayLog
  }
  app_settings: {
    key: string
    value: unknown
  }
}
