import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavigationActions } from 'react-navigation';
import { isImmutable } from 'immutable';
import * as achievementActions from '../reducers/AchievementReducer';
import * as sparkActions from '../reducers/SparkReducer';
import DashboardView from '../views/DashboardView';

export default connect(
  state => ({
    user: isImmutable(state.getIn(['user', 'user'])) ? state.getIn(['user', 'user']).toJS() : state.getIn(['user', 'user']),
    achievements: isImmutable(state.getIn(['achievement', 'details'])) ? state.getIn(['achievement', 'details']).toJS() : state.getIn(['achievement', 'details']),
    sparks: isImmutable(state.getIn(['spark', 'details'])) ? state.getIn(['spark', 'details']).toJS() : state.getIn(['spark', 'details']),
  }),
  dispatch => {
    return {
      navigate: bindActionCreators(NavigationActions.navigate, dispatch),
      achievementActions: bindActionCreators(achievementActions, dispatch),
      sparkActions: bindActionCreators(sparkActions, dispatch),
    };
  }
)(DashboardView);
