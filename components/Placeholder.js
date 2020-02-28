import React, { useState, useEffect, useRef } from 'react'
import { Animated } from 'react-native'

export default (props) => {
  const {
    error,
    active,
    placeholder,
    placeholderTint = '#bdbdbd',
    placeholderActiveTint = '#4d4d4d',
    placeholderErrorTint = '#9d0000'
  } = props

  const [prevActive, setPrevActive] = useState(false)
  const [prevError, setPrevError] = useState(false)
  const animatedTop = new Animated.Value(10)
  const animatedSize = new Animated.Value(16)
  const animatedColor = new Animated.Value(0)
  const refTop = useRef(animatedTop)
  const refSize = useRef(animatedSize)
  const refColor = useRef(animatedColor)

  const color = refColor.current.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [
      placeholderTint,
      placeholderActiveTint,
      placeholderErrorTint
    ]
  })

  useEffect(() => {
    const animations = []
    if (active !== prevActive) {
      animations.push(
        Animated.timing(refTop.current, {
          toValue: (prevActive) ? 15 : 0,
          duration: 125
        }),
        Animated.timing(refSize.current, {
          toValue: (prevActive) ? 16 : 11,
          duration: 125
        }),
        Animated.timing(refColor.current, {
          toValue: (prevError) ? 2 : (prevActive) ? 1 : 0,
          duration: 125
        })
      )
    } else if (error !== prevError) {
      animations.push(
        Animated.timing(refColor.current, {
          toValue: (error) ? 2 : (prevActive) ? 1 : 0,
          duration: 125
        })
      )
    }

    if (animations.length)
      Animated.parallel(animations).start()

    setPrevActive(active)
    setPrevError(error)
  }, [active, error])

  const text_style = {
    fontSize: refSize.current,
    color: color
  }

  const default_style = {
    position: 'absolute',
    top: refTop.current,
    left: 2,
    height: 25
  }

  return (
    <Animated.View style={default_style} pointerEvents='none'>
      <Animated.Text style={text_style}>
        {placeholder}
      </Animated.Text>
    </Animated.View>
  )
}
