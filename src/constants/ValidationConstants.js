export const HOSTNAME_IP_REGEX = /^(((?:\d|1?\d\d|2[0-4]\d|25[0-5])(?:\.(?:\d|1?\d\d|2[0-4]\d|25[0-5])){3})|([a-zA-Z0-9](?:[a-zA-Z0-9-]+)))$/;
export const HOSTNAME_FQDN_REGEX = /^((?=^.{4,253}$)(^((?!-)[a-zA-Z0-9-]{1,63}(?!-)\.)+[a-zA-Z]{2,63}$)|([a-zA-Z0-9](?:[a-zA-Z0-9-]+)))$/;
export const IP_REGEX = /^(?=\d+\.\d+\.\d+\.\d+$)(?:(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.?){4}$/;
export const FQDN_REGEX = /^(?!:\/\/)(?=.{1,255}$)((.{1,63}\.){1,127}(?![0-9]*$)[a-z0-9-]+\.?)$/;
export const PASSWORD_REGEX = /^(?=(.*[0-9]))(?=.*[@#$%^&*()\\[\]{}\-_+=~`|:;"'<>,./?])(?=.*[a-z])(?=(.*[A-Z]))(?=(.*)).{8,}/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const DNS_REGEX = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/;

// [0-9A-F] is set that is repeated two times. After the set there's : or - and
// the group ([0-9A-F]{2}[:-]) is repeated 5 times which gives us ex: 00:50:56:09:f2.
// Then again same character set [0-9A-F] that is repeated 2 times ex : 00:50:56:09:f2:36
export const MAC_ADDRESS = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
