import React, { Fragment, useState, useEffect } from 'react'
import { SafeAreaView, View, Text, StatusBar, } from 'react-native'
import { AuthTypes, AuthLogic } from '../logic'

const Component = () => {
  const [count, setCount] = useState(1)
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    const stream$ = AuthLogic.controller
      .subscribe(state => {
        if (state.type === AuthTypes.NOT_AUTHENTICTED)
          setLoggedIn(false)
        if (state.type === AuthTypes.AUTHENTICATED)
          setLoggedIn(true)
      })

    return () => stream$.unsubscribe()
  }, [])

  return (
    <Fragment>
      <StatusBar />
      <SafeAreaView>
        <View onPress={() => setCount(count+1)}>
          <Text>Hello World</Text>
        </View>
        { loggedIn && (
          <View>
            <Text>{count}</Text>
          </View>
        )}
      </SafeAreaView>
    </Fragment>
  )
}

export default Component
