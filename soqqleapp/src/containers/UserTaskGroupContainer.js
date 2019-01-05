import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavigationActions } from 'react-navigation';
import { isImmutable } from 'immutable';
import * as UserActions from '../reducers/UserReducer';
import UserTaskGroupView from '../views/UserTaskGroupView';

export default connect(
    state => ({
        isReady: state.getIn(['session', 'isReady']),
        user: state.getIn(['user', 'user']),
        error: state.getIn(['user', 'error']),
        taskGroups: isImmutable(state.getIn(['user', 'task_groups'])) ? state.getIn(['user', 'task_groups']).toJS() : state.getIn(['user', 'task_groups']),
        userTaskGroupsSuccess: state.getIn(['user', 'getUserTaskGroups']),
    }),
    dispatch => {
        return {
            navigate: bindActionCreators(NavigationActions.navigate, dispatch),
            userActions: bindActionCreators(UserActions, dispatch)
        };
    }
)(UserTaskGroupView);
