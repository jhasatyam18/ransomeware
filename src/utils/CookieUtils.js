import Cookies from 'js-cookie';

export function getCookie(KEY) {
  return Cookies.get(KEY);
}

export function setCookie(KEY, VALUE) {
  return Cookies.set(KEY, VALUE);
}
