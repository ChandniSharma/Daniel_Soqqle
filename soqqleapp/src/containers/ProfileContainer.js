import { connect } from 'react-redux';
import {isImmutable} from 'immutable';
import ProfileView from '../views/ProfileView';
import {bindActionCreators} from 'redux';
import {NavigationActions} from 'react-navigation';
import * as UserActions from '../reducers/UserReducer';

export default connect(
  state => ({
    user: isImmutable(state.getIn(['user', 'user']))?state.getIn(['user', 'user']).toJS():state.getIn(['user', 'user']),
    companies: isImmutable(state.getIn(['user', 'companies']))?state.getIn(['user', 'companies']).toJS():state.getIn(['user', 'companies']),
    getCompaniesSuccess: state.getIn(['user', 'getCompaniesSuccess']),
    isLoading: state.getIn(['app', 'loading'])
  }),
  dispatch => {
    return {
      navigate: bindActionCreators(NavigationActions.navigate, dispatch),
      userActions: bindActionCreators(UserActions, dispatch)
    };
  }
)(ProfileView);
