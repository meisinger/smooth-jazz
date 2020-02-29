import React, { useState, useEffect, useRef } from 'react'
import { useNavigation } from '@react-navigation/native'
import { BehaviorSubject } from 'rxjs'
import { map } from 'rxjs/operators'
import { TouchableWithoutFeedback, TouchableHighlight, View, Text } from 'react-native'

const circle_container_style = {
  alignItems: 'center',
  justifyContent: 'center',
  margin: 5,
  width: 80,
  height: 80,
  borderRadius: 50,
  borderWidth: 0.5,
  borderColor: '#d9d9d9',
}

const circle_text_style = {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#d9d9d9'
}

const indicator_style = {
  margin: 5,
  width: 15,
  height: 15,
  borderRadius: 50,
  borderWidth: 0.5,
  borderColor: '#fefefe'
}

const indicator_active = {
  backgroundColor: '#fefefe'
}

const Pin = ({ number, onPress }) => (
  <TouchableHighlight activeOpacity={0.7} underlayColor={'#fefefe'}
    style={{borderRadius: 50}} onPress={onPress}>
    <View style={circle_container_style}>
      <Text style={circle_text_style}>{number}</Text>
    </View>
  </TouchableHighlight>
)

const Pins = ({ pins, onPress }) => (
  <View style={{flex: 0.7, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-around' }}>
  { pins.map((pin, index) => (
    <Pin key={`pin_${index}`} number={pin} onPress={() => onPress(pin)} />
  ))}
  </View>
)

class PinCodeSubject extends BehaviorSubject {
  constructor(length) {
    super({
      count: 0,
      valid: false
    })

    this._controller = new BehaviorSubject([])
    this._controller
      .pipe(map(x => x.length))
      .subscribe(x => {
        this.next({ count: x, valid: x === length })
      })

    this.length = length
  }

  dispose = () => {
    this._controller.next([])
  }

  changed = (value) => {
    const { value: current } = this
    if (current.valid)
      return

    const { value: data } = this._controller
    this._controller.next([...data, { value: value }])
  }
}

export default () => {
  const navigation = useNavigation()
  const pincode = useRef(new PinCodeSubject(3))
  const [pins, setPins] = useState(0)

  useEffect(() => {
    const stream$ = pincode.current
      .subscribe(data => {
        setPins(data.count)
        if (data.valid)
          navigation.pop()
      })

    return () => {
      // this is for when the pincode
      // is pushed lower in the tech stack
      // clearly it is being removed here
      // so a "dispose" isn't needed
      pincode.current.dispose()
      stream$.unsubscribe()
    }
  }, [])

  const pinPressed = (pin) =>
    pincode.current.changed(pin)

  const indicators = [...Array(pincode.current.length).keys()].map(x => x+1)
    .map((entry, index) => {
      const styles = [indicator_style]
      if (entry <= pins)
        styles.push(indicator_active)

      return <View key={`pin_indicator_${index}`} style={styles} />
    })

  return (
    <TouchableWithoutFeedback onPress={() => navigation.navigate('Loading')}>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center',  backgroundColor: 'rgba(98, 2, 182, 0.6)'}}>
        <Text style={[circle_text_style, {margin: 20}]}>Please Enter Your Pin</Text>
        <View style={{marginVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}>
          { indicators }
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'center' }}>
          <Pins pins={[1, 2, 3, 4, 5, 6, 7, 8, 9, 0]} onPress={pinPressed} />
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

