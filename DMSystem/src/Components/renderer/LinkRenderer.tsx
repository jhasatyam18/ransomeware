import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { PORTS, STATIC_KEYS } from '../../Constants/userConstants';
import { NodeInterface, UserInterface } from '../../interfaces/interfaces';
import { getValue } from '../../utils/inputUtils';
import { systemRouter } from '../../Constants/apiConstants';

interface Props extends WithTranslation {
    data: NodeInterface;
    user: UserInterface;
}

const LinkRenderer: React.FC<Props> = ({ data, t, user }) => {
    const { hostname } = data;
    const { values } = user;
    const workflow = getValue(STATIC_KEYS.UI_CURRENT_FLOW, values);
    return (
        <a href={`https://${hostname}:${PORTS.FIVE_THOUSAND}/${systemRouter}upgrade`} key={`site-link-${hostname}-${data.id}`} target="_blank" rel="noopener noreferrer">
            {workflow === STATIC_KEYS.UPGRADE ? t('click.to.upgrade') : t('click.to.revert')}
        </a>
    );
};

export default withTranslation()(LinkRenderer);
