import { openDB, type IDBPDatabase } from 'idb'
import type { LloDb } from './schema'
import type { DayLog } from '../metrics/types'

const DB_NAME = 'llo'
const DB_VERSION = 1

let dbPromise: Promise<IDBPDatabase<LloDb>> | null = null

export function openDb(): Promise<IDBPDatabase<LloDb>> {
  if (!dbPromise) {
    dbPromise = openDB<LloDb>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('daily_logs')) {
          db.createObjectStore('daily_logs', { keyPath: 'date' })
        }
        if (!db.objectStoreNames.contains('app_settings')) {
          db.createObjectStore('app_settings')
        }
      },
    })
  }
  return dbPromise
}

export function todayDate(): string {
  return new Date().toISOString().slice(0, 10)
}

export async function getDayLog(date: string): Promise<DayLog | null> {
  const db = await openDb()
  return (await db.get('daily_logs', date)) ?? null
}

export async function saveDayLog(date: string, log: DayLog): Promise<void> {
  const existing = await getDayLog(date)
  if (existing?.committed) {
    throw new Error(`Day ${date} is already committed and cannot be modified.`)
  }
  const db = await openDb()
  await db.put('daily_logs', { ...log, date })
}

export async function commitDay(date: string, log: DayLog): Promise<DayLog> {
  const existing = await getDayLog(date)
  if (existing?.committed) {
    throw new Error(`Day ${date} is already committed.`)
  }
  const committed: DayLog = {
    ...log,
    date,
    committed: true,
    committedAt: new Date().toISOString(),
  }
  const db = await openDb()
  await db.put('daily_logs', committed)
  return committed
}

export async function getLogsInRange(startDate: string, endDate: string): Promise<DayLog[]> {
  const db = await openDb()
  const all = await db.getAll('daily_logs')
  return all
    .filter(l => l.date >= startDate && l.date <= endDate)
    .sort((a, b) => a.date.localeCompare(b.date))
}

export async function getAllCommittedLogs(): Promise<DayLog[]> {
  const db = await openDb()
  const all = await db.getAll('daily_logs')
  return all.filter(l => l.committed).sort((a, b) => a.date.localeCompare(b.date))
}

export async function isTodayCommitted(): Promise<boolean> {
  const log = await getDayLog(todayDate())
  return log?.committed === true
}

export async function getSetting<T>(key: string): Promise<T | undefined> {
  const db = await openDb()
  return (await db.get('app_settings', key)) as T | undefined
}

export async function setSetting(key: string, value: unknown): Promise<void> {
  const db = await openDb()
  await db.put('app_settings', value, key)
}
