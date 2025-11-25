import React from 'react';

type titleProp = {
    title: string;
};
const TitleRenderer: React.FC<titleProp> = ({ title }) => {
    return (
        <p style={{ fontSize: '15px', margin: '0px' }} className="font-weight-medium color-white">
            {title}
        </p>
    );
};

export default TitleRenderer;
