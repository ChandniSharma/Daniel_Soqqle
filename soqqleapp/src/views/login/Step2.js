import React, {Component} from 'react';
import {ImageBackground, Platform, StatusBar, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Button, Form, Input, Item, Label, Text} from 'native-base';
import {MAIN_COLOR} from "../../constants";

const statusBarHeight = Platform.OS === 'ios' ? 0 : StatusBar.currentHeight;

export default class Step2 extends Component {
  render() {
    const {password, onChange, onLogin, showforgotPasswordView, onOtherEmail} = this.props;
    return (
      <Form>
        <Item rounded style={styles.textInput}>
          <Input
            style={styles.textInput}
            secureTextEntry
            value={password}
            placeholder='Password'
            onChangeText={value => onChange('password', value)}
          />
        </Item>
        <Button transparent style={styles.btnForgotPwd} onPress={onOtherEmail}>
          <Text style={styles.textForgotpassword}>Login with other email</Text>
        </Button>
        <Button transparent style={styles.btnForgotPwd} onPress={showforgotPasswordView}>
          <Text style={styles.textForgotpassword}>Forgot password?</Text>
        </Button>
        <View style={styles.margin10}>
          <ImageBackground style={{width: '100%', height: 57}} source={require('../../images/Rectangle.png')}>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={onLogin}
            >
              <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>
          </ImageBackground>
        </View>
      </Form>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingTop: statusBarHeight + 5,
    justifyContent: 'center',
    backgroundColor: '#130C38',
    flex: 1
  },
  textButtons: {
    // flex: 1,
    // height: 40,
    // backgroundColor: 'red',
    // flexDirection: 'row',
    // justifyContent: 'space-between'
  },
  checkbox: {
    borderWidth: 0,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)'
  },
  inputLabel: {
    color: MAIN_COLOR
  },
  logo: {
    alignSelf: 'center',
  },
  socialLogin: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'rgba(255, 255, 255, 0.3)'
  },
  btnForgotPwd: {
    alignSelf: 'center',
    marginTop: 5,
  },
  textForgotpassword: {
    color: 'rgba(255, 255, 255, 0.3)',
  },
  margin10: {
    marginTop: 20,
  },
  loginButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  button: {
    width: 100,
    height: 100,
    borderRadius: 50
  },
  textInput: {
    color: "white",
    borderRadius: 5,
  },
  textInputPwd: {
    color: "black",

  },

  likeModalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  likeModalInnerView: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    paddingVertical: 25,
    paddingHorizontal: 10,
    width: '90%',
    borderRadius: 5,
  },
  itemPwd: {
    marginTop: -15,
    marginBottom: 10,
  },
  likeModalTitle: {
    fontSize: 20,
    color: '#000000',
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  likeModalText: {
    fontSize: 18,
    color: '#000000',
    marginBottom: 20,
    textAlign: 'center',
  },
  likeModalSeparator: {
    fontSize: 17,
    color: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 10,
    textAlign: 'center',
  },
  likeModalClose: {
    position: 'absolute',
    padding: 10,
    right: 5,
    top: 0
  },
  likeModalCloseIcon: {
    color: '#333333',
    fontSize: 20,
  },
  likeModalAction: {
    backgroundColor: '#2C2649',
    color: '#ffffff',
    fontSize: 17,
    paddingTop: 5,
    paddingBottom: 8,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignSelf: 'center'

  },
  viewModal: {
    backgroundColor: 'rgba(52, 52, 52, 0.001)',
    top: 0,
    bottom: 0,
    left: 10,
    right: 10,
    width: '100%',
    height: '100%',
    position: 'absolute',
    alignSelf: 'center'
  },
});
