import React from 'react';
interface PlanAlertProp {
    data: any;
    field: any;
}

export const PlanAlertRenderer: React.FC<PlanAlertProp> = ({ data, field }) => {
    if(!data[field]) return <>-</>
    const { critical = '', major = '' } = data[field];
    if ( critical === '' && major === '') {
        return <>-</>;
    }
    return (
        <>
            {critical !== '' && <a href='#' className="text-danger">{`Critical: ${critical}`}&nbsp; &nbsp;</a>}
            {major !== '' && <a href='#' className="text-warning">{`Major: ${major}`}</a>}
        </>
    );
};

