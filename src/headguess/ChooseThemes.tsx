import { useNavigation } from '@react-navigation/native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Check as CheckIcon, Square as SquareIcon } from '@tamagui/lucide-icons'
import { upperFirst } from 'lodash'
import React from 'react'
import { useTranslation } from 'react-i18next'
import useSet from 'react-use/lib/useSet'
import { Button, Card, Paragraph, ScrollView, Sheet, Square, Stack, Theme, XStack } from 'tamagui'

import { RootStackParamList } from '../Main'
import Header from '../ui/Header'

import { useThemes } from './db'

type Navigation = NativeStackScreenProps<
  RootStackParamList,
  'headguess.choose-themes'
>['navigation']

export default function ChooseThemes() {
  const { t } = useTranslation()
  const themes = useThemes()
  const [selectedThemes, { toggle: toggleTheme }] = useSet<string>()
  const navigation = useNavigation<Navigation>()

  function handlePlayPress() {
    navigation.push('headguess.game', { themes: [...selectedThemes] })
  }

  return (
    <Stack flex={1}>
      <Header title={t('Select themes')} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Stack margin="$2" paddingBottom={80} space="$2">
          {themes.map(({ name, count }) => (
            <ThemeSelect
              key={name}
              value={name}
              isSelected={(value) => selectedThemes.has(value)}
              onSelect={toggleTheme}
              count={count}
            />
          ))}
        </Stack>
      </ScrollView>

      <Theme name="dark">
        <Sheet open={selectedThemes.size > 0} snapPoints={[10]} disableDrag animation="bouncy">
          <Sheet.Frame
            padding="$3"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            backgroundColor="$green9"
          >
            <Paragraph fontSize="$6">
              {t('{{count}} Theme(s) selected', { count: selectedThemes.size })}
            </Paragraph>
            <Button
              fontWeight="700"
              backgroundColor="$yellow9"
              pressStyle={{ backgroundColor: '$yellow10' }}
              onPress={handlePlayPress}
            >
              {t('PLAY')}
            </Button>
          </Sheet.Frame>
        </Sheet>
      </Theme>
    </Stack>
  )
}

interface ThemeSelectProps {
  value: string
  count: number
  isSelected: (theme: string) => boolean
  onSelect: (theme: string) => void
}

function ThemeSelect({ value, count, isSelected, onSelect }: ThemeSelectProps) {
  const { t } = useTranslation()

  return (
    <Card
      padding="$3"
      animation="bouncy"
      bordered
      pressStyle={{ scale: 0.95 }}
      onPress={() => onSelect(value)}
    >
      <XStack space="$4" alignItems="center">
        <Square position="relative" size="$1">
          <Stack position="absolute">
            <SquareIcon />
          </Stack>
          {isSelected(value) && (
            <Stack position="absolute" scale={0.8}>
              <CheckIcon />
            </Stack>
          )}
        </Square>
        <Stack>
          <Paragraph size="$8">{upperFirst(value)}</Paragraph>
          <Paragraph size="$4">{t('{{count}} words', { count })}</Paragraph>
        </Stack>
      </XStack>
    </Card>
  )
}
