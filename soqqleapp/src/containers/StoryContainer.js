import { connect } from 'react-redux';
import StoryView from '../views/StoryView';

export default connect(
    state => ({
        isReady: state.getIn(['session', 'isReady']),
        user: state.getIn(['user', 'user']),
    })
)(StoryView);
