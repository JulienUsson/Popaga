import { useNavigation } from '@react-navigation/native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React from 'react'
import { Anchor, Button, Paragraph, Stack } from 'tamagui'

import { RootStackParamList } from './Main'

type Navigation = NativeStackScreenProps<
  RootStackParamList,
  'headguess.choose-themes'
>['navigation']

export default function Home() {
  const navigation = useNavigation<Navigation>()

  return (
    <Stack flex={1}>
      <Paragraph
        textAlign="center"
        marginTop="$8"
        marginBottom="$4"
        animation="bouncy"
        enterStyle={{ scale: 1.6 }}
        size="$12"
        color="$green9"
        // @ts-ignore
        fontFamily="Caveat"
      >
        Popaga !
      </Paragraph>
      <Stack margin="$2" space="$2" flex={1}>
        <Button size="$6" onPress={() => navigation.push('headguess.choose-themes')}>
          Devine tête
        </Button>
      </Stack>
      <Anchor textAlign="center" size="$1" href="https://github.com/JulienUsson">
        Crée par Julien Usson
      </Anchor>
    </Stack>
  )
}
