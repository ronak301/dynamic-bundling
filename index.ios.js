/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import './SPRPolyFills';

import React from 'react';
import ReactNative, {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  AppRegistry
} from 'react-native';

import codePush from "react-native-code-push";

import testBundle from './template1/output';
import codeFromEditor from './code';

const NUM_OF_TEMPLATES = 100;
let codePushOptions = { checkFrequency: codePush.CheckFrequency.ON_APP_RESUME };
class App extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      code: codeFromEditor,
      isReady: false,
      timeTaken: 0
    };
  }

  componentWillMount() {
    const timeTaken = this.calculateEvalExecutionTime();
    this.setState({
      timeTaken
    })
  }

  calculateEvalExecutionTime = function() {
    var startTime = Date.now();
    var endTime;
    for (var i=0; i <= NUM_OF_TEMPLATES; i++) {
      eval(testBundle);
      if (i === NUM_OF_TEMPLATES) {
        endTime = Date.now();
        this.setState({
          isReady: true
        })
      }
    }
    if (i >= NUM_OF_TEMPLATES) {
      return endTime - startTime;
    }
  }

  render() {
    if (!this.state.isReady) {
      return null;
    }
    const MyComponent1 = eval(this.state.code.bundle1);
    const MyComponent2 = this.state.code.bundle2;
    return (
      <View style={{ flex:1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>{`timetaken:  ${this.state.timeTaken}`}</Text>
        <MyComponent1 />
        <MyComponent2 />
      </View>
    );

    return (
      <View style={styles.container}>
        <View
          style={{
            height: 30,
            width: 1
          }}
        />
        {MyComponent && <MyComponent />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

AppRegistry.registerComponent('poctest', () => codePush(codePushOptions)(App));
