import React, {Component} from 'react';
import {Image, ImageBackground, Keyboard, Platform, StatusBar, TouchableOpacity, View, StyleSheet, Linking} from 'react-native';
import {GraphRequest, GraphRequestManager, LoginManager} from 'react-native-fbsdk';
import {CheckBox, Form, Input, Item, Label, Text, Thumbnail} from 'native-base';
import LinkedInModal from 'react-native-linkedin';
import {showMessage} from 'react-native-flash-message';
import {MAIN_COLOR} from "../constants";
import {LINKEDIN_LOGIN_APP_ID, LINKEDIN_LOGIN_APP_SECRET, LINKEDIN_LOGIN_CALLBACK} from "../config";
import {isValidEmail} from "../utils/common";

const baseApi = 'https://api.linkedin.com/v1/people/';
var RCTNetworking = require('RCTNetworking');
const faceBookProfileFields = ['id', 'email', 'friends', 'picture.type(large)', 'first_name', 'last_name'];
const linkedInProfileFields = ['id', 'first-name', 'last-name', 'email-address', 'picture-urls::(original)', 'picture-url::(original)', 'headline', 'specialties', 'industry'];
const PRIVACY_LINK = 'https://beta.soqqle.com/privacyPolicy';
const TERM_OF_USE_LINK = 'https://beta.soqqle.com/termsOfUse';

const statusBarHeight = Platform.OS === 'ios' ? 0 : StatusBar.currentHeight;

export default class LoginView extends Component {

