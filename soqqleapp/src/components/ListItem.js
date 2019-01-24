import React, { Component} from 'react';
import {Text, TouchableWithoutFeedback, View, TouchableOpacity, Share, Image} from 'react-native';
import {CardSection} from './common/CardSection';


class ListItem extends Component{
    onPressRow(){
        
    }

 

render(){
    const {nameUser,phone, dob, image, repeatValue} = this.props.employee;

     //console.log("in List Item  Name ************", nameUser, "employeeeee---", this.props.employee); 
    let  imageIcon  = 'https://bootdey.com/img/Content/avatar/avatar6.png';
       
         
    return(
        <TouchableWithoutFeedback onPress={this.onPressRow.bind(this)}>
        <View style={styles.viewOuter}>
            <View style={styles.viewInner}>
            
            <View style={styles.mainView}>
            <View>
              <Image source={{ uri: imageIcon }} style={styles.imageStyle} />
            </View>
                
                   
                
                </View>

             </View>            
             </View>
        </TouchableWithoutFeedback>
        
    );
}
}


const styles={
    callImg:{
        width:32,
        height:32
    },
    message:{
        width:32,
        height:32
    },
    share:{
        width:32,
        height:32
    },
    imageStyle:{
        width: 70, height: 70, borderRadius:35, 
    }, 
    mainView:{
     flexDirection: 'row',
     alignItems:'center'
    },
    titleStyle:{
        fontSize: 18,
        // paddingLeft: 5,
    },
    leftView:{
      marginLeft: 5,
    },
    rightView:{
     right: '2%',
    //  backgroundColor:'pink',
     position:'absolute', 
     
    
    },
    viewOuter:{

        padding: 10,
     },
    viewInner:{
        padding: 15,
        backgroundColor: '#f2f2f2',
        borderBottomColor : 'gray',
        borderWidth: 0.8,
        // borderLeftWidth: 0.5,
        shadowColor: 'black',
        shadowOffset: {width:1.0,height:2},
        shadowOpacity: 0.5,
        shadowRadius: 1.5,
        elevation: 3,

    },
}

export default ListItem;

 