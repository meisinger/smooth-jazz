import React, { Fragment } from 'react'
import { SafeAreaView, View, Text, StatusBar, } from 'react-native'

const Component = () => {
  return (
    <Fragment>
      <StatusBar />
      <SafeAreaView style={{flex: 1, justifyContent: 'center', backgroundColor: '#fefefe'}}>
        <View style={{flex: 0.8, justifyContent: 'center'}}>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <View style={{flex: 0.8}}>
              <Text>Welcome</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Fragment>
  )
}

export default Component

