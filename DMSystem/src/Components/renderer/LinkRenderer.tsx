import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { PORTS } from '../../Constants/userConstants';
import { NodeInterface } from '../../interfaces/interfaces';

interface Props extends WithTranslation {
    data: NodeInterface;
}

const LinkRenderer: React.FC<Props> = ({ data, t }) => {
    const { hostname } = data;
    return (
        <a href={`https://${hostname}:${PORTS.FIVE_THOUSAND_FOUR}/upgrade`} key={`site-link-${hostname}-${data.id}`} target="_blank" rel="noopener noreferrer">
            {t('click.to.upgrade')}
        </a>
    );
};

export default withTranslation()(LinkRenderer);
