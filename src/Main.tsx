import './i18n'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'

import HeadguessChooseThemes from './headguess/ChooseThemes'
import HeadguessGame from './headguess/Game'
import Home from './Home'

export type RootStackParamList = {
  home: undefined
  'headguess.choose-themes': undefined
  'headguess.game': { themes: string[] }
}

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function Main() {
  return (
    <Stack.Navigator screenOptions={{ header: () => null }}>
      <Stack.Screen name="home" component={Home} />
      <Stack.Screen name="headguess.choose-themes" component={HeadguessChooseThemes} />
      <Stack.Screen name="headguess.game" component={HeadguessGame} />
    </Stack.Navigator>
  )
}
