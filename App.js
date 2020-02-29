import React, { useState, useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { AuthLogic, AuthTypes } from './logic'
import * as views from './views'

const Root = createStackNavigator()

export default () => {
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    const stream$ = AuthLogic.controller
      .subscribe(state => {
        if (state.type === AuthTypes.AUTHENTICATED)
          setLoggedIn(true)
        if (state.type === AuthTypes.NOT_AUTHENTICATED)
          setLoggedIn(false)
      })

    return () => stream$.unsubscribe()
  }, [])

  return (
    <NavigationContainer>
      <Root.Navigator>
        { loggedIn ? (
          <>
            <Root.Screen name="Welcome" component={views.Welcome} />
          </>
        ): (
          <Root.Screen name="Signin" component={views.Signin} 
            options={{ headerShown: false }} />
        )}
      </Root.Navigator>
    </NavigationContainer>
  )
}
