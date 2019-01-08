import { Map } from 'immutable';
import * as axios from 'axios';
import { API_BASE_URL } from '../config';
import { USER_TASK_GROUP_LIST_PATH_API } from './../endpoints';
import { Effects, loop } from 'redux-loop-symbol-ponyfill';
import * as AppStateActions from './AppReducer';
import store from '../redux/store';
import * as constants from '../constants';
import { constant } from 'redux-loop-symbol-ponyfill/lib/effects';

const REGISTER_REQUESTED = 'UserState/REGISTER_REQUESTED';
const REGISTER_COMPLETED = 'UserState/REGISTER_COMPLETED';
const REGISTER_FAILED = 'UserState/REGISTER_FAILED';

const LOGIN_REQUESTED = 'UserState/LOGIN_REQUESTED';
const FACEBOOK_LOGIN_REQUESTED = 'UserState/FACEBOOK_LOGIN_REQUESTED';
const LINKEDIN_LOGIN_REQUESTED = 'UserState/LINKEDIN_LOGIN_REQUESTED';
const LOGIN_COMPLETED = 'UserState/LOGIN_COMPLETED';
const LOGIN_FAILED = 'UserState/LOGIN_FAILED';

const FORGOT_PASSWORD_REQUESTED = 'UserState/FORGOT_PASSWORD_REQUESTED';
const FORGOT_PASSWORD_COMPLETED = 'UserState/FORGOT_PASSWORD_COMPLETED';
const FORGOT_PASSWORD_FAILED = 'UserState/FORGOT_PASSWORD_FAILED';


const GET_COMPANIES_REQUESTED = 'UserState/GET_COMPANIES_REQUESTED';
const GET_COMPANIES_COMPLETED = 'UserState/GET_COMPANIES_COMPLETED';
const GET_COMPANIES_FAILED = 'UserState/GET_COMPANIES_FAILED';

const SAVE_PROFILE_REQUESTED = 'UserState/SAVE_PROFILE_REQUESTED';
const SAVE_PROFILE_COMPLETED = 'UserState/SAVE_PROFILE_COMPLETED';
const SAVE_PROFILE_FAILED = 'UserState/SAVE_PROFILE_FAILED';

const LOG_OUT = 'UserState/LOG_OUT';
const GET_USER_TASK_GROUPS_REQUESTED = 'UserState/GET_USER_TASK_GROUPS_REQUESTED';
const GET_USER_TASK_GROUPS_COMPLETED = 'UserState/GET_USER_TASK_GROUPS_COMPLETED';
const GET_USER_TASK_GROUPS_FAILED = 'UserState/GET_USER_TASK_GROUPS_FAILED';

const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 25000,
  headers: { 'Content-type': 'application/json' }
});
// Initial state
const initialState = Map({ isLoading: false, user: {}, error: {}, companies: [], task_groups: {} });

export function loginRequest(data) {
  return {
    type: LOGIN_REQUESTED,
    payload: data
  };
}

export function facebookLoginRequest(facebookId) {
  return {
    type: FACEBOOK_LOGIN_REQUESTED,
    payload: facebookId
  };
}

export function linkedinLoginRequest(linkedinId) {
  return {
    type: LINKEDIN_LOGIN_REQUESTED,
    payload: linkedinId
  };
}

export function loginCompleted(data) {
  return {
    type: LOGIN_COMPLETED,
    payload: data
  };
}

export function loginFailed(error) {
  return {
    type: LOGIN_FAILED,
    payload: error
  };
}

export function forgotpasswordRequested(data){
  console.log('forgotpasswordRequested ', data);
  return {
    type: FORGOT_PASSWORD_REQUESTED,
    payload: data
  }
}
export function forgotpasswordCompleted(data){
  return {
    type: FORGOT_PASSWORD_COMPLETED,
    payload: data
  }
}
export function forgotpasswordFailed(error){
  return {
    type: FORGOT_PASSWORD_FAILED,
    payload: error
  }
}

export function saveProfileRequest(data) {
  return {
    type: SAVE_PROFILE_REQUESTED,
    payload: data
  };
}

export function saveProfileCompleted(data) {
  return {
    type: SAVE_PROFILE_COMPLETED,
    payload: data
  };
}

export function saveProfileFailed(error) {
  return {
    type: SAVE_PROFILE_FAILED,
    payload: error
  };
}

export async function saveProfile(data) {
  try {
    store.dispatch(AppStateActions.startLoading());
    const response = await instance.post('/mobile/user-profile', data);
    console.log("response=>", response)
    store.dispatch(AppStateActions.stopLoading());
    return saveProfileCompleted(response.data);
  } catch (error) {
    console.log("error=>", error.response)
    store.dispatch(AppStateActions.stopLoading());
    if (error.response && error.response.data) {
      return saveProfileFailed({ code: error.response.status, message: "Save failed ! Please try again" });
    }
    return saveProfileFailed({ code: 500, message: 'Unexpected error!' });
  }
}


