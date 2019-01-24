import React, { Component } from 'react';
import {
    TouchableOpacity,
    Text, View, SafeAreaView, Image, FlatList
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import Card from '../components/Card';
import CardSection from '../components/CardSection';
import {
    Thumbnail
  } from "native-base";
import styles from './../stylesheets/userListViewStyles'; 

class UsersList extends Component{
constructor(props){
    super(props);
    this.state={
     dataUser : [],
    };
}
componentDidMount(){
    let dictUserDetail = this.props.navigation.state.params.taskGroupData;
     if(dictUserDetail._team){
        this.setState({dataUser:dictUserDetail._team.emails})  ;
    }
}
handleBackAction() {
    this.props.navigation.navigate({ routeName: 'Chat' })
}

renderItem = (item,index) =>{
    var name = '', designation = '',imgUser;
    if(item.item){
     let dictUserDetail = item.item.userDetails;

     if(dictUserDetail.profile.firstName){
        name = dictUserDetail.profile.firstName
     }
     if(dictUserDetail.profile.lastName){
        name = name+' '+dictUserDetail.profile.lastName;
     }
     if(dictUserDetail.profile.title){
        designation = dictUserDetail.profile.title;
      }
   imgUser =  <Thumbnail
     style={styles.imageUser}
     source={{uri: dictUserDetail.profile.pictureURL || `https://ui-avatars.com/api/?name=${dictUserDetail.profile.firstName}+${dictUserDetail.profile.lastName}`}}/>
}
    
 return(
    <CardSection>
        <TouchableOpacity onPress={()=>this.props.navigation.navigate('UserDetailView', {detailDict:item.item})}>
            <View style={styles.viewMain}>
            {imgUser}
                   <View>
                    <Text style={styles.txtName}> {name} </Text>
                    <Text style={styles.txtDesignation}> {designation} </Text>
                </View>
            </View>
        </TouchableOpacity>
    </CardSection>
 )
}
    render(){
        let countMbr = 0;
        countMbr = this.state.dataUser.length;
        let mbrTitle = 'Members';
        if(countMbr == 1){
            mbrTitle = 'Member'
        }
        return(
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
                    </View>
                    <View style={styles.viewSearchMemCount}>
                       <Text style={styles.txtMemberCount}>{countMbr} {mbrTitle}</Text>
                       <Image style={styles.imgSearchIcon} source={require('../../assets/images/Search.png')}/>
                    </View>
                    <View style={styles.listContainer}>
                                <FlatList
                                style={styles.listStyle}
                                    data = { this.state.dataUser }
                                    scrollEnabled={true}
                                    marginBottom={50}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem = {this.renderItem}
                                    />
                        </View>
            </SafeAreaView>
        );
    }
}

export default UsersList;