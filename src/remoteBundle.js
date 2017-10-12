import React, { Component } from 'react';
import { View, ActivityIndicator, ListView, Button } from 'react-native';

import _map from 'lodash/map';
import _find from 'lodash/find';

import templateList from './templates';
import { fetchTemplates } from './services/templateService';

const { Text }  = require('spr-native-components');

class RemoteBundle extends Component {
    constructor(props) {
        super(props);
        this.count = 0;
        this.rawBundles = {};
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            bundles: [],
            isReady: false,
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
        if (!this.state.isReady) {
            return <ActivityIndicator />;
        }

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
    };

    renderFooter = () => {
        return (
            <Button title={'Press here to paginate'} onPress={this.onLoadMore} />
        )
    };

    onLoadMore = () => {
        this.fetchRemoteBundle()
    };

    fetchRemoteBundle = () => {
      fetchTemplates(_map(templateList, 'templateId'))
        .then(({success, error}) => {
            const bundles = _map(success, (templateBundle) => {
                const template = _find(templateList, (template) => template.templateId === templateBundle.templateId);
                return {
                    ...template,
                    ...templateBundle
                }
            })
            this.setState({
                bundles: this.state.bundles.concat(bundles),
                isReady: true,
            })
            console.log('fetchTemplates: success: ---> ', bundles);
        })
    }
}

module.exports = RemoteBundle;