export async function forgotPassword(data){
  console.log( 'in api calling methd ', data);
 // let arrayParam =  {'email':'demo2@demo.com','password':'1234'};

  let arrayParam =  {'email':data.email,'password':data.newPassword};

  try {
    store.dispatch(AppStateActions.startLoading());
    const response = await instance.post('/auth/forget-password', arrayParam);
    console.log("response=>", response.data)
    store.dispatch(AppStateActions.stopLoading());
    //console.log('For error ping ',response.data.error)
  
    return forgotpasswordCompleted(response.data);
  } catch (error) {
    console.log("error=>", error.response)
    store.dispatch(AppStateActions.stopLoading());
    console.log('error response data ',error.response.data );
   
    if (error.response && error.response.data) {
      return forgotpasswordFailed({ code: error.response.status, message: "Forgot password failed! Please check your email." });
    }
    return forgotpasswordFailed({ code: 500, message: 'Unexpected error!' });
  }
   
}

export async function login(data) {
 
  try {
    store.dispatch(AppStateActions.startLoading());
    const response = await instance.post('/auth/sign-in', data);

    console.log("response=>", response)
    store.dispatch(AppStateActions.stopLoading());
    store.dispatch(AppStateActions.loginSuccess(response.data));
    return loginCompleted(response.data);
  } catch (error) {
    console.log("error=>", error.response)
    store.dispatch(AppStateActions.stopLoading());
    if (error.response && error.response.data) {
      return loginFailed({ code: error.response.status, message: "Login failed ! Please check your email and password" });
    }
    return loginFailed({ code: 500, message: 'Unexpected error!' });
  }
}

export async function facebookLogin(profile) {
  try {
    store.dispatch(AppStateActions.startLoading());
    const response = await instance.post(`/mobile/facebook-login`, profile);
    store.dispatch(AppStateActions.stopLoading());
    if (!response.data) {
      return loginFailed({ code: 404, message: 'No Soqqle account associated with your logged Facebook account' });
    }
    store.dispatch(AppStateActions.loginSuccess(response.data));
    return loginCompleted(response.data);
  } catch (error) {
    //console.log("error=====", JSON.stringify(error), JSON.stringify(profile))
    store.dispatch(AppStateActions.stopLoading());
    if (error.response && error.response.data) {
      return loginFailed(error.response.data);
    }
    return loginFailed({ code: 500, message: 'Unexpected error!' });
  }
}

export async function linkedinLogin(profile) {
  try {
    store.dispatch(AppStateActions.startLoading());
    const response = await instance.post(`/mobile/linkedin-login`, profile);
    store.dispatch(AppStateActions.stopLoading());
    if (!response.data) {
      return loginFailed({ code: 404, message: 'No Soqqle account associated with your logged LinkedIn account' });
    }
    store.dispatch(AppStateActions.loginSuccess(response.data));
    return loginCompleted(response.data);
  } catch (error) {
    console.log("====error====", error)
    store.dispatch(AppStateActions.stopLoading());
    if (error.response && error.response.data) {
      return loginFailed(error.response.data);
    }
    return loginFailed({ code: 500, message: 'Unexpected error!' });
  }
}

export function registerRequest(data) {
  return {
    type: REGISTER_REQUESTED,
    payload: data
  };
}

export function registerCompleted(data) {
  return {
    type: REGISTER_COMPLETED,
    payload: data
  };
}

export function registerFailed(error) {
  return {
    type: REGISTER_FAILED,
    payload: error
  };
}

export async function register(data) {
  try {
    store.dispatch(AppStateActions.startLoading());
    const response = await instance.post('/user/register', data);
    console.log("response=>", response)
    store.dispatch(AppStateActions.stopLoading());
    store.dispatch(AppStateActions.loginSuccess(response.data));
    return registerCompleted(response.data);
  } catch (error) {
    console.log("error=>", error)
    store.dispatch(AppStateActions.stopLoading());
    if (error.response && error.response.data) {
      return registerFailed(error.response.data);
    }
    return registerFailed({ code: 500, message: 'Unexpected error!' });
  }
}



export function getCompaniesRequest(email) {
  return {
    type: GET_COMPANIES_REQUESTED,
    payload: email
  };
}

export function getCompaniesCompleted(data) {
  return {
    type: GET_COMPANIES_COMPLETED,
    payload: data
  };
}

export function getCompaniesFailed(error) {
  return {
    type: GET_COMPANIES_FAILED,
    payload: error
  };
}

export async function getCompanies(email) {
  try {
    store.dispatch(AppStateActions.startLoading());
    const response = await instance.get(`/company?email=${email}`)
    console.log("response=>", response)
    store.dispatch(AppStateActions.stopLoading());
    return getCompaniesCompleted(response.data);
  } catch (error) {
    console.log("error=>", error)
    if (error.response && error.response.data) {
      return getCompaniesFailed(error.response.data);
    }
    return getCompaniesFailed({ code: 500, message: 'Unexpected error!' });
  }
}


/**
 * -----------------------
 * USER TASK GROUPS
 * -----------------------
 */

export const getUserTaskGroupsRequest = (data) => {
  return {
    type: GET_USER_TASK_GROUPS_REQUESTED,
    payload: data
  };
}

