import React, { Component } from 'react';
import { View, ActivityIndicator, ListView, Button } from 'react-native';
import _map from 'lodash/map';

import templateList from './templates';

const { Text }  = require('spr-native-components');

class RemoteBundle extends Component {
    constructor(props) {
        super(props);
        this.count = 0;
        this.rawBundles = {};
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            bundles: [],
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
            <ListView
                dataSource={this.ds.cloneWithRows(this.state.bundles)}
                renderRow={this.renderRow}
                renderFooter={this.renderFooter}
            />
        )
    }

    renderRow = ({ templateId, templateName, template, templateProps = {} }, index) => {
        const TemplateCard = template && template.default ? template.default : template;
        return (
            <View style={{ marginVertical: 15 }} key={index.toString()}>
                <Text>{templateName}</Text>
                <TemplateCard {...templateProps} />
            </View>
        )
    }

    renderFooter = () => {
        return (
            <Button title={'Press here to paginate'} onPress={this.onLoadMore} />
        )
    }

    onLoadMore = () => {
        this.fetchRemoteBundle()
    }

    fetchRemoteBundle = () => {
        templateList.forEach(({ templateId, templateName, templateProps }, index) => {
            const template = global.templates[templateId];
            if (template) {
                this.setState((oldState) => {
                    return {
                        ...oldState,
                        bundles: oldState.bundles.concat(template),
                        noOfTemplates: oldState.noOfTemplates + 1,
                    }
                })
                return;
            }

            fetch(`https://spx-publisher.s3.amazonaws.com/components/${templateId}/dist/index.js`, {
                method: 'GET',
                headers: {
                    'Cache-Control': 'no-cache'
                }
            }).then((response) => {
                const newBundle = {
                    templateId,
                    templateName,
                    templateProps,
                    template: eval((response._bodyInit))
                };
                console.log('fetched bundle Success: ', templateId);
                global.templates[templateId] = newBundle;
                this.setState({
                    bundles: this.state.bundles.concat(newBundle),
                    noOfTemplates: this.state.noOfTemplates + 1,
                });
            })
            .catch((error) => {
                console.log('fetched bundle Error: ', templateId, error);
            })
        });
    }
}

module.exports = RemoteBundle;