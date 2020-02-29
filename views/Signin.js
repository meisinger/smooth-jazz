import React, { Fragment, useState, useEffect } from 'react'
import { SafeAreaView, View, Button, StatusBar, } from 'react-native'
import { AuthTypes, AuthLogic } from '../logic'
import { Input } from '../components'

const Component = ({ navigation }) => {
  const form = AuthLogic.form

  return (
    <Fragment>
      <StatusBar />
      <SafeAreaView style={{flex: 1, justifyContent: 'center', backgroundColor: '#fefefe'}}>
        <View style={{flex: 0.8, justifyContent: 'center'}}>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <View style={{flex: 0.8}}>
            <Input stream={form.username} placeholder='Username'
              autoCapitalize='none' autoCorrect={false} />
            <Input stream={form.password} placeholder='Password'
              autoCapitalize='none' autoCorrect={false} secureTextEntry={true} />
            <Button onPress={() => AuthLogic.login()} title='Hello' />
            <Button onPress={() => navigation.navigate('Pin')} title='Test Pin' />
          </View>
          </View>
        </View>
      </SafeAreaView>
    </Fragment>
  )
}

export default Component