export const getUserTaskGroupsCompleted = (data) => {
  return {
    type: GET_USER_TASK_GROUPS_COMPLETED,
    payload: data
  };
}

export const getUserTaskGroupsFailed = (error) => {
  return {
    type: GET_USER_TASK_GROUPS_FAILED,
    payload: error
  };
}

export async function getUserTaskGroups(data) {
  let endpoint = USER_TASK_GROUP_LIST_PATH_API.replace('{page}', data.page || 1);
  endpoint = endpoint.replace('{type}', 'Story');
  if(data.user_email) {
    endpoint = endpoint.concat('&user_email=', data.user_email);
  }
  let taskGroups = data.previousData || [];
  try {
    if (data.load) {
      store.dispatch(AppStateActions.startLoading());
    }
    const response = await instance.get(endpoint);
    store.dispatch(AppStateActions.stopLoading());
    if (data.reset) {
      taskGroups = [];
    }
    const responseData = response.data;
    const newUserTasks = [...taskGroups, ...responseData.latestUserTaskGroups];
    return getUserTaskGroupsCompleted({
      count: responseData.totalUserTaskGroups,
      taskGroups: newUserTasks,
      page: data.page
    });
  }
  catch (error) {
    store.dispatch(AppStateActions.stopLoading());
    if (error.response && error.response.data) {
      return getUserTaskGroupsFailed(error.response.data);
    }
    return getUserTaskGroupsFailed({ code: 500, message: 'Unexpected error!' });
  }
}

export function logout() {
  return { type: LOG_OUT }
}

// Reducer
export default function UserStateReducer(state = initialState, action = {}) {

  switch (action.type) {
    case REGISTER_REQUESTED:
      return loop(
        state.set('error', null).set('registerSuccess', false).set('loginSuccess', false),
        Effects.promise(register, action.payload)
      );
    case REGISTER_COMPLETED:
      return state.set('user', action.payload).set('registerSuccess', true);
    case REGISTER_FAILED:
      return state.set('error', action.payload).set('registerSuccess', false);
    
      case FORGOT_PASSWORD_REQUESTED:
       return loop(
        state.set('error', null).set('forgotpasswordSuccess', false),
        Effects.promise(forgotPassword, action.payload)
       );
       case FORGOT_PASSWORD_COMPLETED:
          //console.log("****** forgot pwd payload ",action.payload,"******");
        return state.set('user', action.payload).set('forgotpasswordSuccess', true);

      case FORGOT_PASSWORD_FAILED:
      console.log("****** forgot pwd payload ",action.payload,"******");
          return state.set('error', action.payload).set('forgotpasswordSuccess', false);

    case GET_COMPANIES_REQUESTED:
      return loop(
        state.set('error', null).set('getCompaniesSuccess', false),
        Effects.promise(getCompanies, action.payload)
      );
    case GET_COMPANIES_COMPLETED:
      return state.set('companies', action.payload).set('getCompaniesSuccess', true);
    case GET_COMPANIES_FAILED:
      return state.set('error', action.payload).set('getCompaniesSuccess', false);
    case LOGIN_REQUESTED:
      return loop(
        state.set('error', null).set('loginSuccess', false).set('registerSuccess', false),
        Effects.promise(login, action.payload)
      );
    case FACEBOOK_LOGIN_REQUESTED:
      return loop(
        state.set('error', null).set('loginSuccess', false).set('registerSuccess', false),
        Effects.promise(facebookLogin, action.payload)
      );
    case LINKEDIN_LOGIN_REQUESTED:
      return loop(
        state.set('error', null).set('loginSuccess', false).set('registerSuccess', false),
        Effects.promise(linkedinLogin, action.payload)
      );
    case LOGIN_COMPLETED:
      return state.set('user', action.payload).set('loginSuccess', true).set('task_groups', {}).set('getUserTaskGroups', false);
    case LOGIN_FAILED:
      return state.set('error', action.payload).set('loginSuccess', false);
    case SAVE_PROFILE_REQUESTED:
      const _id = state.getIn(['user', '_id'])
      return loop(
        state.set('error', null).set('saveProfileSuccess', false),
        Effects.promise(saveProfile, { ...action.payload, _id })
      );
    case SAVE_PROFILE_COMPLETED:
      return state.set('user', action.payload).set('saveProfileSuccess', true);
    case SAVE_PROFILE_FAILED:
      return state.set('saveProfileSuccess', false);
    case LOG_OUT:
      return state.set('user', {}).set('companies', []).set('task_groups', {}).set('getUserTaskGroups', false)
    case GET_USER_TASK_GROUPS_REQUESTED:
      return loop(
        state.set('error', null).set('getUserTaskGroups', false),
        Effects.promise(getUserTaskGroups, action.payload)
      );
    case GET_USER_TASK_GROUPS_COMPLETED:
      return state.set('task_groups', action.payload).set('getUserTaskGroups', true);
    case GET_USER_TASK_GROUPS_FAILED:
      return state.set('error', action.payload).set('getUserTaskGroups', false);
    default:
      return state;
  }
}
