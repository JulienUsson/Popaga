import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useMachine } from '@xstate/react'
import * as ScreenOrientation from 'expo-screen-orientation'
import { Accelerometer, AccelerometerMeasurement } from 'expo-sensors'
import { StatusBar } from 'expo-status-bar'
import { padStart } from 'lodash'
import React, { useEffect, useRef } from 'react'
import { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, H1, H3, Paragraph, Stack, Theme, XStack } from 'tamagui'
import { createMachine, assign } from 'xstate'

import { RootStackParamList } from '../Main'

import { useWords } from './db'

type Route = RouteProp<RootStackParamList, 'headguess.game'>
type Navigation = NativeStackScreenProps<RootStackParamList, 'headguess.game'>['navigation']

export default function Game() {
  useLandscapeOrientation()
  const route = useRoute<Route>()
  const { themes } = route.params
  const words = useWords(themes)
  const [current, send] = useMachine(gameMachine)

  useMovement((event) => {
    send(event)
  })

  switch (current.value) {
    case 'start':
      return <Start />
    case 'running':
      return (
        <Running
          remainingTime={current.context.duration - current.context.elapsed}
          score={current.context.score}
          word={words[current.context.currentWordIndex % words.length]}
        />
      )
    case 'done':
      return <Done score={current.context.score} passed={current.context.passed} />
    default:
      throw new Error('Unknown state')
  }
}

function Layout({ children }: ReactElement['props']) {
  return (
    <Theme name="dark">
      <StatusBar style="light" />
      <Stack backgroundColor="$green10" flex={1} alignItems="center" justifyContent="center">
        {children}
      </Stack>
    </Theme>
  )
}

function Start() {
  const { t } = useTranslation()
  return (
    <Layout>
      <H3>{t('Put your screen down to start the game')}</H3>
    </Layout>
  )
}

interface RunningProps {
  remainingTime: number
  score: number
  word: string
}

function Running({ remainingTime, score, word }: RunningProps) {
  const { t } = useTranslation()
  const remainingMinutes = Math.trunc(remainingTime / 60)
  const remainingSeconds = padStart(Math.trunc(remainingTime % 60).toString(), 2, '0')
  return (
    <Layout>
      <H3 position="absolute" top={0} marginTop="$2">
        {remainingMinutes}:{remainingSeconds}
      </H3>
      <H1>{word}</H1>
      <H3 position="absolute" bottom={0} marginBottom="$2">
        {t('SCORE: {{score}}', { score })}
      </H3>
    </Layout>
  )
}

interface DoneProps {
  score: number
  passed: number
}

function Done({ score, passed }: DoneProps) {
  const { t } = useTranslation()
  const navigation = useNavigation<Navigation>()
  return (
    <Layout>
      <H3>{t('You score {{score}} !', { score })}</H3>
      {passed ? (
        <Paragraph marginBottom="$4">{t('You passed {{passed}} words...', { passed })}</Paragraph>
      ) : (
        <Paragraph marginBottom="$4">{t('Congratulations, you passed no words !')}</Paragraph>
      )}
      <XStack space="$4">
        <Button
          onPress={() => navigation.pop()}
          backgroundColor="$yellow9"
          pressStyle={{ backgroundColor: '$yellow10' }}
        >
          {t('Try again ?')}
        </Button>
        <Button
          onPress={() => navigation.navigate('home')}
          backgroundColor="$yellow9"
          pressStyle={{ backgroundColor: '$yellow10' }}
        >
          {t('Return home')}
        </Button>
      </XStack>
    </Layout>
  )
}

interface GameContext {
  currentWordIndex: number
  score: number
  passed: number
  elapsed: number
  duration: number
  interval: number
}

type GameEvent = { type: 'TICK' } | { type: MovementEvent } | { type: 'RESTART' }

const gameMachine = createMachine<GameContext, GameEvent>({
  predictableActionArguments: true,
  initial: 'start',
  context: {
    currentWordIndex: 0,
    score: 0,
    passed: 0,
    elapsed: 0,
    duration: 90,
    interval: 0.1,
  },
  states: {
    start: {
      on: {
        SCREEN_DOWN: 'running',
      },
    },
    running: {
      invoke: {
        src: (context) => (cb) => {
          const interval = setInterval(() => {
            cb('TICK')
          }, 1000 * context.interval)

          return () => {
            clearInterval(interval)
          }
        },
      },
      always: [
        {
          target: 'done',
          cond: (context) => {
            return context.elapsed >= context.duration
          },
        },
      ],
      on: {
        SCREEN_DOWN: {
          actions: assign({
            currentWordIndex: (context) => context.currentWordIndex + 1,
            score: (context) => context.score + 1,
          }),
        },
        SCREEN_UP: {
          actions: assign({
            currentWordIndex: (context) => context.currentWordIndex + 1,
            passed: (context) => context.passed + 1,
          }),
        },
        TICK: {
          actions: assign({
            elapsed: (context) => +(context.elapsed + context.interval).toFixed(2),
          }),
        },
      },
    },
    done: {
      on: {
        RESTART: {
          actions: assign({
            score: 0,
            elapsed: 0,
            passed: 0,
            currentWordIndex: (context) => context.currentWordIndex + 1,
          }),
          target: 'start',
        },
      },
    },
  },
})

function useLandscapeOrientation() {
  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE)
    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT)
    }
  }, [])
}

type MovementEvent = 'SCREEN_DOWN' | 'SCREEN_UP' | 'SCREEN_VISIBLE'
type MovementCallback = (event: MovementEvent) => void

function useMovement(callback: MovementCallback) {
  const lastEventRef = useRef<MovementEvent>()
  const callbackRef = useRef<MovementCallback>(() => {})
  useEffect(() => {
    callbackRef.current = callback
  })

  useEffect(() => {
    function onChange({ z }: AccelerometerMeasurement) {
      if (0.8 < z) {
        if (lastEventRef.current !== 'SCREEN_UP') {
          lastEventRef.current = 'SCREEN_UP'
          callbackRef.current('SCREEN_UP')
        }
      } else if (z < -0.8) {
        if (lastEventRef.current !== 'SCREEN_DOWN') {
          lastEventRef.current = 'SCREEN_DOWN'
          callbackRef.current('SCREEN_DOWN')
        }
      } else {
        lastEventRef.current = 'SCREEN_VISIBLE'
      }
    }

    Accelerometer.setUpdateInterval(200)
    const subscription = Accelerometer.addListener(onChange)
    return () => {
      subscription.remove()
    }
  }, [])
}
