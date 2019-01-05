/** @format */
import AppContainer from './src/containers/AppContainer';
import {Provider} from 'react-redux';
import { name as appName } from './app.json';
import React, { Component } from 'react';
import store from './src/redux/store';
import { AppRegistry } from 'react-native';

class SoqqleApp extends Component {
    render() {
        return (
          <Provider store={store}>
            <AppContainer />
          </Provider>
        );
    }
}

AppRegistry.registerComponent(appName, () => SoqqleApp);
