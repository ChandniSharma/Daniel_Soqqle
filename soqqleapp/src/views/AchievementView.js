import React, { Component } from 'react';
import {
  StyleSheet, Text, View, ScrollView,
  TouchableWithoutFeedback, FlatList, Image
} from 'react-native';
import * as axios from 'axios';
import { API_BASE_URL } from './../config';
import { USER_ACHIEVEMENT_LIST_PATH_API } from './../endpoints';
import { ACHIEVEMENT_IMAGE_BASE_URL } from './../constants';

const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 25000,
  headers: { 'Content-type': 'application/json' }
});

const styles = StyleSheet.create({
  contentView: {
    flex: 1,
    backgroundColor: '#2C2649'
  },
  groupTagsView: {
    padding: 5,
  },
  groupTag: {
    margin: 5,
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#1FBEB8',
    overflow: 'hidden',
    color: '#1FBEB8',
  },
  achievementTile: {
    backgroundColor: '#ffffff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  achievementTitle: {
    color: '#000000',
    fontSize: 18,
    paddingBottom: 1,
  },
  achievementImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    marginRight: 10,
  },
  achievementText: {
    color: 'rgba(0, 0, 0, 0.5)',
    fontSize: 14,
  },
  achievementTags: {
    marginTop: 6,
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  achievementTag: {
    backgroundColor: '#9600A1',
    overflow: 'hidden',
    borderRadius: 14,
    color: '#ffffff',
    paddingVertical: 5,
    paddingHorizontal: 10,
    fontSize: 14,
    marginTop: 5,
    marginRight: 6,
  },
  achievementStatus: {
    overflow: 'hidden',
    color: '#1FBEB8',
    paddingVertical: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    marginTop: 5,
    marginRight: 6,
    fontWeight: '500'
  }
});

function generateAchievementGroups(data) {
  return data.map(item => {
    return {
      'id': item._id,
      'name': item.name,
      'scope': item.scope,
      'achievements': item._achievements
    }
  })
}

function getAchievementTags(conditions) {
  return conditions.filter(condition => ['Task', 'Action', 'Progression', 'Task and Progression', 'Level'].indexOf(condition.type) > -1)
}

let userId = null;

export default class AchievementView extends Component {

  constructor(props) {
    super(props)
    this.state = {
      achievementGroups: [],
      userAchievements: [],
      selectedGroup: null,
      refreshing: false
    }
    userId = this.props.user._id || null;
  }

  componentWillMount() {
    const { achievements } = this.props;
    this.fetchUserAchievements();
    if (achievements.length) {
      let achievementGroups = generateAchievementGroups(achievements);
      this.setState({
        achievementGroups,
        selectedGroup: achievementGroups[0].id
      });
    }
    else {
      this.props.achievementActions.getAchievementsRequest({ initialLoad: true });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.achievements.length != this.props.achievements.length) {
      let achievementGroups = generateAchievementGroups(nextProps.achievements);
      this.setState({
        achievementGroups,
        selectedGroup: achievementGroups[0].id
      });
    }
  }

  fetchUserAchievements() {
    if (userId) {
      let endpoint = USER_ACHIEVEMENT_LIST_PATH_API.replace('{}', userId);
      instance.get(endpoint).then(response => {
        this.setState({ userAchievements: response.data.achievements || [] })
      }).catch(err => { })
    }
  }

  _renderItem = ({ item, index }) => {
    const tags = getAchievementTags(item.conditions);
    return (
      <View style={styles.achievementTile}>
        <View>
          <Image
            source={{ uri: ACHIEVEMENT_IMAGE_BASE_URL.replace('{}', item._id) }}
            style={styles.achievementImage}
            resizeMode='cover'
          />
        </View>
        <View>
          <Text style={styles.achievementTitle}>{item.name}</Text>
          <Text style={styles.achievementText}>{item.description}</Text>
          <View style={styles.achievementTags}>
            {tags.map((tag, index) => {
              return (
                <Text key={index} style={styles.achievementTag}>
                  {`${tag.count} ${tag.taskType || tag.levelType || tag.type}`}
                </Text>
              )
            })}
            <Text style={styles.achievementStatus}>{this.getAchievementStatus(item._id)}</Text>
          </View>
        </View>
      </View>
    )
  }

  getAchievementStatus(achievementId) {
    let item = this.state.userAchievements.filter(achievement => achievement.achievementId === achievementId)[0] || {};
    return (item.status || 'In Progress').toUpperCase()
  }

  setGroupId(groupId) {
    this.setState({
      selectedGroup: groupId
    })
  }

  getGroupAchievements() {
    let achievementGroup = this.state.achievementGroups.filter(group => group.id === this.state.selectedGroup)[0];
    return achievementGroup ? achievementGroup.achievements : [];
  }

  handleRefresh() {
    this.props.achievementActions.getAchievementsRequest();
  }

  render() {
    return (
      <View style={styles.contentView}>
        <View style={styles.groupTagsView}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {this.state.achievementGroups.map(group => {
              let isSelected = group.id === this.state.selectedGroup;
              return (
                <TouchableWithoutFeedback
                  key={group.id}
                  onPress={() => this.setGroupId(group.id)}>
                  <Text
                    style={isSelected ? {
                      ...styles.groupTag, ...{
                        'color': '#FFFFFF',
                        'backgroundColor': '#1FBEB8'
                      }
                    } : styles.groupTag}
                  >{group.name}</Text>
                </TouchableWithoutFeedback>
              )
            })}
          </ScrollView>
        </View>
        <View style={{ flex: 1, padding: 10, }}>
          <FlatList
            data={this.getGroupAchievements()}
            keyExtractor={(item) => item._id}
            renderItem={this._renderItem}
            refreshing={this.state.refreshing}
            onRefresh={() => this.handleRefresh()}
          />
        </View>
      </View>
    );
  }
}
