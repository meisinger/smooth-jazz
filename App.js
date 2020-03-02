import React, { useState, useEffect } from 'react'
// import { enableScreens } from 'react-native-screens'
import { NavigationContainer, useNavigation } from '@react-navigation/native'
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack'
import { skip } from 'rxjs/operators'
import { AuthLogic, AuthTypes } from './logic'
import { ApiContext } from './logic/repos'
import { Loading, Pin } from './components'
import * as views from './views'

// enable screens before
// rendering navigation
// enableScreens()

const Main = createStackNavigator()
const Root = createStackNavigator()

const MainScreens = () => {
  const [loggedIn, setLoggedIn] = useState(false)
  const navigation = useNavigation()

  useEffect(() => {
    const stream$ = AuthLogic.controller
      .subscribe(state => {
        if (state.type === AuthTypes.AUTHENTICATED)
          setLoggedIn(true)
        if (state.type === AuthTypes.NOT_AUTHENTICATED)
          setLoggedIn(false)
      })

    const waiting$ = ApiContext.loading
      .pipe(skip(1))
      .subscribe(state => {
        if (state)
          navigation.navigate('Loading')
        else
          navigation.pop()
      })

    return () => {
      stream$.unsubscribe()
      waiting$.unsubscribe()
    }

  }, [])

  return (
    <Main.Navigator>
      { loggedIn ? (
        <>
          <Main.Screen name='Welcome' component={views.Welcome} />
        </>
      ): (
        <Main.Screen name='Signin' component={views.Signin} 
          options={{ headerShown: false }} />
      )}
    </Main.Navigator>
  )
}

export default () => {
  return (
    <NavigationContainer>
      <Root.Navigator mode='modal' headerMode='none'>
        <Root.Screen name='Main' component={MainScreens} />
        <Root.Screen name='Loading' component={Loading}
        options={{ 
          cardStyle: { backgroundColor: 'transparent' },
          ...TransitionPresets.FadeFromBottomAndroid
        }}/>
        <Root.Screen name='Pin' component={Pin} />
      </Root.Navigator>
    </NavigationContainer>
  )
}
