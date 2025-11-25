import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { INITIAL_STATE_INTERFACE } from '../../interfaces/interface';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

interface BreadcrumbItem {
    label: string;
    link: string;
}

interface DMBreadCrumbProps extends WithTranslation {
    links: BreadcrumbItem[];
}
const DMBreadCrumb: React.FC<DMBreadCrumbProps> = ({ links, t }) => {
    function renderList() {
        const items = links.map((item: any, index: number) => (
            <li className="breadcrumb-item" key={`breadcrumb-${item.link}-${index + 1}`}>
                <Link to={item.link} className="color-white">
                    {t(`${item.label}`)}
                </Link>
            </li>
        ));
        return items;
    }
    return <ol className="breadcrumb">{renderList()}</ol>;
};

function mapStateToProps(state: INITIAL_STATE_INTERFACE) {
    const { user } = state;
    return {
        user,
    };
}

export default connect(mapStateToProps)(withTranslation()(DMBreadCrumb));
