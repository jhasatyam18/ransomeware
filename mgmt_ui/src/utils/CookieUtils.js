import Cookies from 'js-cookie';

export function getCookie(KEY) {
  return Cookies.get(KEY);
}

export function setCookie(KEY, VALUE) {
  // Get the current date and time
  const currentDate = new Date();
  /**
   * Calculate the date 24 hours from now
   * Added code to set cookie expiration to 1 day from when the cookie is set
   * Need to add the above condition so that even if the browser get refershed then update the expiration again one day from the time it got refreshed
   */
  const futureDate = new Date(currentDate.getTime() + (24 * 60 * 60 * 1000));
  document.cookie = `${KEY}=${VALUE}; expires=${futureDate}; path=/;`;
}

export function removeCookie(name) {
  // setting old date so the cookie will be deleted immediately
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}
