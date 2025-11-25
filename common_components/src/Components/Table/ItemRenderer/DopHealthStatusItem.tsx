import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faCircleXmark, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

interface Props {
    data: any;
    field: string;
    options?: any;
}

export const DopHealthStatusItem: React.FC<Props> = ({ data, field, options }) => {
    if (!data || !data[field]) return <span>-</span>;
    const { handleClick } = options || {};
    const handleReplace = () => {
        handleClick(data);
    };
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
        switch (status) {
            case 'partial':
                return <span className="text-warning">{`${entitiesPartial + entitiesBreached} / ${totalEntities}`}</span>;
            case 'breached':
                return <span className="text-danger">{`${entitiesBreached + entitiesPartial} / ${totalEntities}`}</span>;
            case 'meets':
                return <span className="text-success">{`${entitiesMeets} / ${totalEntities}`}</span>;
            default:
                return null;
        }
    };
    const renderRpoStatus = () => {
        return (
            <>
                <div className="cursor-pointer" onClick={handleReplace}>
                    {renderIcon()}
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
