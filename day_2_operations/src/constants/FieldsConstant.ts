import { UserInterface } from '../interfaces/interface';
import { isEmpty } from '../utils/ValidationUtils';
import { FIELD_TYPE } from './userConstant';
import { FQDN_REGEX, IP_REGEX } from './ValidationConstants';

export const FIELDS = {
    'configureSite.name': { label: 'Name', placeHolderText: '', type: FIELD_TYPE.TEXT, shouldShow: true, fieldInfo: 'Name for the site', validate: (value: any, user: UserInterface) => isEmpty(value), errorMessage: 'Site name required' },
    'configureSite.hostName': { label: 'Hostname', placeHolderText: '', type: FIELD_TYPE.TEXT, shouldShow: true, fieldInfo: 'IP address or FQDN of the node', patterns: [IP_REGEX, FQDN_REGEX], errorMessage: 'Enter valid IP/hostname' },
    'configureSite.userName': { label: 'Username', placeHolderText: '', type: FIELD_TYPE.TEXT, shouldShow: true, fieldInfo: 'Username of the deployed node', validate: (value: any, user: UserInterface) => isEmpty(value), errorMessage: 'Username required' },
    'configureSite.password': { label: 'Password', placeHolderText: '', type: FIELD_TYPE.PASSWORD, shouldShow: true, fieldInfo: 'Password of the deployed node', validate: (value: any, user: UserInterface) => isEmpty(value), errorMessage: 'Password required' },
};
