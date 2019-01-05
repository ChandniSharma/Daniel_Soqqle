import React, { Component } from 'react';
import {
    Button, Platform, StyleSheet, TouchableOpacity, ActivityIndicator,
    Text, View, Dimensions, SafeAreaView, ScrollView
} from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import Icon from 'react-native-vector-icons/FontAwesome'

import { AGENDA_LIST_API } from './../endpoints';
import { PAGE_SIZE } from './../constants';


const statusBarHeight = Platform.OS === 'ios' ? 0 : 20;
var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height

const styles = StyleSheet.create({
    container: {
        padding: 0,
        paddingTop: statusBarHeight,
        backgroundColor: '#ffffff',
        flex: 1,
    },
    header: {
        backgroundColor: '#1FBEB8',
        paddingHorizontal: 5,
        paddingVertical: 15,
        position: 'relative',
    },
    headerText: {
        color: '#ffffff',
        fontSize: 20,
        textAlign: 'center',
    },
    headerBackView: {
        position: 'absolute',
        paddingHorizontal: 10,
        paddingVertical: 10,
        top: '50%',
        marginTop: -5,
        left: 10,
        zIndex: 3
    },
    headerBackIcon: {
        color: '#FFFFFF',
        fontSize: 20,
    },
    activityLoaderContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    item: {
        color: '#ffffff',
    },
    separator: {
        flex: 1,
        height: 2,
        backgroundColor: '#8E8E8E',
    },
    accordionHeader: {
        backgroundColor: '#120B34',
        paddingHorizontal: 22,
        paddingVertical: 12,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    accordionIcon: {
        color: '#1FBEB8',
        marginTop: 5,
        fontSize: 15,
    },
    itemName: {
        fontSize: 18,
        color: '#FFFFFF',
    },
    itemTime: {
        fontSize: 15,
        color: 'rgba(255, 255, 255, 0.6)',
        marginBottom: 5
    },
    itemCount: {
        fontSize: 15,
        color: '#1FBEB8',
    },
    taskView: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 10,
    },
    taskTime: {
        textAlign: 'right',
        paddingRight: 32,
        fontSize: 13,
        color: 'rgba(19, 12, 56, 0.4)',
    },
    taskText: {
        lineHeight: 18,
        fontSize: 15,
        color: 'rgba(19, 12, 56, 0.6)',
        paddingHorizontal: 32,
        paddingVertical: 5,
        textAlign: 'justify',
    },
    taskSeparator: {
        marginVertical: 5,
        height: 1,
        backgroundColor: '#E5E5E5',
    },
    listLoader: {
        paddingVertical: 10,
    }
});

let pageNum = 0;
let totalCount = 0;
let pageSize = PAGE_SIZE;

const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    return layoutMeasurement.height + contentOffset.y >= contentSize.height;
};

export default class AgendaView extends Component {

    constructor(props) {
        super(props)
        this.state = {
            agendaItems: [],
            initialLoading: true,
            loading: false,
            activeSections: [0],
            totalCount: null,
        }
    }

    componentWillMount() {
        this.getAgendaItems();
    }

    getAgendaItems(page = 1) {
        fetch(AGENDA_LIST_API.replace('{}', page))
            .then((response) => response.json())
            .then((responseJson) => {
                totalCount = responseJson.total;
                pageNum = page;
                this.mapAgendaItems(responseJson.listTaskgroup);

                // Calling this again because items are very less
                if (pageNum === 1 && totalCount > PAGE_SIZE) {
                    this.getAgendaItems(pageNum + 1);
                }
            })
            .catch((error) => {
                this.setState({ initialLoading: false, loading: false });
            });
    }

    mapAgendaItems(data) {
        let agendaItems = this.state.agendaItems;

        data.map(item => {
            const index = agendaItems.findIndex((obj) => {
                return obj.groupname.toLowerCase() === item.groupname.toLowerCase()
            });
            let taskItem = {
                description: item.description,
                sequence: item.sequence,
                id: item._id,
                unlock_time: item.unlocktime,
            }
            if (index > -1) {
                agendaItems[index]['tasks'].push(taskItem)
            } else {
                agendaItems.push({
                    groupname: item.groupname,
                    category: item.category,
                    name: item.name,
                    // unlocktime: item.unlocktime,
                    tasks: [taskItem]
                });
            }
        })
        this.setState({ agendaItems, initialLoading: false, loading: false });
    }

    _renderHeader = (section, index) => {
        const isActive = this.state.activeSections.includes(index);
        return (
            <View
                style={!isActive ?
                    styles.accordionHeader :
                    { ...styles.accordionHeader, ...{ 'backgroundColor': '#2C2649' } }
                }
            >
                <View>
                    <Text style={styles.itemName}>{section.groupname}</Text>
                    <Icon
                        name={`chevron-${isActive ? 'up' : 'down'}`}
                        style={styles.accordionIcon} />
                </View>
                <View>
                    {/* <Text style={styles.itemTime}>{section.unlocktime}</Text> */}
                    <Text style={styles.itemCount}>{`${section.tasks.length} items`}</Text>
                </View>
            </View>
        );
    };

    _renderContent = section => {
        return (
            <View style={styles.taskView}>
                {(section.tasks.sort((a, b) => a.sequence - b.sequence)).map((task, index) => {
                    const isLastItem = section.tasks.length - 1 == index;
                    return (
                        <View key={task.id}>
                            <Text style={styles.taskTime}>{task.unlock_time}</Text>
                            <Text style={styles.taskText}>
                                {task.description}
                            </Text>
                            {!isLastItem ?
                                <View style={styles.taskSeparator} />
                                : null}
                        </View>
                    )
                })}
            </View>
        );
    };

    _updateSections = activeSections => {
        this.setState({ activeSections });
    };

    handleBackAction() {
        this.props.navigation.pop();
    }

    fetchMoreAgendaOnScroll() {
        if (pageNum * pageSize < totalCount && !this.state.loading) {
            this.setState({ loading: true });
            this.getAgendaItems(pageNum + 1);
        }
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => this.handleBackAction()}
                        style={styles.headerBackView}>

                        <View>
                            <Icon
                                name='chevron-left'
                                style={styles.headerBackIcon}
                            />
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.headerText}>Group Tasks</Text>
                </View>
                {this.state.initialLoading ? (
                    <View style={styles.activityLoaderContainer}>
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                ) : (
                        <ScrollView onScroll={({ nativeEvent }) => {
                            if (isCloseToBottom(nativeEvent)) {
                                this.fetchMoreAgendaOnScroll()
                            }
                        }}
                            scrollEventThrottle={400}>
                            <Accordion
                                sections={this.state.agendaItems}
                                activeSections={this.state.activeSections}
                                renderHeader={this._renderHeader}
                                renderContent={this._renderContent}
                                onChange={this._updateSections}
                                expandMultiple={true}
                            />
                            {this.state.loading ? (
                                <View style={styles.listLoader}>
                                    <ActivityIndicator size="large" color="#120B34" />
                                </View>
                            ) : null}
                        </ScrollView>
                    )}
            </SafeAreaView>
        );
    }
}
