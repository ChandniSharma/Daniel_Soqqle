import { connect } from 'react-redux';
import { isImmutable } from 'immutable';
import StoryView from '../views/StoryView';

export default connect(
    state => ({
        user: isImmutable(state.getIn(['user', 'user'])) ? state.getIn(['user', 'user']).toJS() : state.getIn(['user', 'user']),
    })
)(StoryView);
