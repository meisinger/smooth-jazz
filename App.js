import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import * as views from './views'

const Container = createStackNavigator()

export default () => {
  return (
    <NavigationContainer>
      <Container.Navigator>
        <Container.Screen name="Signin" component={views.Signin} />
      </Container.Navigator>
    </NavigationContainer>
  )
}
