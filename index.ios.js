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

import Dimensions from 'Dimensions';
import codePush from "react-native-code-push";

let codePushOptions = { checkFrequency: codePush.CheckFrequency.ON_APP_RESUME };

const babelStandalone = require('./babel-standalone');
const { height, width } = Dimensions.get('window');

global['$$$___1C_Modules___$$$'] = {
  react: require('react'),
  'react-native': require('react-native')
};

import codeFromEditor from './code';

function wrapScript(code) {
  return `
     global['$$$___1C_Result___$$$'] = (function (require, module, exports) {
       exports = {};
       module = {exports: exports};
       ${code}
       ;
       return module;
     })(function (moduleName) { // require implementation
       return global['$$$___1C_Modules___$$$'][moduleName];
     });
   `;
}

class App extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      code: codeFromEditor,
      url: 'http://ccheever.com/Exponent/OneComponent.jsx'
    };
  }

  render() {
    debugger;
    const MyComponent1 = this.state.code.bundle1;
    const MyComponent2 = this.state.code.bundle2;
    return (
      <View>
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
