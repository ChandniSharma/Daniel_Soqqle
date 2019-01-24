import { connect } from 'react-redux';
import { isImmutable } from 'immutable';
import ProfileView from '../views/ProfileView';
import { bindActionCreators } from 'redux';
import { NavigationActions } from 'react-navigation';
import * as UserActions from '../reducers/UserReducer';
import * as actions from '../reducers/SparkReducer';

export default connect(
  state => ({
    user: isImmutable(state.getIn(['user', 'user'])) ? state.getIn(['user', 'user']).toJS() : state.getIn(['user', 'user']),
    companies: isImmutable(state.getIn(['user', 'companies'])) ? state.getIn(['user', 'companies']).toJS() : state.getIn(['user', 'companies']),
    getCompaniesSuccess: state.getIn(['user', 'getCompaniesSuccess']),
    isLoading: state.getIn(['app', 'loading']),
    sparks: isImmutable(state.getIn(['spark', 'details'])) ? state.getIn(['spark', 'details']).toJS() : state.getIn(['spark', 'details']),
  }),
  dispatch => {
    return {
      navigate: bindActionCreators(NavigationActions.navigate, dispatch),
      userActions: bindActionCreators(UserActions, dispatch),
      sparkActions: bindActionCreators(actions, dispatch)
    };
  }
)(ProfileView);
