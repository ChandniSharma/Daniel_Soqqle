import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import ProgressCircle from 'react-native-progress-circle'

const styles = StyleSheet.create({
  contentView: {
    flex: 1,
    backgroundColor: '#2C2649'
  },
  levelTile: {
    backgroundColor: '#ffffff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    flexDirection: 'row',
    overflow: 'hidden',
    alignItems: 'center'
  },
  levelTitle: {
    color: '#000000',
    fontSize: 18,
    paddingBottom: 1,
  },
  levelCircle: {
    overflow: 'hidden',
    marginRight: 10,
  },
  levelCircleText: {
    fontSize: 15,
  },
  levelText: {
    color: 'rgba(0, 0, 0, 0.5)',
    fontSize: 14,
  },
  levelTags: {
    marginTop: 5,
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  levelTag: {
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
  levelStatus: {
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

let userLevels = [];

const LevelView = (props) => {
  userLevels = props.user.profile && props.user.profile.progressionTreeLevels || [];

  function _renderItem({ item, index }) {
    const percentage = item.currentLevelXP && Math.round((item.currentLevelXP / item.totalXP) * 100) || 0;
    return (
      <View style={styles.levelTile}>
        <View>
          <View style={styles.levelCircle}>
            <ProgressCircle
              percent={percentage}
              radius={25}
              borderWidth={8}
              color="#3399FF"
              bgColor="#ffffff"
              shadowColor="#130C38"
            >
              <Text style={styles.levelCircleText}>{`${percentage}%`}</Text>
            </ProgressCircle>
          </View>
        </View>
        <View>
          <Text style={styles.levelTitle}>{item.name}</Text>
          <View style={styles.levelTags}>
            <Text style={styles.levelTag}>{`Level ${item.level}`}</Text>
            <Text style={styles.levelTag}>{`Total XP ${item.totalXP}`}</Text>
          </View>
        </View>
      </View>
    )
  }
  return (
    <View style={styles.contentView}>
      <View style={{ flex: 1, padding: 10, }}>
        <FlatList
          data={userLevels}
          keyExtractor={(item) => item._id}
          renderItem={_renderItem}
        />
      </View>
    </View>
  );
}

export default LevelView;
