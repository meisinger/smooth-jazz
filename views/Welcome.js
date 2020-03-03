import React, { Fragment, useEffect, useState } from 'react'
import { SafeAreaView, View, Text, StatusBar, Button } from 'react-native'
import { UsersLogic, UsersTypes } from '../logic'
import { useApiActive } from '../hooks'

const Component = () => {
  const active = useApiActive(UsersLogic.API_CONTEXT)
  const [count, setCount] = useState(0)

  useEffect(() => {
    const stream$ = UsersLogic.controller
      .subscribe(state => {
        if (state.type === UsersTypes.LISTED)
          setCount(state.list.length)
      })

    UsersLogic.list()

    return () => stream$.unsubscribe()
  }, [])

  return (
    <Fragment>
      <StatusBar />
      <SafeAreaView style={{flex: 1, justifyContent: 'center', backgroundColor: '#fefefe'}}>
        <View style={{flex: 0.8, justifyContent: 'center'}}>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <View style={{flex: 0.8}}>
              <Text style={{marginVertical: 20}}>Welcome</Text>
              <Text>{count} Users have been pulled.</Text>
              <Button disabled={active} onPress={() => UsersLogic.list()} title='Pull Users Again' />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Fragment>
  )
}

export default Component

