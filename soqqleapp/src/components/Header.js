import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'

const styles = StyleSheet.create({
  header: {
    paddingRight: 15,
    position: 'relative',
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#130C38',
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  headerTitle: {
    fontSize: 20,
    textAlign: 'center',
    color: '#ffffff',
  },
  headerBackIcon: {
    color: '#FFFFFF',
    fontSize: 20,
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  headerRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  headerRightText: {
    color: '#FFFFFF',
    fontSize: 16,
  }
});

export default Header = (props) => {
  return (
    <View style={{ ...styles.header, ...props.headerStyle }}>
      <TouchableOpacity onPress={() => props.navigation.pop()} style={styles.headerLeft}>
        <Icon
          name='chevron-left'
          style={{ ...styles.headerBackIcon, ...props.headerIconStyle }}
        />
      </TouchableOpacity>
      <Text style={{ ...styles.headerTitle, ...props.headerTitleStyle }}>{props.title}</Text>
      <View style={styles.headerRight}>
        <Text style={{ ...styles.headerRightText, ...props.headerRightTextStyle }}>{props.rightText}</Text>
      </View>
    </View>
  )
}