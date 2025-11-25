import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

export interface MenuItem {
    label: string;
    icon: IconDefinition;
    path: string;
    children: MenuItem[];
    isActivePath?: string[];
}
