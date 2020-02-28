import React, { useState, useEffect, useRef } from 'react'
import { View, TextInput } from 'react-native'
import Placeholder from './Placeholder'

export default (props) => {
  const { stream, onFocus, placeholder, ...passThrough } = props
  const [error, setError] = useState(false)
  const [active, setActive] = useState(false)
  const [placeholderActive, setPlaceholderActive] = useState(false)
  const component = useRef()

  useEffect(() => {
    const stream$ = stream.subscribe(value => {
      if (value.data && !active && !placeholderActive)
        setPlaceholderActive(true)
      if (!value.data && !active)
        setPlaceholderActive(false)

      setError(!!value.error)
      component.current
        .setNativeProps({ text: value.data })
    })

    return () => stream$.unsubscribe()
  }, [])

  const blurred = () => {
    const { data } = stream.value
    setActive(false)
    setPlaceholderActive(!!data)
  }

  const focused = () => {
    if (onFocus)
      onFocus()
    else {
      setActive(true)
      setPlaceholderActive(true)
    }
  }

  const focus = () =>
    component.current.focus()

  let placeholder_text = placeholder
  if (error) {
    if (placeholderActive)
      placeholder_text = `${placeholder} - ${stream.value.error}`
  }

  return (
    <View>
      <Placeholder placeholder={placeholder_text}
        active={placeholderActive}
        error={error}
      />
      <TextInput ref={component}
        {...passThrough}
        onFocus={focused}
        onBlur={blurred}
        onChangeText={stream.changed}
      />
    </View>
  )
}
