import React, { Component } from 'react';
import { View, Text } from 'react-native';

class RemoteBundle extends Component {
    state = {
        bundle: ""
    }
    componentDidMount() {
        fetch('https://spx-publisher.s3.amazonaws.com/components/65yet34-7ut8338-c8e1-4f4d2-baa4-3-asdy453/dist/index.js', {
            method: 'GET',
            headers: {
                'Cache-Control': 'no-cache'
            }
          })
          .then((response) => {
              this.setState({
                bundle: response._bodyInit
              })
          })
    }
    render() {
        debugger;
        if (this.state.bundle === "") {
            return null;
        }
        const bundle = eval(this.state.bundle);
        const TwitterCard = global['Twitter'] =  bundle && bundle.default ? bundle.default : bundle 
        console.log(TwitterCard.defaultProps);
        return <View><TwitterCard /><Text>Remote Bundle</Text></View>
    }
}

module.exports = RemoteBundle;