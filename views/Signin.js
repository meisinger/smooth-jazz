import React, { Fragment, useState, useEffect } from 'react'
import { SafeAreaView, View, Text, StatusBar, } from 'react-native'
import { AuthTypes, AuthLogic } from '../logic'
import { Input } from '../components'

const Component = () => {
  const form = AuthLogic.form
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
      <SafeAreaView style={{flex:1, alignItems: 'center', justifyContent: 'center'}}>
        <View>
          <Text style={{fontSize: 20}} onPress={() => setCount(count + 1)}>Hello World</Text>
        </View>
        { loggedIn && (
          <>
            <View>
              <Text>{count}</Text>
            </View>
            <View>
              <Text>Big Boy</Text>
            </View>
          </>
        )}
        <View>
          <Text onPress={() => setCount(count - 1)}>{count}</Text>
        </View>
        <View>
          <Input stream={form.username} placeholder='Username'
            changed={form.username.changed}
            autoCapitalize='none' autoCorrect={false}/>
        </View>
      </SafeAreaView>
    </Fragment>
  )
}

export default Component
