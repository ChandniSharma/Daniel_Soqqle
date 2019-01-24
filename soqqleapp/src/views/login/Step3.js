import React, {Component} from 'react';
import {ImageBackground, Linking, Platform, StatusBar, StyleSheet, TouchableOpacity, View} from 'react-native';
import {CheckBox, Form, Input, Item, Label, Text} from 'native-base';
import {MAIN_COLOR} from "../../constants";
import LoginView from "../LoginView";

const statusBarHeight = Platform.OS === 'ios' ? 0 : StatusBar.currentHeight;
const PRIVACY_LINK = 'https://beta.soqqle.com/privacyPolicy';
const TERM_OF_USE_LINK = 'https://beta.soqqle.com/termsOfUse';

export default class Step3 extends Component {
  openLink = url => {
    Linking.canOpenURL(url).then(supported => {
      if (!supported) {
        LoginView.flashMessage("Can not open web browser");
      } else {
        return Linking.openURL(url);
      }
    }).catch(err => LoginView.flashMessage("Can not open web browser"));
  };

  render() {
    const {password, repassword, name, onChange, onSignup, isAgree} = this.props;
    return (
      <Form>
        <Item rounded style={[styles.textInput, styles.inputWrapper]}>
          <Input
            style={styles.textInput}
            value={name}
            placeholder={"Enter your name"}
            onChangeText={value => onChange('name', value)}
          />
        </Item>
        <Item rounded style={[styles.textInput, styles.inputWrapper]}>
          <Input
            style={styles.textInput}
            secureTextEntry
            value={password}
            placeholder="Password"
            onChangeText={value => onChange('password', value)}
          />
        </Item>
        <Item rounded style={[styles.textInput, styles.inputWrapper]}>
          <Input
            style={styles.textInput}
            secureTextEntry
            value={repassword}
            placeholder="Re-password"
            onChangeText={value => onChange('repassword', value)}
          />
        </Item>
        <View style={{height: 40, marginTop: 10, flexDirection: 'row'}}>
          <CheckBox style={styles.checkbox} checked={isAgree} onPress={() => onChange('isAgree', !isAgree)}/>
          <View style={{marginLeft: 20, flexDirection: 'row', flexWrap: 'wrap'}}><Text style={styles.text}>I agree to
            the </Text><TouchableOpacity onPress={() => this.openLink(PRIVACY_LINK)}><Text style={styles.inputLabel}>Privacy
            Policy</Text></TouchableOpacity><Text style={styles.text}> and </Text><TouchableOpacity
            onPress={() => this.openLink(TERM_OF_USE_LINK)}><Text style={styles.inputLabel}>Terms and Conditions.</Text></TouchableOpacity></View>
        </View>
        <View style={styles.margin10}>
          <ImageBackground style={{width: '100%', height: 50}} source={require('../../images/Rectangle.png')}>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={onSignup}
            >
              <Text style={styles.loginText}>Sign up</Text>
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
    right: 0,
    //backgroundColor:'red',
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  textForgotpassword: {
    color: 'rgba(255, 255, 255, 0.3)',
  },
  margin10: {
    marginTop: 10,
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
  inputWrapper: {
    marginTop: 7
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
