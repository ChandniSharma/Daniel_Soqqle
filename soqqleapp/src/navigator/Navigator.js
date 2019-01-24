import React from 'react';
import {createStackNavigator} from 'react-navigation';
import LoginContainer from '../containers/LoginContainer';
import ProfileContainer from '../containers/ProfileContainer';
import CompanyProfileContainer from '../containers/CompanyContainer';
import StoryContainer from '../containers/StoryContainer';
import AgendaContainer from '../containers/AgendaContainer';
import UserTaskGroupContainer from '../containers/UserTaskGroupContainer';
import ChatContainer from '../containers/ChatContainer';
import DashboardContainer from '../containers/DashboardContainer';
import TaskContainer from "../containers/TaskContainer";

import UsersList from '../views/UsersList';
import UserDetailView from '../views/UserDetailView';

const AppNavigator = createStackNavigator({
    Login: {screen: LoginContainer},
    UserTaskGroup: {screen: UserTaskGroupContainer},
    Profile: {screen: ProfileContainer},
    Story: {screen: StoryContainer},
    Task: {screen: TaskContainer},
    CompanyProfile: {screen: CompanyProfileContainer},
    Chat: {screen: ChatContainer},
    Agenda: {screen: AgendaContainer},
    Dashboard: {screen: DashboardContainer},
    UsersList:{screen: UsersList},
    UserDetailView:{screen:UserDetailView},
  },
  {
    headerMode: 'none'
  }
);

export default AppNavigator;
