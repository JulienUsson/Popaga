import { useNavigation } from '@react-navigation/native'
import { ArrowLeft } from '@tamagui/lucide-icons'
import React from 'react'
import { Circle, Paragraph, XStack } from 'tamagui'

interface Props {
  title: string
  canGoBack?: boolean
}

export default function Header({ title, canGoBack: canGoBackProp }: Props) {
  const canGoBack = canGoBackProp ?? true
  const navigation = useNavigation()

  return (
    <XStack margin="$2" marginTop="$8" space="$2" alignItems="center">
      {canGoBack && (
        <Circle animation="bouncy" pressStyle={{ scale: 2 }} onPress={() => navigation.goBack()}>
          <ArrowLeft size={32} />
        </Circle>
      )}
      <Paragraph size="$8">{title}</Paragraph>
    </XStack>
  )
}