  static flashMessage = message => {
    showMessage({message, type: MAIN_COLOR});
  };
  linkedinLogin = async token => {
    try {
      const {userActions} = this.props;
      const response = await fetch(
        `${baseApi}~:(${linkedInProfileFields.join(',')})?format=json`,
        {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + token
          }
        }
      );
      const result = await response.json();
      userActions.linkedinLoginRequest({...result, accessToken: token});
    } catch (error) {
      LoginView.flashMessage('Can not fetch your LinkedIn profile');
    }
  };

  openLink = url => {
    Linking.canOpenURL(url).then(supported => {
      if (!supported) {
        LoginView.flashMessage("Can not open web browser")
      } else {
        return Linking.openURL(url);
      }
    }).catch(err =>  LoginView.flashMessage("Can not open web browser"));
  }

  facebookLogin = async () => {
    const {userActions} = this.props;
    const getFacebookInfoCallback = (error, result) => {
      if (error) {
        LoginView.flashMessage('Can not fetch your Facebook profile');
      } else {
        userActions.facebookLoginRequest(result);
        console.log('Success fetching data: ', JSON.stringify(result));
      }
    };
    const processResult = (result) => {
      try {
        if (result.isCancelled) {
          LoginView.flashMessage('Facebook login has been canceled');
        } else {
          const infoRequest = new GraphRequest(
            `me?fields=${faceBookProfileFields.join(',')}`,
            null,
            getFacebookInfoCallback,
          );
          return new GraphRequestManager().addRequest(infoRequest).start();
        }
      } catch (error) {
        //console.log("====error====", error)
        LoginView.flashMessage('Unexpected error, please try again!')
      }
    }

    let result = {};
    try {
      this.setState({showLoadingModal: true});
      LoginManager.setLoginBehavior('native');
      result = await LoginManager.logInWithReadPermissions(['public_profile', 'user_friends', 'email']);
      processResult(result)
    } catch (nativeError) {
      try {
        LoginManager.setLoginBehavior('web');
        result = await LoginManager.logInWithReadPermissions(['public_profile', 'user_friends', 'email']);
        processResult(result)
      } catch (webError) {
        //console.log("web===error====", webError)
        LoginView.flashMessage('Can not login with your Facebook, please try again!')
      }
    }
  };
  login = () => {
    Keyboard.dismiss();
    const {userActions} = this.props;
    const {email, name, password, isAgree} = this.state;
    if (!email || !name || !password) {
      return LoginView.flashMessage('Please enter your name, email and password');
    }
    if (!isValidEmail(email)) {
      return LoginView.flashMessage('Please enter an valid email');
    }
    if (!isAgree) {
      return LoginView.flashMessage('Please agree to the Privacy Policy and Terms and Conditions.');
    }
    userActions.loginRequest(this.state);
  };

  constructor(props) {
    super(props);
    this.state = {email: '', password: '', isAgree: false};
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.error && nextProps.error.message) {
      LoginView.flashMessage(nextProps.error.message);
    }
    if (nextProps.registerSuccess && nextProps.registerSuccess !== this.props.registerSuccess) {
      LoginView.flashMessage('Register successful');
      this.props.navigate({routeName: 'LoginScreen'});
    }
    if (nextProps.loginSuccess && nextProps.loginSuccess !== this.props.loginSuccess) {
      LoginView.flashMessage('Login successful');
      this.props.navigation.navigate({routeName: 'Story'});
    }
  }

  render() {
    const {email, password, name, isAgree} = this.state;
    return (
      <View
        style={styles.container}
      >
        <Image style={styles.logo} source={require('../images/image2.1.png')} resizeMode="contain"/>
        <Form>
          <Item floatingLabel>
            <Label style={styles.inputLabel}>Your name</Label>
            <Input
              style={styles.textInput}
              value={name}
              onChangeText={name => this.setState({name})}
            />
          </Item>
          <Item floatingLabel>
            <Label style={styles.inputLabel}>Email</Label>
            <Input
              style={styles.textInput}
              value={email}
              onChangeText={email => this.setState({email})}
            />
          </Item>
          <Item floatingLabel>
            <Label style={styles.inputLabel}>Password</Label>
            <Input
              style={styles.textInput}
              secureTextEntry
              value={password}
              onChangeText={password => this.setState({password})}
            />
          </Item>
          <View style={{height: 50, marginTop: 20, flexDirection: 'row'}}>
            <CheckBox style={styles.checkbox} checked={isAgree} onPress={() => this.setState({isAgree: !isAgree})}/>
            <View style={{marginLeft: 20, flexDirection: 'row', flexWrap: 'wrap'}}><Text style={styles.text}>I agree to the </Text><TouchableOpacity onPress={() => this.openLink(PRIVACY_LINK)}><Text style={styles.inputLabel}>Privacy Policy</Text></TouchableOpacity><Text style={styles.text}> and </Text><TouchableOpacity onPress={() => this.openLink(TERM_OF_USE_LINK)}><Text style={styles.inputLabel}>Terms and Conditions.</Text></TouchableOpacity></View>
          </View>
          <View style={styles.margin10}>
            <ImageBackground style={{width: '100%', height: 57}} source={require('../images/Rectangle.png')}>
              <TouchableOpacity
                style={styles.loginButton}
                onPress={this.login}
              >
                <Text style={styles.loginText}>Login</Text>
              </TouchableOpacity>
            </ImageBackground>
          </View>
          <View style={styles.socialLogin}>
            <Text style={[styles.text]}>Or</Text>
          </View>
          <View style={styles.socialLogin}>
            <TouchableOpacity style={{marginRight: 5}} onPress={
              () => {
                RCTNetworking.clearCookies((cleared) => {
                  this.facebookLogin();
                });
              }
            }>
              <Thumbnail square large source={require('../images/facebook.png')}/>
            </TouchableOpacity>
            <LinkedInModal
              ref={ref => {
                this.modal = ref;
              }}
              renderButton={() => <TouchableOpacity style={{marginLeft: 5}} onPress={
                () => {
                  RCTNetworking.clearCookies((cleared) => {
                    this.modal.open();
                  });
                }}>
                <Thumbnail square large source={require('../images/in.png')}/>
              </TouchableOpacity>}
              clientID={LINKEDIN_LOGIN_APP_ID}
              clientSecret={LINKEDIN_LOGIN_APP_SECRET}
              onError={error => {
                LoginView.flashMessage('LinkedIn Login is cancelled');
              }}
              redirectUri={LINKEDIN_LOGIN_CALLBACK}
              onSuccess={token => {
                this.linkedinLogin(token.access_token);
              }}
            />
          </View>
        </Form>
      </View>
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
    color: "white"
  }
});
