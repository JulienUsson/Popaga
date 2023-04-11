import { shuffle } from 'lodash'
import { useEffect, useState } from 'react'

import { openDatabase } from '../db'

interface Theme {
  name: string
  count: number
}

export async function getThemes(): Promise<Theme[]> {
  const db = await openDatabase()
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `SELECT theme AS name, COUNT(1) AS count FROM headguess GROUP BY theme;`,
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

export function useThemes(): Theme[] {
  const [themes, setThemes] = useState<Theme[]>([])
  useEffect(() => {
    async function init() {
      setThemes(await getThemes())
    }
    init()
  }, [])
  return themes
}

export async function getWordsWithTheme(themes: string[]): Promise<string[]> {
  const db = await openDatabase()
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          // TODO find a solution for avoiding security issue
          `SELECT value FROM headguess WHERE theme IN (${themes.map((t) => `"${t}"`).join(',')});`,
          [],
          (_, { rows: { _array: rows } }) => resolve(rows.map((row) => row.value)),
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

export function useWords(themes: string[]): string[] {
  const [words, setWords] = useState<string[]>([])
  useEffect(() => {
    async function init() {
      setWords(shuffle(await getWordsWithTheme(themes)))
    }
    init()
  }, [themes])
  return words
}
