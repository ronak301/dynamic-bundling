// const code = `import React from 'react';
// import { View, Text } from 'react-native';
// export default class MyComponent extends React.Component {
// render() {
// return (
//  <View style={{ padding: 30, flexGrow:1, alignItems: 'center', justifyContent: 'center' }}>
//    <Text>Change this code and watch the output change</Text>
//    <Text style={{
//       color: 'gray',
//       fontSize: 11,
//    }}>Use export default on the Component you want to render</Text>
//  </View>
// );
// }
// };`

import bundle from './output';
const code = `${bundle}`;


export default code;
