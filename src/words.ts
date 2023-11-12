import { useSuspenseQuery } from '@tanstack/react-query'
import { Asset } from 'expo-asset'
import * as FileSystem from 'expo-file-system'
import * as SQLite from 'expo-sqlite'
import { useEffect, useState } from 'react'

const DATABASE_NAME = 'words.db'
const DATABASES_DIRECTORY = FileSystem.documentDirectory + 'SQLite'
const DATABASE_PATH = [DATABASES_DIRECTORY, DATABASE_NAME].join('/')

interface Theme {
  name: string
}

async function loadWords() {
  const databasesDirectory = await FileSystem.getInfoAsync(DATABASES_DIRECTORY)
  if (!databasesDirectory.exists) {
    await FileSystem.makeDirectoryAsync(DATABASES_DIRECTORY)
  }
  await FileSystem.downloadAsync(Asset.fromModule(require('../assets/words.db')).uri, DATABASE_PATH)
}

export function useLoadWords(): boolean {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    loadWords()
    setLoaded(true)
  }, [])

  return loaded
}

export async function getThemes(): Promise<Theme[]> {
  const db = SQLite.openDatabase(DATABASE_NAME)
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `SELECT name FROM sqlite_master WHERE type ='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE 'Android_%'`,
          [],
          (_, { rows: { _array: rows } }) => resolve(rows),
          (_, error) => {
            reject(error)
            return false
          },
        )
      },
      (error) => reject(error),
    )
  })
}

export function useThemes() {
  return useSuspenseQuery({ queryKey: ['themes'], queryFn: () => getThemes() })
}

export async function getWordsByTheme(themes: string[]): Promise<string[]> {
  const db = SQLite.openDatabase(DATABASE_NAME)
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          themes.map((theme) => `SELECT word FROM ${theme}`).join(' union all '),
          [],
          (_, { rows: { _array: rows } }) => resolve(rows.map((row) => row.word)),
          (_, error) => {
            reject(error)
            return false
          },
        )
      },
      (error) => reject(error),
    )
  })
}

export function useWords(themes: string[]) {
  return useSuspenseQuery({
    queryKey: ['themes', ...themes],
    queryFn: () => getWordsByTheme(themes),
  })
}
