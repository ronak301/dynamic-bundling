import React from 'react';
import { View, Text } from 'react-native';
import Component2 from './file1';

class First extends React.Component {
   render() {
      return React.createElement(
        View,
        null,
        React.createElement(Text, null, "Component1"),
        React.createElement(Component2, null)
);
   }
}

module.exports = First;
