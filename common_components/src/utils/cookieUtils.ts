import Cookies from 'js-cookie';

export function getCookie(KEY: string): string | undefined | any {
    return Cookies.get(KEY);
}

export function setCookie(KEY: string, VALUE: string): void {
    Cookies.set(KEY, VALUE);
}

export function removeCookie(name: string): void {
    // Setting old date so the cookie will be deleted immediately
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}
