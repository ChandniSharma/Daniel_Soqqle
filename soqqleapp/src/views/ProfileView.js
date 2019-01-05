import React, {Component} from 'react';
import { StackActions, NavigationActions } from 'react-navigation';
import {Image, StyleSheet, View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {
  Menu,
  MenuTrigger,
  MenuOptions,
  MenuOption, MenuProvider
} from 'react-native-popup-menu';
import _ from 'lodash';
import {MAIN_COLOR} from "../constants";
import {
  Body,
  Button,
  Card,
  CardItem,
  Container,
  Content,
  Header,
  Icon,
  Input,
  Item,
  Left,
  Right,
  Text,
  Textarea,
  Thumbnail
} from "native-base";

export default class ProfileView extends Component {

  static flashMessage = message => {
    showMessage({message, type: MAIN_COLOR});
  };
  onChange = (field, value) => {
    const {profile} = this.state;
    this.setState({profile: {...profile, [field]: value}});
  };
  onSave = () => {
    const {profile} = this.state;
    const {userActions} = this.props;
    if (!profile.firstName) {
      return ProfileView.flashMessage('Please enter your first name!');
    }
    if (!profile.lastName) {
      return ProfileView.flashMessage('Please enter your last name!');
    }
    this.setState({isEdit: false});
    userActions.saveProfileRequest(profile);
  };

  goToCompanyDetails = profile => {
    this.props.navigation.navigate('CompanyProfile', {profile});
  };

  goBack = () => {
    this.props.navigation.pop();
  };

  constructor(props) {
    super(props);
    this.state = {
      isEdit: false,
      profile: props.user.profile || {},
      companies: props.companies || []
    };
  }

  componentDidMount() {
    const {userActions} = this.props;
    const {profile} = this.state;
    if (profile && profile.email) {
      userActions.getCompaniesRequest(profile.email.toLowerCase());
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user && !_.isEqual(nextProps.user.profile, this.state.profile) && !nextProps.isLoading) {
      this.setState({profile: nextProps.user.profile});
    }
    if (nextProps.companies && !_.isEqual(nextProps.companies, this.state.companies)) {
      this.setState({companies: nextProps.companies});
    }
  }

  goAgendaView = () => {
    this.props.navigation.navigate("Agenda");
  }

  logout = () => {
    this.menu.close();
    this.props.userActions.logout();
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({routeName: 'Login' })],
    });
    this.props.navigation.dispatch(resetAction);
  }

  renderMenu = () => {
    return <Menu ref={ref => this.menu = ref}>
      <MenuTrigger>
        <Icon style={styles.headerIcon} name='settings'/>
      </MenuTrigger>
      <MenuOptions>
        <MenuOption onSelect={() => this.setState({isEdit: true})}>
          <Button transparent onPress={() => this.setState({isEdit: true})}>
            <Icon type="FontAwesome" style={styles.headerMenuIcon} name='pencil'/>
            <Text style={styles.headerMenuIcon}>Edit Profile</Text>
          </Button>
        </MenuOption>
        <MenuOption>
            <Button transparent onPress={() => this.goAgendaView()}>
              <Icon type="FontAwesome" style={styles.headerMenuIcon} name='calendar' />
              <Text style={styles.headerMenuIcon}>Agenda</Text>
            </Button>
          </MenuOption>
        <MenuOption onSelect={() => this.logout()}>
          <Button transparent onPress={this.logout}>
          <Icon type="FontAwesome" style={styles.headerMenuIcon} name='sign-out'/>
          <Text style={styles.headerMenuIcon}>Exit</Text>
          </Button>
        </MenuOption>
      </MenuOptions>
    </Menu>
  }

  render() {
    const {profile, companies, isEdit} = this.state;
    return (
      <MenuProvider>
      <Container>
        <Header transparent style={styles.blurBg}>
          <Left>
            <Button transparent onPress={this.goBack}>
              <Icon style={styles.headerIcon} name='arrow-back'/>
            </Button>
          </Left>
          <Right>
            {isEdit ?
                <Button transparent onPress={this.onSave}><Text style={styles.headerIcon}>save</Text></Button> : this.renderMenu()}
          </Right>
        </Header>
        <View style={styles.topProfile}>
          <CardItem style={styles.blurBg}>
            <Left>
              <Thumbnail
                style={styles.avatar}
                source={{uri: profile.pictureURL || `https://ui-avatars.com/api/?name=${profile.firstName}+${profile.lastName}`}}/>
              <Body>
              {isEdit ? <Item>
                <Input placeholder="First Name" onChangeText={value => this.onChange('firstName', value)}
                       style={[styles.input, styles.inputName]}
                       value={profile.firstName}/>
                <Input placeholder="Last Name" onChangeText={value => this.onChange('lastName', value)}
                       style={[styles.input, styles.inputName]}
                       value={profile.lastName}/>
              </Item> : <Text style={styles.inputName}>{`${profile.firstName} ${profile.lastName || ''}`}</Text>
              }
              {isEdit ?
                <Input placeholder="Title" onChangeText={value => this.onChange('title', value)} style={styles.input}
                       value={profile.title}/> : <Text note>{profile.title || ''}</Text>}
              </Body>
            </Left>
          </CardItem>
          <CardItem style={styles.blurBg}>
            <Body>
            {isEdit ? <Textarea placeholder="Type your bio" onChangeText={value => this.onChange('bio', value)}
                                value={profile.bio}/> :
              <Text>{profile.bio}</Text>}
            </Body>
          </CardItem>
          <CardItem style={styles.blurBg}>
            {
              companies.map((company, index) =>
                <Button key={`company_${index}`} onPress={() => this.goToCompanyDetails(company)} small rounded
                        style={styles.companyButton}>
                  <Text style={{color: MAIN_COLOR}}>{company.name}</Text>
                </Button>)
            }
          </CardItem>
        </View>
      </Container>
      </MenuProvider>
    );
  }
}

const styles = StyleSheet.create({
  companyButton: {
    backgroundColor: 'white',
    borderColor: MAIN_COLOR,
    borderWidth: 1,
    marginRight: 10,
  },
  topProfile: {
    paddingBottom: 20,
    backgroundColor: '#F8F8F8',
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    marginBottom: 12
  },
  headerIcon: {
    fontSize: 25,
    color: 'black'
  },
  headerMenuIcon: {
    fontSize: 15,
    color: 'black'
  },
  blurBg: {
    backgroundColor: '#F8F8F8'
  },
  card: {
    marginLeft: 12,
    marginRight: 12,
    borderRadius: 10,
  },
  cardImage: {
    height: 200,
    width: null,
    flex: 1,
    borderRadius: 5
  },
  cardBody: {
    margin: 10,
    justifyContent: 'flex-start'
  },
  cardTitle: {
    fontSize: 15
  },
  cardDescription: {
    color: 'rgba(19, 12, 56, 0.5)'
  },
  joinButton: {
    marginTop: 5,
    backgroundColor: MAIN_COLOR
  },
  avatar: {
    width: 60,
    height: 60,
  },
  inputName: {
    fontSize: 20
  },
  input: {
    height: 20,
    fontSize: 15,
    marginLeft: 10,
  }
});
