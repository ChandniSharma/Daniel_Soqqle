import {Map, List} from 'immutable';
import {API_BASE_URL} from '../config';
import * as axios from 'axios/index';
import store from "../redux/store";
import * as AppStateActions from "./AppReducer";
import {Effects, loop} from "redux-loop-symbol-ponyfill";
const GET_QUESTIONS_REQUESTED = 'TaskState/GET_QUESTIONS_REQUESTED';
const GET_QUESTIONS_COMPLETED = 'TaskState/GET_QUESTIONS_COMPLETED';
const GET_QUESTIONS_FAILED = 'TaskState/GET_QUESTIONS_FAILED';

const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 25000,
  headers: {'Content-type': 'application/json'}
});

// Initial state
const initialState = Map({question: List([]), error: Map({}), getQuestionsSuccess: false});

export function getQuestionRequest(skill) {
  return {
    type: GET_QUESTIONS_REQUESTED,
    payload: skill
  };
}

export function getQuestionCompleted(data) {
  return {
    type: GET_QUESTIONS_COMPLETED,
    payload: data
  };
}

export function getQuestionFailed(error) {
  return {
    type: GET_QUESTIONS_FAILED,
    payload: error
  };
}

export async function getQuestions(skill) {
  try {
    store.dispatch(AppStateActions.startLoading());
    const response = await instance.get(`/questionsGet?roadmapSkill=${skill}&type=illuminate`);
    console.log("response=>", response)
    store.dispatch(AppStateActions.stopLoading());
    return getQuestionCompleted(response.data);
  } catch (error) {
    console.log("error=>", error.response)
    store.dispatch(AppStateActions.stopLoading());
    if (error.response && error.response.data) {
      return getQuestionFailed({ code: error.response.status, message: "Can not get questions!" });
    }
    return getQuestionFailed({ code: 500, message: 'Unexpected error!' });
  }
}

// Reducer
export default function TaskReducer(state = initialState, action = {}) {
  switch (action.type) {
    case GET_QUESTIONS_REQUESTED:
      return loop(
        state.set('error', {}).set('getQuestionsSuccess', false),
        Effects.promise(getQuestions, action.payload)
      );
    case GET_QUESTIONS_COMPLETED:
      return state.set('questions', action.payload).set('getQuestionsSuccess', true);
    case GET_QUESTIONS_FAILED:
      return state.set('questions', []).set('getQuestionsSuccess', false);
    default:
      return state;
  }
}
