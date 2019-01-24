import React, { Component } from 'react';
import {
     TouchableOpacity,
    Text, View, SafeAreaView
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import CardSection from '../components/CardSection';
import {
    Thumbnail
  } from "native-base";

import styles from './../stylesheets/userDetailViewStyles';

export default class UserDetailView extends Component{
    constructor(props){
        super(props);
        this.state={
         dataUser : {},
        };
    }
    componentDidMount(){
        let dictUserDetail = this.props.navigation.state.params.detailDict;
        this.setState({dataUser:dictUserDetail});
    }
    handleBackAction() {
        this.props.navigation.navigate({ routeName: 'UsersList' })
    }
    render(){
        var name = '', designation = '',imgUser, bio = '';
        let dictUserDetail = this.state.dataUser.userDetails;
        if(dictUserDetail){
            if(dictUserDetail.profile.firstName){
                name = dictUserDetail.profile.firstName
             }
             if(dictUserDetail.profile.lastName){
                name = name+' '+dictUserDetail.profile.lastName;
             }
             imgUser =  <Thumbnail
             style={styles.imageUser}
             source={{uri: dictUserDetail.profile.pictureURL || `https://ui-avatars.com/api/?name=${dictUserDetail.profile.firstName}+${dictUserDetail.profile.lastName}`}}/>
    
            if(dictUserDetail.profile.title){
              designation = dictUserDetail.profile.title;
            }
            if(dictUserDetail.profile.bio){
              bio = dictUserDetail.profile.bio
            }
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
                    <CardSection>
                        <View style={styles.viewNamePhoto}>
                            {imgUser}
                            <View>
                                <Text style={styles.txtName}> {name} </Text>
                                <Text style={styles.txtDesignation}>  {designation} </Text>
                            </View>
                        </View>
                 </CardSection>
                 <CardSection>
                     <Text style={styles.txtDescription}>{bio}</Text>
                 </CardSection>
                 <View style={styles.viewBottomBtn}>
                <TouchableOpacity style={styles.btnSelected} >
                    <Text style={styles.txtSelected}>
                        Soggle
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnNotSelected} >
                    <Text style={styles.txtNotSelected}>
                        Projects
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnNotSelected} >
                    <Text style={styles.txtNotSelected}>
                        Blockchain
                    </Text>
                </TouchableOpacity>
                </View>
                </SafeAreaView>
        )
    }
}