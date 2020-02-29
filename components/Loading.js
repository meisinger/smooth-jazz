import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { TouchableWithoutFeedback, View, Text } from 'react-native'

export default () => {
  const navigation = useNavigation()

  return (
    <TouchableWithoutFeedback onPress={() => navigation.pop()}>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center',  backgroundColor: 'rgba(0, 0, 0, 0.6)'}}>
        <Text>Loading</Text>
      </View>
    </TouchableWithoutFeedback>
  )
}
