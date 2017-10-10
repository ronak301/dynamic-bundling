import React, { Component } from 'react';
import { View, ActivityIndicator, ScrollView } from 'react-native';
import _map from 'lodash/map';

import templateList from './templates';

const { Text}  = require('spr-native-components');

class RemoteBundle extends Component {
    constructor(props) {
        super(props);
        this.count = 0;
        this.rawBundles = {};
        this.state = {
            bundles: {},
            noOfTemplates: 0,
            totalTime: 0,
            evaluationTime: 0
        };
    }
    
    componentDidMount() {
        this.startTime = Date.now();
        this.fetchRemoteBundle();
    }

    render() {
        // debugger;
        console.log('noOfTemplates: ---> ', this.state.noOfTemplates)
        if (this.state.noOfTemplates < templateList.length) {
            return <ActivityIndicator />;
        }

        console.log('rendering templates');
        return (
            <ScrollView>
                {_map(this.state.bundles, ({ templateId, templateName, template, templateProps = {}}, index) => {
                    const TemplateCard = template && template.default ? template.default : template;
                    return (
                        <View key={index.toString()}>
                            <Text>{templateName}</Text>
                            <TemplateCard {...templateProps} />
                        </View>
                    )
                })}
            </ScrollView>
        )
    }

    fetchRemoteBundle = () => {
        templateList.forEach(({ templateId, templateName, templateProps }, index) => {
            fetch(`https://spx-publisher.s3.amazonaws.com/components/${templateId}/dist/index.js`, {
                method: 'GET',
                headers: {
                    'Cache-Control': 'no-cache'
                }
            }).then((response) => {
                this.rawBundles[templateId] = {
                    templateId,
                    template: (response._bodyInit)
                };
                const newBundle = {
                    templateId,
                    templateName,
                    templateProps,
                    template: eval(this.rawBundles[templateId].template)
                };
                console.log('fetched bundle Success: ', templateId);
                this.setState({
                    bundles: {
                        ...this.state.bundles,
                        [templateId]: newBundle,
                    },
                    noOfTemplates: this.state.noOfTemplates + 1,
                });
            })
            .catch((error) => {
                console.log('fetched bundle Error: ', templateId, error);
            })
        });
        // return fetch('https://spx-publisher.s3.amazonaws.com/components/65yet34-7ut8338-c8e1-4f4d2-baa4-3-asdy453/dist/index.js', {
        //     method: 'GET',
        //     headers: {
        //         'Cache-Control': 'no-cache'
        //     }
        //   })
        //   .then((response) => {
        //     this.rawBundles = this.rawBundles.concat([(response._bodyInit + '\n (' + `${i}` + ')')]);
        //     if (++this.count === this.noOfTemplates ) {
        //         let bundles = [];
        //         let index = 0;
        //         let evalStartTime = Date.now();
        //         while (index < this.count) {
        //             const rawBundle = this.rawBundles[index];
        //             const bundle = eval(rawBundle);
        //             bundles = bundles.concat([bundle]);
        //             index++;
        //         }
        //         console.log('Bundle: ', index);
        //         this.setState({ bundles: bundles, totalTime: (Date.now() - this.startTime), evaluationTime: (Date.now() - evalStartTime)});
        //         console.log("TotalTime: ", Date.now() - this.startTime);
        //     } 
        //     console.log("TotalTime: ", Date.now() - this.startTime);
        //   })
    }
}

module.exports = RemoteBundle;