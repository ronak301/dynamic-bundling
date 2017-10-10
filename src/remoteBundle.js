import React, { Component } from 'react';
import { View, Text } from 'react-native';

class RemoteBundle extends Component {
    state = {
        bundles: [],
        totalTime: 0,
        evaluationTime: 0
    }

    constructor(props) {
        super(props);
        this.count = 0;
        this.noOfTemplates = 1;
        this.rawBundles = [];
    }
    
    componentDidMount() {
        let i = 0;
        this.startTime = Date.now();
        while (i++ < this.noOfTemplates) {
            this.fetchRemoteBundle(i);
        }

    }
    render() {
        // debugger;
        if (this.state.bundles.length == 0) {
            return null;
        }
        // const bundle = this.state.bundles[0];
        // const TwitterCard = global['Twitter'] =  bundle && bundle.default ? bundle.default : bundle 
        // console.log("TwitterCard:", TwitterCard.defaultProps);
        return <View><Text>Remote Bundle</Text><Text>TotalTime: {this.state.totalTime}</Text><Text>EvaluationTime: {this.state.evaluationTime}</Text></View>
    }

    fetchRemoteBundle(i) {
        return fetch('https://spx-publisher.s3.amazonaws.com/components/65yet34-7ut8338-c8e1-4f4d2-baa4-3-asdy453/dist/index.js', {
            method: 'GET',
            headers: {
                'Cache-Control': 'no-cache'
            }
          })
          .then((response) => {
            this.rawBundles = this.rawBundles.concat([(response._bodyInit + '\n (' + `${i}` + ')')]);
            if (++this.count === this.noOfTemplates ) {
                let bundles = [];
                let index = 0;
                let evalStartTime = Date.now();
                while (index < this.count) {
                    const rawBundle = this.rawBundles[index];
                    const bundle = eval(rawBundle);
                    bundles = bundles.concat([bundle]);
                    index++;
                }
                console.log('Bundle: ', index);
                this.setState({ bundles: bundles, totalTime: (Date.now() - this.startTime), evaluationTime: (Date.now() - evalStartTime)});
                console.log("TotalTime: ", Date.now() - this.startTime);
            } 
            console.log("TotalTime: ", Date.now() - this.startTime);
          })
    }
}

module.exports = RemoteBundle;