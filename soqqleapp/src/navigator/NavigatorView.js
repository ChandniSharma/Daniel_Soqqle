import React, {Component} from 'react';
import PropTypes from 'prop-types';
import AppNavigator from './Navigator';
import FlashMessage from 'react-native-flash-message';


class NavigatorView extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    navigatorState: PropTypes.shape({
      index: PropTypes.number.isRequired,
      routes: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string.isRequired,
        routeName: PropTypes.string.isRequired
      }))
    }).isRequired
  };

  render() {
    return (
      [<AppNavigator key="navigator"/>, <FlashMessage key='flash' icon='auto'/>]
    );
  }
}

export default NavigatorView;
