import React from 'react';

interface Props {
    completed: number;
    staticBar?: boolean;
    text?: string;
    color?: string;
}

const ProgressBar: React.FC<Props> = (props: Props) => {
    const { completed, staticBar, text, color } = props;
    const key = `transferred-rate-popover-${completed}`;
    const formatNumber = (number: number, decimalPlaces: number) => {
        // Check if the number has any decimal values
        if (number % 1 !== 0) {
            // Use toFixed if there are decimal values
            return number.toFixed(decimalPlaces);
        } else {
            // Return the number as-is if it's an integer
            return number.toString();
        }
    };
    return (
        <>
            <div className="progress dm__progress__bar" id={key}>
                <div className={` progress-bar progress-bar${!staticBar ? '-striped progress-bar-animated' : ''}`} role="progressbar" style={{ width: `${completed}%`, backgroundColor: `${color || '#556ee6'}` }}>
                    <span style={{ width: '85%' }} className={`d-flex justify-content-center mb-1`}>
                        {typeof text !== 'undefined' ? text : `${formatNumber(completed, 2)}%`}
                    </span>
                </div>
            </div>
        </>
    );
};

export default ProgressBar;
