import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faCircleXmark, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

interface Props {
    data: any;
    field: string;
}

export const DopHealthStatusItem: React.FC<Props> = ({ data, field }) => {
    if (!data || !data[field]) return <span>-</span>;

    const status = data[field];
    const { entitiesMeets, entitiesPartial, entitiesBreached, totalEntities } = data;
    const renderIcon = () => {
        switch (status) {
            case 'partial':
                return <FontAwesomeIcon icon={faExclamationTriangle} className="me-2 text-warning" />;
            case 'breached':
                return <FontAwesomeIcon icon={faCircleXmark} className="me-2 text-danger" />;
            case 'meets':
                return <FontAwesomeIcon icon={faCheckCircle} className="me-2 text-success" />;
            default:
                return null;
        }
    };

    const renderCount = () => {
        if (entitiesBreached === 0 && entitiesMeets === 0 && entitiesPartial === 0) return '-';
        switch (status) {
            case 'partial':
                return <span className="text-warning">{`${entitiesPartial + entitiesBreached} / ${totalEntities}`}</span>;
            case 'breached':
                return <span className="text-danger">{`${entitiesBreached + entitiesPartial} / ${totalEntities}`}</span>;
            case 'meets':
                return <span className="text-success">{`${entitiesMeets} / ${totalEntities}`}</span>;
            default:
                return '-';
        }
    };
    const renderRpoStatus = () => {
        return (
            <>
                <div>
                    {entitiesBreached === 0 && entitiesMeets === 0 && entitiesPartial === 0 ? null : renderIcon()}
                    {renderCount()}
                </div>
            </>
        );
    };

    switch (field) {
        case 'drReady':
            return renderIcon();
        case 'isDRReady':
            return renderIcon();
        case 'rpoStatus':
            return renderRpoStatus();
        default:
            return null;
    }
};
