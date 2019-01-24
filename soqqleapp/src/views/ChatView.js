import React, { Component } from 'react';
import { SafeAreaView, Text, TouchableOpacity, View, ActivityIndicator,Platform } from 'react-native';
import * as axios from 'axios';
import { API_BASE_URL } from './../config';
import { TASK_GROUP_TYPES } from './../constants';
import { SAVE_TASK_PATH_API, UPDATE_USER_TASK_GROUP_API_PATH, GET_OBJECTIVE_API_PATH, CHAT_SOCKET_URL } from './../endpoints';
import styles from './../stylesheets/chatViewStyles';
import Header from './../components/Header';
import { Thumbnail } from "native-base";
import { getMessages } from '../utils/common';
import { GiftedChat } from 'react-native-gifted-chat';
//import SocketIOClient from 'socket.io-client';
import SocketIOClient from 'socket.io-client/dist/socket.io.js';


const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 25000,
  headers: { 'Content-type': 'application/json' }
});

console.disableYellowBox = true;
 


export default class UserTaskGroupView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      taskGroup: {},
      userTask: {},
      processing: false,
      messages: [],
      userId: null,
    };
    this.onReceivedMessage = this.onReceivedMessage.bind(this);
    this.onSend = this.onSend.bind(this);
    this._storeMessages = this._storeMessages.bind(this);
  }


  componentWillMount() {
    this.setTaskAndTaskGroup();
  }
  componentDidMount() {
    const { userActions } = this.props;
    userActions.getMessageListRequest(this.state.taskGroup._team._id);
    let user = this.props.user;
    let query = `userID=${user._id}&username=${user._id}&firstName=${user.profile.firstName ? user.profile.firstName : ''}&lastName=${user.profile.lastName ? user.profile.lastName : ''}&userType=test`;
    //
    // For android chat persistance
    if(Platform.OS === 'ios'){
      this.socket = SocketIOClient(CHAT_SOCKET_URL, { query: query,transports: ['websocket']});
    }else{
      console.log('in android ');
      this.socket = SocketIOClient(CHAT_SOCKET_URL, { query: query, reconnection:true,reconnectionDelay:500,reconnectionAttempts:Infinity,transports: ['websocket']});
    }
    this.socket.on('server:message', this.onReceivedMessage);

    console.log('this.socket After on =====', this.socket);

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.navigation.state.params.taskUpdated) {
      this.setTaskAndTaskGroup();
    }
    this.setState({ messages: [] });
    if (Array.isArray(nextProps.messages)) {
      if (nextProps.messages.length > 0) {
        let arrayMessages = getMessages(this.state.taskGroup, nextProps.messages);
        this.setState({ messages: arrayMessages });
      }
    }
  }

  setTaskAndTaskGroup() {
    let id = this.props.navigation.state.params.task_group_id;
    let userTask = {};
    let taskGroup = id && this.props.taskGroups.taskGroups.filter(t => {
      return t._id === id;
    })[0] || {};
    if (Object.keys(taskGroup).length && taskGroup._tasks.length) {
      userTask = taskGroup._tasks.filter(task => {
        return task.userID == this.props.user._id &&
          task.metaData.subject.skill._id == taskGroup._typeObject._id
      })[0];
    }
    this.setState({ taskGroup, userTask: userTask || {} });
  }

  goToTask = (story) => {
    if (this.state.processing || this.isTaskCompleted()) {
      return;
    }
    let taskGroupId = this.props.navigation.state.params.task_group_id;
    const { skill, reward } = story;
    if (skill) {
      if (Object.keys(this.state.userTask).length) {
        this.props.navigation.navigate('Task', {
          skill, reward,
          task: this.state.userTask, task_group_id: taskGroupId
        })
      }
      else {
        this.setState({
          processing: true
        });
        instance.get(GET_OBJECTIVE_API_PATH.replace('{}', story._objective)).then(response => {
          let objectiveType = response.data && response.data.name.toLocaleLowerCase()
          if (objectiveType) {
            this.createTask(story, objectiveType, taskGroupId);
          }
        }).catch(err => {
          return {};
        })
      }
    }
  }

  createTask(data, objectiveType, taskGroupId) {
    const userId = this.props.user._id;
    const profile = this.props.user.profile || {};
    const { firstName, lastName } = profile;
    const taskData = {
      type: objectiveType,
      userName: `${firstName}${lastName ? ` ${lastName}` : ''}`,
      userID: userId,
      isHidden: 0,
      creator: {
        _id: userId,
        firstName: firstName,
        ...(lastName ? { lastName: lastName } : {})
      },
      metaData: {
        subject: {
          roadmap: { name: '', },
          skill: { _id: data._id, name: data.skill, },
        },
        participants: [
          {
            user: {
              _id: userId,
              firstName: firstName,
              ...(lastName ? { lastName: lastName } : {})
            },
            status: 'accepted',
            isCreator: true,
          },
        ],
        ratings: [],
        time: Date.now(),
        awardXP: null
      },
      name: data.name
    };
    instance.post(SAVE_TASK_PATH_API, taskData).then(response => {
      this.setState({ userTask: response.data });
      this.updateUserTasks(response.data);
      this.updateUserTaskGroup(response.data, taskGroupId);
    }).catch(err => {
    })
  };

  updateUserTaskGroup(task, taskGroupId) {
    const { taskGroup } = this.state;
    const story = taskGroup._typeObject;
    const { skill, reward } = story;
    let tasks = (taskGroup._tasks || []);
    tasks.push(task);
    let path = UPDATE_USER_TASK_GROUP_API_PATH.replace('{}', taskGroup._id);
    instance.put(path, { '_tasks': tasks }).then(response => {
      this.setState({
        processing: false
      });
      this.props.navigation.navigate('Task', {
        skill, reward,
        task: this.state.userTask, task_group_id: taskGroupId
      });
    }).catch(err => {
    })
  }

  updateUserTasks(task) {
    const taskGroups = this.props.taskGroups.taskGroups;
    const id = this.props.navigation.state.params.task_group_id;
    let index = id && taskGroups.findIndex(t => {
      return t._id === id;
    });
    if (index > -1) {
      let oldTasks = taskGroups[index]['_tasks'] || [];
      oldTasks.push(task);
      taskGroups[index]['_tasks'] = oldTasks;
    };
    this.props.userActions.getUserTaskGroupsCompleted({ ...this.props.taskGroups, taskGroups });
  }

  isTaskCompleted() {
    return this.state.userTask.status === 'complete';
  }
  onReceivedMessage(message) {
    let groupDetails = this.state.taskGroup;
    let userData = groupDetails._team.emails.find((user) => {
      return user.userDetails._id === message.sender;
    });
    if (userData && userData.userDetails && userData.userDetails.profile) {
      let messageReceived = [
        {
          _id: Math.random(),
          text: message.message,
          createdAt: new Date(),
          user: {
            _id: userData.userDetails._id,
            name: userData.userDetails.profile.firstName + ' ' + userData.userDetails.profile.firstName,
            avatar: userData.userDetails.profile.pictureURL || `https://ui-avatars.com/api/?name=${userData.userDetails.profile.firstName}+${userData.userDetails.profile.lastName}`
          },
        },
      ];
      this._storeMessages(messageReceived);
    }
  }
  onSend(messages = []) {
    console.log('ths. socket in on send =========', this.socket);
    this.socket.emit('client:message', {
      sender: this.props.user._id,
      receiver: this.state.taskGroup._team._id,
      chatType: 'GROUP_MESSAGE',
      message: messages && messages[0] && messages[0]['text'] ? messages[0]['text'] : ''
    })
    this._storeMessages(messages);
  }
  _storeMessages(messages) {
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, messages),
      };
    });
  }
  render() {
    const { taskGroup } = this.state;
    const isCompleted = this.isTaskCompleted();
    var user = {
      _id: this.props.user._id,
      name: this.props.user.profile.firstName + ' ' + this.props.user.profile.lastName ? this.props.user.profile.lastName : '',
      avatar: this.props.user.profile.pictureURL || `https://ui-avatars.com/api/?name=${this.props.user.profile.firstName}+${this.props.user.profile.lastName}`,
    };
    const story = taskGroup._typeObject;
    const taskGroupType = taskGroup.type;
    let countExtraMember = 0;
    countExtraMember = this.state.taskGroup._team.emails.length - 2;
    // Now showing photos
    let image1, image2;
    if (this.state.taskGroup._team.emails.length > 0) {
      let arrayEmail = this.state.taskGroup._team.emails[0];
      let dictUserDetail = arrayEmail.userDetails;
      image1 = <Thumbnail
        style={styles.member1}
        source={{ uri: dictUserDetail.profile.pictureURL || `https://ui-avatars.com/api/?name=${dictUserDetail.profile.firstName}+${dictUserDetail.profile.lastName}` }} />
    }
    if (this.state.taskGroup._team.emails.length > 1) {
      let arrayEmail1 = this.state.taskGroup._team.emails[1];
      let dictUserDetail = arrayEmail1.userDetails
      image2 = <Thumbnail
        style={styles.member2}
        source={{ uri: dictUserDetail.profile.pictureURL || `https://ui-avatars.com/api/?name=${dictUserDetail.profile.firstName}+${dictUserDetail.profile.lastName}` }} />
    }
    return (
      <SafeAreaView style={styles.container}>
        <Header title='Chat'
          navigation={this.props.navigation}
          rightText={story.quota ? `${taskGroup._team.emails.length}/${story.quota}` : ''}
          headerStyle={styles.headerStyle}
          headerIconStyle={styles.headerIconStyle}
          headerRightTextStyle={styles.headerRightTextStyle}
        />
        <View style={styles.storyDetailView}>
          <View style={styles.storyDetailHeader}>
            <Text style={styles.storyDetailTitle}>{story.name}</Text>
            <Text style={styles.storyDetailXP}>Team 100 XP</Text>
          </View>
          <Text style={styles.storyDetailText} numberOfLines={2}>{story.description}</Text>
          <View>
            <Text style={styles.storyDetailTagTitle}>You Gain</Text>
            <View style={styles.storyDetailTags}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.storyDetailTag}>50 xp</Text>
                <Text style={styles.storyDetailTag}>5 team xp</Text>
                {story.reward && (
                  taskGroupType === TASK_GROUP_TYPES.CHALLENGE ? (
                    <Text style={styles.storyDetailTag}>
                      {`${story.reward} ${story.rewardValue || ''}`}
                    </Text>
                  ) : (
                      <Text style={styles.storyDetailTag}>
                        {`${story.reward.type} ${story.reward.value || ''}`}
                      </Text>
                    )
                )}
                <TouchableOpacity onPress={() => this.goToTask(story)}
                  disabled={isCompleted || taskGroupType === TASK_GROUP_TYPES.CHALLENGE}>
                  <View style={styles.storyDetailActionTag}>
                    {this.state.processing ? (
                      <ActivityIndicator size={18} style={{ paddingHorizontal: 14 }} color="#ffffff" />
                    ) : (
                        <Text style={{ color: '#ffffff' }}>
                          {Object.keys(this.state.userTask).length ? (
                            isCompleted ? 'Task Completed' : 'Task Started'
                          ) : 'Start Task'}
                        </Text>
                      )}
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('UsersList', { taskGroupData: this.state.taskGroup })}>
          <View style={styles.viewShowMember}>
            {image1}
            {image2}
            {countExtraMember > 0 &&
              <View style={styles.plusMemberView}>
                <Text style={styles.plusTxt}>
                  +{countExtraMember}
                </Text>
              </View>
            }
          </View>
        </TouchableOpacity>
        <GiftedChat
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={user}
          showUserAvatar={true}
          showAvatarForEveryMessage={true}
        />
      </SafeAreaView>
    );
  }
}
