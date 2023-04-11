import { Asset } from 'expo-asset'
import * as FileSystem from 'expo-file-system'
import * as SQLite from 'expo-sqlite'
import { useEffect, useState } from 'react'

export function useLoadDatabase(): boolean {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    async function loadDatabase() {
      if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite')).exists) {
        await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite')
      }
      await FileSystem.downloadAsync(
        Asset.fromModule(require('../assets/database.db')).uri,
        FileSystem.documentDirectory + 'SQLite/database.db',
      )
      setLoaded(true)
    }
    loadDatabase()
  }, [])

  return loaded
}

export async function openDatabase(): Promise<SQLite.WebSQLDatabase> {
  return SQLite.openDatabase('database.db')
}
