import 'date-fns/locale/fr'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { TamaguiProvider, Theme } from 'tamagui'
 
import Main from './src/Main'
import config from './tamagui.config'

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#fff',
    primary: '#eab308',
    card: '#fff',
    text: '#eab308',
  },
}

export default function App() {
  const [fontLoaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
    Caveat: require("@expo-google-fonts/caveat/Caveat_400Regular.ttf"),
  }) 

  if (!fontLoaded) {
    return null
  }

  return (
    <TamaguiProvider config={config}>
      <Theme name="light_green">
        <GestureHandlerRootView style={{ flex: 1 }}>
          <NavigationContainer theme={navigationTheme}>
            <StatusBar translucent />
            <Main />
          </NavigationContainer>
        </GestureHandlerRootView>
      </Theme>
    </TamaguiProvider>
  )
}
