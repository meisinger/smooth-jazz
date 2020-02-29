import React, { useState, useEffect, useRef } from 'react'
import { View, TextInput } from 'react-native'
import Placeholder from './Placeholder'

export default ({ stream, placeholder, onFocus, ...props }) => {
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
        .setNativeProps({ text: value.data || null })
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

  const input_styles = [input_style]
  let placeholder_text = placeholder
  if (error) {
    if (placeholderActive)
      placeholder_text = `${placeholder} - ${stream.value.errorMessage}`
    input_styles.push({
      borderBottomColor: '#9d0000'
    })
  }


  return (
    <View style={container_style}>
      <Placeholder placeholder={placeholder_text}
        active={placeholderActive}
        error={error}
      />
      <TextInput ref={component} style={input_styles}
        {...props}
        onFocus={focused}
        onBlur={blurred}
        onChangeText={stream.changed}
      />
    </View>
  )
}

const container_style = {
  position: 'relative',
  margin: 10,
  paddingTop: 15,
  backgroundColor: 'transparent'
}

const input_style = {
  padding: 0,
  paddingLeft: 2,
  height: 25,
  fontSize: 16,
  color: '#888',
  borderBottomWidth: 0.5,
  borderBottomColor: '#999'
}
