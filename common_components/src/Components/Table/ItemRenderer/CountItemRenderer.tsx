import React from 'react';

interface CountItemRendererProps {
    data: any;
    field: string;
}

const CountItemRenderer: React.FC<CountItemRendererProps> = ({ data, field }) => {
    if (!data) {
        return <p>-</p>;
    }
    if (!data[field] || data[field] === 0) {
        return <p>-</p>;
    }
    const count = data[field];
    return (
        <div>
            <p>{count}</p>
        </div>
    );
};

export default CountItemRenderer;