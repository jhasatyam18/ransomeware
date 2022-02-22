import Cookies from 'js-cookie';
import { APPLICATION_API_TOKEN } from '../constants/UserConstant';

export function getCookie(KEY) {
  return Cookies.get(KEY);
}

export function setCookie(KEY, VALUE) {
  return Cookies.set(KEY, VALUE);
}

export function getApplicationToken() {
  const token = getCookie(APPLICATION_API_TOKEN);
  return token !== 'undefined' ? `Bearer ${token}` : '';
}
