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
  AppRegistry,
  Button
} from 'react-native';

import codePush from "react-native-code-push";

import testBundle from './template1/output';
import codeFromEditor from './code';
import RemoteBundle from './src/remoteBundle';

const NUM_OF_TEMPLATES = 1000;
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
        <MyComponent2  />
        <Button style={{ width: 100, height: 60, backgroundColor: 'gray'}} title="Download Me" onPress={this.onPress} />
        { this.state.shouldShowRemoteBundle && <RemoteBundle /> }
      </View>
    );
  }

  onPress = () => {
    this.setState({shouldShowRemoteBundle: true});
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
