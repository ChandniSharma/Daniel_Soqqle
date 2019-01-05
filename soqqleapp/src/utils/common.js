import {Map, List, fromJS, Seq} from 'immutable';

export const isValidEmail = email => {
  return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)
}
export function deepFromJS(js) {
  return typeof js !== 'object' || js === null ? js :
    Array.isArray(js) ?
      Seq(js).map(deepFromJS).toList() :
      Seq(js).map(deepFromJS).toMap();
}
