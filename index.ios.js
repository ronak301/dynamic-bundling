/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */


 import React from 'react';
 import {
   StyleSheet,
   Text,
   TextInput,
   TouchableOpacity,
   View,
   AppRegistry
 } from 'react-native';

 import Dimensions from 'Dimensions';
 import codeFromEditor from './code';

 const babelStandalone = require('./babel-standalone');
 const {height, width} = Dimensions.get('window');

 global['$$$___1C_Modules___$$$'] = {
   'react': require('react'),
   'react-native': require('react-native'),
 };

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
       code:  codeFromEditor,
       url: 'http://ccheever.com/Exponent/OneComponent.jsx',
     };
   }

   componentDidMount() {
     // this._updateCode();

   }

   _updateCode() {
     this._updateCodeAsync().then((code) => {
       console.log("Code loaded I think.");
       this.setState({code});
     }, (err) => {
       console.error("Error loading code: ", err);
     });
   }

   async _updateCodeAsync() {
     let response = await fetch(this.state.url);
     let code = await response.text();
     return code;
   }

   render() {
     let errorText = undefined;
     let code = '';
     let m = undefined;
     let wrappedCode;
     try {
       code = babelStandalone.transform(this.state.code, {
         presets: ['es2015', 'react', 'exponent'],
       }).code;
       wrappedCode = wrapScript(code);
     } catch (e) {
       errorText = '' + e;
     }
     try {
       if (wrappedCode) {
         m = eval(wrappedCode);
       }
     } catch (e) {
       errorText = '' + e;
     }
     let MyComponent = m;
     if (m && m.exports && m.exports.__esModule) {
       MyComponent = m.exports.default;
     } else if (m && m.exports) {
       MyComponent = m.exports;
     } else {
       MyComponent = undefined;
     }

     errorText = errorText || '';
     let message = {
       errorText,
     };

     return (MyComponent && <MyComponent /> || <View />);

     return (
       <View style={styles.container}>
         <View style={{
             height: 30,
             width: 1,
         }} />
         {(MyComponent && (<MyComponent />))}
       </View>
     );
   }
 }

 const styles = StyleSheet.create({
   container: {
     flex: 1,
     backgroundColor: '#fff',
     alignItems: 'center',
     justifyContent: 'center',
   },
 });

AppRegistry.registerComponent('poctest', () => App);
