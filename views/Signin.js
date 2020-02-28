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
      <SafeAreaView style={{flex: 1, justifyContent: 'center', backgroundColor: '#fefefe'}}>
        <View style={{flex: 0.6, justifyContent: 'center'}}>
          <View style={{alignItems: 'center', marginVertical: 10}}>
            <View>
              <Text style={{fontSize: 20}} onPress={() => setCount(count + 1)}>Hello World</Text>
            </View>
            <View>
              <Text onPress={() => setCount(count - 1)}>{count}</Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <View style={{flex: 0.8}}>
            <Input stream={form.username} placeholder='Username'
              autoCapitalize='none' autoCorrect={false} />
            <Input stream={form.password} placeholder='Password'
              autoCapitalize='none' autoCorrect={false} secureTextEntry={true} />
          </View>
          </View>
        </View>
      </SafeAreaView>
    </Fragment>
  )
}

export default Component
