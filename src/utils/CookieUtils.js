import Cookies from 'js-cookie';

export function getCookie(KEY) {
  return Cookies.get(KEY);
}

export function setCookie(KEY, VALUE) {
  return Cookies.set(KEY, VALUE);
}

export function removeCookie(name) {
  // setting old date so the cookie will be deleted immediately
  document.cookie = `${name} + =; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}
