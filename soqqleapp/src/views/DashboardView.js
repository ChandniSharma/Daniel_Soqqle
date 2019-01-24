import React from 'react';
import { Platform, StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { Tab, Tabs, ScrollableTab } from 'native-base';
import Header from './../components/Header';

import AchievementView from './AchievementView';
import LevelView from './LevelView';
import SparkView from './SparkView';

const statusBarHeight = Platform.OS === 'ios' ? 0 : 0;

const styles = StyleSheet.create({
  container: {
    padding: 0,
    paddingTop: statusBarHeight,
    backgroundColor: '#ffffff',
    flex: 1,
    flexDirection: 'column'
  },
  contentView: {
    flex: 1,
    backgroundColor: '#2C2649',
    padding: 0,
  }
});

const DashboardView = (props) => {

  const tabs = [
    {
      key: 'rewards',
      label: 'Rewards',
      component: <Text style={{ color: '#000000' }}>Rewards coming soon..</Text>
    },
    {
      key: 'achievements',
      label: 'Achievements',
      component: (<AchievementView {...props} />)
    },
    {
      key: 'levels',
      label: 'Levels',
      component: (<LevelView {...props} />)
    },
    {
      key: 'sparks',
      label: 'Sparks',
      component: (<SparkView {...props} />)
    }
  ]
  return (
    <SafeAreaView style={styles.container}>
      <Header navigation={props.navigation}
        headerStyle={{
          elevation: 0
        }} />
      <View style={styles.contentView}>
        <Tabs
          locked={true}
          renderTabBar={() => <ScrollableTab style={{ borderWidth: 0 }} />}
          tabBarUnderlineStyle={{ backgroundColor: '#1FBEB8' }}>
          {tabs.map(tab => {
            return (
              <Tab heading={tab.label}
                tabStyle={{
                  backgroundColor: '#130C38'
                }}
                activeTabStyle={{
                  backgroundColor: '#130C38',
                  color: '#ffffff'
                }}
                key={tab.key}
              >
                {tab.component}
              </Tab>
            )
          })}
        </Tabs>
      </View>
    </SafeAreaView>
  );
}

export default DashboardView;