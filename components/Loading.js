import React from 'react'
import { View, ActivityIndicator } from 'react-native'

export default () => {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center',  backgroundColor: 'rgba(0, 0, 0, 0.6)'}}>
      <ActivityIndicator size='large' color='#d9d9d9' />
    </View>
  )
}
