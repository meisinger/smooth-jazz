import React, { Fragment } from 'react'
import { SafeAreaView, View, Text, StatusBar, } from 'react-native'
import { Dimensions } from 'react-native'

const report_screen = () => {
  const { width, height } = Dimensions.get('screen')
  console.log('screen dimensions => ', width, height)
}

const report_window = () => {
  const { width, height } = Dimensions.get('window')
  console.log('window dimensions => ', width, height)
}

const Component = () => {
  report_screen()
  report_window()

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

