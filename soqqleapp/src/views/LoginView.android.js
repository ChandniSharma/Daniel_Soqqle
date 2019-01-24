import React, {Component} from 'react';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import {GraphRequest, GraphRequestManager, LoginManager} from 'react-native-fbsdk';
import {Button, Input, Item, Label, Text, Thumbnail} from 'native-base';
import {showMessage} from 'react-native-flash-message';
import * as constants from "../constants";
import {MAIN_COLOR} from "../constants";
import {heightPercentageToDP as hp} from "react-native-responsive-screen";
import {isValidEmail} from "../utils/common";
import Icon from 'react-native-vector-icons/FontAwesome';
import Step1 from "./login/Step1";
import Step3 from "./login/Step3";
import Step2 from "./login/Step2";
import LinkedInModal from "react-native-linkedin";
import {LINKEDIN_LOGIN_APP_ID, LINKEDIN_LOGIN_APP_SECRET, LINKEDIN_LOGIN_CALLBACK} from "../config";
const baseApi = 'https://api.linkedin.com/v1/people/';
var RCTNetworking = require('RCTNetworking');
const faceBookProfileFields = ['id', 'email', 'friends', 'picture.type(large)', 'first_name', 'last_name'];
const linkedInProfileFields = ['id', 'first-name', 'last-name', 'email-address', 'picture-urls::(original)', 'picture-url::(original)', 'headline', 'specialties', 'industry'];

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
  facebookLogin = async () => {
    const {userActions} = this.props;
    const getFacebookInfoCallback = (error, result) => {
      if (error) {
        console.log("=======", error);
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
          console.log("=======");
          return new GraphRequestManager().addRequest(infoRequest).start();
        }
      } catch (error) {
        console.log("====error====", error);
        LoginView.flashMessage('Unexpected error, please try again!');
      }
    };
    let result = {};
    try {
      // LoginManager.setLoginBehavior('native');
      result = await LoginManager.logInWithReadPermissions(['public_profile', 'user_friends', 'email']);
      processResult(result);
    } catch (nativeError) {
      try {
        LoginManager.setLoginBehavior('web');
        result = await LoginManager.logInWithReadPermissions(['public_profile', 'user_friends', 'email']);
        processResult(result);
      } catch (webError) {
        console.log("====web===error====", webError);
        LoginView.flashMessage('Can not login with your Facebook, please try again!');
      }
    }
  };
  login = () => {
    Keyboard.dismiss();
    const {userActions} = this.props;
    const {email, password} = this.state;
    if (!password) {
      return LoginView.flashMessage('Please enter your password');
    }
    userActions.loginRequest({email, password, name: 'hardcoded'});//API required name in login case??
  };
  signup = () => {
    Keyboard.dismiss();
    const {userActions} = this.props;
    const {email, name, password, isAgree, repassword} = this.state;
    if (!name || !password || !repassword) {
      return LoginView.flashMessage('Please enter your name, password and re-password');
    }
    if (password !== repassword) {
      return LoginView.flashMessage('Password and re-password are not matched');
    }
    if (!isAgree) {
      return LoginView.flashMessage('Please agree to the Privacy Policy and Terms and Conditions.');
    }
    userActions.loginRequest({email, password, name});
  };

  showforgotPasswordView = () => {
    this.setState({
      modalVisible: true,
      newPassword: ''
    });
  };
  onOtherEmail = () => {
    this.setState({step: 1, email: ''});
  };
  onChange = (field, value) => {
    this.setState({[field]: value});
  };
  onEmailSubmit = () => {
    const {email} = this.state;
    const {userActions} = this.props;
    if (!isValidEmail(email)) {
      return LoginView.flashMessage('Please enter an valid email');
    }
    userActions.checkEmailRequest(email.toLowerCase());
  };

  constructor(props) {
    super(props);
    this.state = {
      step: 1,
      email: '',
      password: '',
      newPassword: '',
      isAgree: false,
      modalVisible: false,
      processing: false,
    };
  }

  forgotPassword() {
    Keyboard.dismiss();
    const {userActions} = this.props;
    const {email, newPassword} = this.state;
    if (!email) {
      return LoginView.flashMessage(constants.KEMAIL_VALIDATION_ALERT);
    } else if (!isValidEmail(email)) {
      return LoginView.flashMessage(constants.KEMAIL_VALIDATION_ALERT);
    } else if (!newPassword) {
      return LoginView.flashMessage(constants.KPASSWORD_VALIDATION_ALERT);
    } else {
      userActions.forgotpasswordRequested(this.state);
    }
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
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
    if (nextProps.checkEmailResult && nextProps.checkEmailResult !== this.props.checkEmailResult) {
      if (nextProps.checkEmailResult.isExisten) {
        this.setState({email: nextProps.checkEmailResult.email, step: 2});
      } else {
        this.setState({email: nextProps.checkEmailResult.email, step: 3});
      }
    }

    // if (nextProps.checkEmailSuccess !== this.props.checkEmailSuccess && nextProps.checkEmailSuccess === false) {
    //   LoginView.flashMessage('Unexpected error, please try again');
    // }

    if (nextProps.forgotpasswordSuccess && nextProps.forgotpasswordSuccess !== this.props.forgotpasswordSuccess) {
      LoginView.flashMessage(constants.KFORGOT_PWD_SUCCESS_ALERT);
      this.setState({
        modalVisible: false,
      });
    } else {
      this.setState({
        modalVisible: false,
      });
    }

  }

  render() {
    const {email, password, name, isAgree, modalVisible, step, repassword} = this.state;
    return (
      <View style={styles.container}>
        <Image style={styles.logo} source={require('../images/image2.1.png')} resizeMode="contain"/>
        <View style={styles.content}>
          {step === 1 && <Step1 onChange={this.onChange} email={email} onEmailSubmit={this.onEmailSubmit}/>}
          {step === 2 && <Step2 onChange={this.onChange} password={password} onLogin={this.login}
                                showforgotPasswordView={this.showforgotPasswordView} onOtherEmail={this.onOtherEmail}/>}
          {step === 3 &&
          <Step3 onChange={this.onChange} password={password} repassword={repassword} name={name} isAgree={isAgree}
                 onSignup={this.signup}/>}
          {step === 1 &&  <View style={styles.socialLogin}>
            <Text style={[styles.text]}>Or</Text>
          </View>}
          {step === 1 && <View style={styles.socialLogin}>
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
          </View>}
        </View>
        <Modal
          animationType="fade"
          transparent
          visible={modalVisible}
          onRequestClose={() => this.setState({modalVisible: !modalVisible})}
        >
          <View style={styles.helpModal}>
            <View style={styles.helpModalContent}>
              <Item floatingLabel>
                <Label style={styles.inputLabel}>New Password</Label>
                <Input
                  style={styles.textInputPwd}
                  secureTextEntry
                  value={this.state.newPassword}
                  onChangeText={newPassword => this.setState({newPassword})}
                />
              </Item>
              <Button
                style={styles.stepButton}
                onPress={() => this.forgotPassword()}>
                <Text style={styles.likeModalAction}>Forgot Password</Text>
              </Button>
              <TouchableOpacity
                onPress={() => {
                  this.setState({modalVisible: !modalVisible});
                }}
                style={styles.likeModalClose}
              >
                <View>
                  <Icon name='close' style={styles.likeModalCloseIcon}/>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingTop: hp('8%'),
    backgroundColor: '#130C38',
    flex: 1
  },
  content: {
    justifyContent: 'center',
    flex: 1
  },
  inputLabel: {
    color: MAIN_COLOR
  },
  logo: {
    alignSelf: 'center',
  },
  socialLogin: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'rgba(255, 255, 255, 0.3)'
  },
  btnForgotPwd: {
    right: 0,
    alignSelf: 'flex-end',
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
    color: "white"
  },
  textInputPwd: {
    color: "black",
  },
  helpModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  resultModalContent: {
    flex: 1,
    paddingVertical: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  helpModalContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingVertical: 30,
    paddingHorizontal: 10,
    width: '90%',
    height: 200,
    borderRadius: 5,
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
  stepButton: {
    alignSelf: 'center',
    backgroundColor: MAIN_COLOR,
    marginTop: 5,
  },
});
