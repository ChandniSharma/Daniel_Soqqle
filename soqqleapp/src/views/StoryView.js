import React, { Component } from 'react';
import {
  Dimensions,
  ActivityIndicator,
  Image,
  Modal,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
 import Video from 'react-native-video';
import * as axios from 'axios';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome';
import Carousel from 'react-native-snap-carousel';
import { STORY_IMAGE_BASE_URL, STORY_VIDEO_BASE_URL, CHALLENGE_IMAGE_BASE_URL, TASK_GROUP_TYPES } from './../constants';
import { API_BASE_URL } from './../config';
import {
  SAVE_USER_TASK_GROUP_API, STORIES_LIST_API, STORY_HAS_VIDEO_API, USER_TASK_GROUP_LIST_PATH_API,
  TEAM_UPDATE_API, STORY_CHALLENGES_LIST_API_PATH, USER_ACHIEVEMENT_LIST_PATH_API
} from './../endpoints';
import CustomText from './../components/CustomText';
import { getGroupUserDetails } from "../utils/common";
import styles from './../stylesheets/storyViewStyles';

const width = Dimensions.get('window').width; //full width

const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 25000,
  headers: { 'Content-type': 'application/json' }
});

let selectedItemId = null;
let selectedItemType = null;

export default class StoryView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      storiesFetching: true,
      challengesFetching: true,
      stories: [],
      challenges: [],
      currentSlideIndex: 0,
      modalVisible: false,
      processing: false,
      tasksFetching: false,
      userTaskGroups: []
    };
  }

  componentWillMount() {
    this.getStories();
    if (this.props.user) {
      this.getUserAchievements();
    }
  }

  goToDashboardScreen = () => {
    this.props.navigation.navigate({ routeName: 'Dashboard' })
  }

  goToProfileScreen = () => {
    this.props.navigation.navigate({ routeName: 'Profile' })
  }

  goToUserTasksScreen = () => {
    this.props.navigation.navigate({ routeName: 'UserTaskGroup' })
  }

  _renderItem = ({ item, index }) => {
    const imageBaseUrl = item.item_type === TASK_GROUP_TYPES.CHALLENGE ? CHALLENGE_IMAGE_BASE_URL : STORY_IMAGE_BASE_URL;
    return (
      <View>
        <View style={item.item_type === TASK_GROUP_TYPES.CHALLENGE ? styles.challengeContainer : styles.storyContainer}>
          {item.has_video && this.state.currentSlideIndex === index ? (
            <Video
              ref={(ref) => {
                this.player = ref;
              }}
              source={{ uri: STORY_VIDEO_BASE_URL.replace('{}', item._id) }}
              resizeMode={"cover"}
              controls={true}
              volume={1.0}
              rate={1.0}
              style={styles.storyItemVideo}
            />
          ) : (
              <Image
                source={{ uri: imageBaseUrl.replace('{}', item._id) }}
                style={styles.storyItemImage}
                resizeMode='cover'
              />
            )}
          {item.item_type === TASK_GROUP_TYPES.STORY ? (
            <View style={styles.storyContent}>
              <Text
                style={styles.storyItemText}
                numberOfLines={3}
              >
                {item.description}
              </Text>
              <View style={styles.storyTagContainer}>
                {item._objective && (
                  <Text style={{ ...styles.storyTag, ...styles.objectiveTag }}>
                    {`${item.objectiveValue || 0} ${item._objective.name.toUpperCase()}`}
                  </Text>
                )}
                <Text style={{ ...styles.storyTag, ...styles.quotaTag }}>
                  {`0/${item.quota || 0} ${item.refresh.toUpperCase()}`}
                </Text>
                {item.reward && (
                  <Text style={{ ...styles.storyTag, ...styles.rewardTag }}>
                    {`${item.reward.value || 0} ${item.reward.type.toUpperCase()}`}
                  </Text>
                )}
              </View>
            </View>
          ) : (
              <View style={styles.storyContent}>
                <Text
                  style={styles.challengeItemTitle}
                  numberOfLines={1}
                >
                  {item.name}
                </Text>
                <Text
                  style={styles.challengeItemText}
                  numberOfLines={4}
                >
                  {item.description}
                </Text>
                <View style={styles.storyTagContainer}>
                  {item.type && (
                    <Text style={{ ...styles.storyTag, ...styles.objectiveTag }}>
                      {item.type.toUpperCase()}
                    </Text>
                  )}
                  <Text style={{ ...styles.storyTag, ...styles.quotaTag }}>
                    {`0/${item.quota || 0} ${item.refresh.toUpperCase()}`}
                  </Text>
                  {item.reward && (
                    <Text style={{ ...styles.storyTag, ...styles.rewardTag }}>
                      {`${item.rewardValue || 0} ${item.reward.toUpperCase()}`}
                    </Text>
                  )}
                </View>
              </View>
            )}
        </View>
        <View style={styles.storyActionsContainer}>
          <TouchableOpacity onPress={() => {
            this.setModalVisible(!this.state.modalVisible, item._id, item.item_type);
          }}>
            <View style={{ ...styles.storyActionBlock, ...{ 'backgroundColor': '#ffc500' } }}>
              <Image
                source={require('./../../assets/images/thumbs_up.png')}
                style={styles.storyActionIcon}
              />
            </View>
          </TouchableOpacity>
          <View style={{ ...styles.storyActionBlock, ...{ 'borderColor': '#171a54' } }}>
            <Image
              source={require('./../../assets/images/thubms_down.png')}
              style={styles.storyActionIcon}
            />
          </View>
        </View>
      </View >
    );
  };

  setModalVisible(visible, itemId, itemType) {
    this.setState({ modalVisible: visible, tasksFetching: !!itemId, userTaskGroups: [] });
    selectedItemId = itemId;
    selectedItemType = itemType
    if (itemId) {
      this.fetchUserTaskGroupsBasedOnStory(itemId);
    }
  }

  fetchUserTaskGroupsBasedOnStory(storyId) {
    let endpoint = USER_TASK_GROUP_LIST_PATH_API.replace('{page}', 1);
    endpoint = endpoint.replace('{type}', selectedItemType);
    endpoint = endpoint.concat('&page_size=', 3);
    endpoint = endpoint.concat('&type_id=', storyId);
    endpoint = endpoint.concat('&user_email=', this.props.user.profile.email);
    endpoint = endpoint.concat('&filter_user=', true);
    instance.get(endpoint).then(response => {
      if (response) {
        response.data = getGroupUserDetails(response.data);
        this.setState({
          userTaskGroups: response.data.latestUserTaskGroups,
          tasksFetching: false
        })
      }

    }).catch((error) => {
      this.setState({ tasksFetching: false });
    });
  }

  addUserToTeam(teamId) {
    if (!this.state.processing) {
      this.setState({ processing: true });
      let data = { email: this.props.user.profile.email };
      fetch(TEAM_UPDATE_API.replace('{}', teamId), {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }).then((response) => JSON.stringify(response.json()))
        .then((responseData) => {
          this.setState({ processing: false, modalVisible: false });
          this.props.navigation.navigate("UserTaskGroup", { reset: true })
        })
        .catch((error) => {
          this.setState({ processing: false });
        });
    }
  }

  createNewTeam() {
    if (!this.state.processing) {
      this.setState({ processing: true });
      const { profile } = this.props.user;
      let data = {
        name: `${profile.firstName} - team`,
        emails: {
          "accepted": true,
          "email": profile.email
        }
      };
      instance.post(TEAM_UPDATE_API.replace('{}/', ''), data).then(response => {
        this.createNewUserTaskGroup(response.data._id);
      }).catch((error) => {
        this.setState({ processing: false });
      });
    }
  }

  createNewUserTaskGroup(teamId) {
    let data = {
      type: selectedItemType,
      _typeObject: selectedItemId,
      _user: this.props.user._id,
      _team: teamId
    };
    fetch(SAVE_USER_TASK_GROUP_API, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then((response) => JSON.stringify(response.json()))
      .then((responseData) => {
        this.setState({ processing: false, modalVisible: false });
        selectedItemId = null;
        selectedItemType = null;
        this.props.navigation.navigate("UserTaskGroup", { reset: true })
      })
      .catch((error) => {
        this.setState({ processing: false });
      });
  }

  getStories() {
    return fetch(STORIES_LIST_API)
      .then((response) => response.json())
      .then((responseJson) => {
        this.mapStoriesWithVideo(responseJson);
      })
      .catch((error) => {
        return [];
      });
  }

  getUserAchievements = async () => {
    let { user } = this.props;
    let response = await instance(USER_ACHIEVEMENT_LIST_PATH_API.replace(user._id));
    this.getChallenges(user, response.data || [])
  }

  getChallenges(user, userAchievements) {
    let { profile } = user;
    if (profile) {
      let data = {
        emailId: profile.email,
        achievementIds: this.getUserAchievementIds(userAchievements)
      }
      instance.post(STORY_CHALLENGES_LIST_API_PATH, data)
        .then((response) => {
          const challenges = response.data.map(challenge => {
            return {
              ...challenge,
              item_type: TASK_GROUP_TYPES.CHALLENGE
            }
          })
          this.setState({ challenges: challenges, challengesFetching: false });
        })
        .catch((error) => {
          this.setState({ challengesFetching: false });
        });
    }
  }

  getUserAchievementIds(userAchievements) {
    return userAchievements.filter(item => item.status === "Complete").map(item => item.achievementId);
  }

  mapStoriesWithVideo(stories) {
    const results = stories.map(async story => {
      return fetch(STORY_HAS_VIDEO_API.replace('{}', story._id))
        .then((response) => response.json())
        .then((responseJson) => {
          return { ...story, ...{ has_video: true, item_type: TASK_GROUP_TYPES.STORY } };
        })
        .catch((error) => {
          return { ...story, ...{ has_video: false, item_type: TASK_GROUP_TYPES.STORY } };
        });
    });
    Promise.all(results).then((completed) => {
      this.setState({ stories: completed, storiesFetching: false });
    });
  }

  _renderStoryTaskItem = (item) => {
    const data = item._typeObject;
    const teamLength = item._team.emails.length;
    return (
      <View style={{ paddingHorizontal: 8 }} key={item._id}>
        <TouchableOpacity
          onPress={() => this.addUserToTeam(item._team._id)}
        >
          <View style={styles.taskItem}>
            <View style={styles.taskItemHeader}>
              <Text style={styles.taskItemName} numberOfLines={2}>{data.name}</Text>
              <Text style={styles.taskItemSize}>{data.quota ? `${teamLength}/${data.quota}` : ''}</Text>
            </View>
            <View style={styles.taskItemFooter}>
              <Text style={styles.taskItemExpiry}>
                {`Expire: ${data.expiry || ''}`}
              </Text>
              <Text style={styles.taskItemXP}>100 xp</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Image
            source={require('./../../assets/images/chat.png')}
            style={styles.headerIcon}
          />
          <TouchableOpacity onPress={this.goToDashboardScreen}>
            <Icon name='bars' style={styles.headerFontIcon} />
          </TouchableOpacity>
        </View>
        <View style={styles.storyContainerView}>
          {this.state.storiesFetching || this.state.challengesFetching ? (
            <ActivityIndicator size="large" color="#800094" />
          ) : (
              <View>
                <Carousel
                  ref={(c) => {
                    this._carousel = c;
                  }}
                  data={[...this.state.stories, ...this.state.challenges]}
                  renderItem={this._renderItem}
                  sliderWidth={width}
                  itemWidth={wp('90%')}
                  onBeforeSnapToItem={(slideIndex) => this.setState({ currentSlideIndex: slideIndex })}
                />
              </View>
            )}
        </View>
        <View style={styles.footer}>
          <TouchableOpacity onPress={this.goToProfileScreen}>
            <View style={styles.footerTab}>
              <Icon name='th' style={styles.footerTabIcon} />
              <CustomText
                styles={{ ...styles.footerTabText, ...{ 'marginRight': 0 } }}
                font='open-sans'>
                {'Dashboard'.toUpperCase()}
              </CustomText>
            </View>
          </TouchableOpacity>
          <View style={styles.footerTab}>
            <Icon name='star' style={styles.footerTabIcon} />
            <CustomText
              styles={{ ...styles.footerTabText, ...{ 'marginRight': 0 } }}
              font='open-sans'>
              {'Story'.toUpperCase()}
            </CustomText>
          </View>
          <TouchableOpacity onPress={this.goToUserTasksScreen}>
            <View style={styles.footerTab}>
              <Icon name='tasks' style={styles.footerTabIcon} />
              <CustomText
                styles={{ ...styles.footerTabText, ...{ 'marginRight': 0 } }}
                font='open-sans'>
                {'Groups'.toUpperCase()}
              </CustomText>
            </View>
          </TouchableOpacity>
        </View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => this.setModalVisible(!this.state.modalVisible)}
        >
          <View style={styles.likeModalView}>
            <View style={styles.likeModalInnerView}>
              <Text style={styles.likeModalTitle}>You like this!</Text>
              {this.state.tasksFetching ? (
                <ActivityIndicator size="small" color="#800094" />
              ) : (
                  this.state.userTaskGroups.length ? (
                    <View>
                      <Text style={styles.likeModalText}>Join a team to surge forward!</Text>
                      {this.state.userTaskGroups.map(userTaskGroup => {
                        return this._renderStoryTaskItem(userTaskGroup)
                      })}
                      <Text style={styles.likeModalSeparator}>or</Text>
                      <TouchableOpacity
                        onPress={() => this.createNewTeam()}>
                        <Text style={{ ...styles.likeModalAction, ...{ 'backgroundColor': 'transparent', 'color': '#000000' } }}>
                          Start one
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                      <View>
                        <Text style={styles.likeModalText}>But there are no available teams.</Text>
                        <TouchableOpacity
                          onPress={() => this.createNewTeam()}>
                          <Text style={styles.likeModalAction}>Start one</Text>
                        </TouchableOpacity>
                      </View>
                    )
                )}
              <TouchableOpacity
                onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                }}
                style={styles.likeModalClose}
              >
                <View>
                  <Icon name='close' style={styles.likeModalCloseIcon} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }
}
