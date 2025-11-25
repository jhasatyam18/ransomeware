import React from 'react';
import PropTypes from 'prop-types';
interface PlanReplicationProp {
    data: any;
    field: any;
}

const PlanReplicationRenderer: React.FC<PlanReplicationProp> = ({ data, field }) => {
    if (!data) {
        return <p>-</p>;
    }
    const { sourceSite, replicationInterval, targetSite } = data.protectionPlan ?? data;
    let targetSiteName = targetSite && targetSite.name ? targetSite.name : 'Not Registered';

    return (
        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <div style={{ width: '40%', textAlign: 'left' }} className="repl_col_font_size">{sourceSite.name}</div>
            <div style={{
                flexGrow: 1,
                height: '2px',
                backgroundColor: 'rgb(52, 195, 143)',
                position: 'relative', // For absolute positioning of text and arrow head  
            }}>
                <div style={{ // Arrow Head  
                    position: 'absolute',
                    right: '0',
                    top: '50%',
                    marginTop: '-5px',
                    borderTop: '5px solid transparent',
                    borderBottom: '5px solid transparent',
                    borderLeft: '10px solid rgb(52, 195, 143)',
                }} />
                <div style={{ // "2 Min" Text  
                    position: 'absolute',
                    top: '-12px',           // Adjust as needed to position above the arrow  
                    left: '50%',           // Center horizontally  
                    transform: 'translateX(-50%)', // Fine-tune horizontal centering  
                    fontSize: '9px',         // Adjust font size as needed  
                    whiteSpace: 'nowrap',    // Prevent text from wrapping  
                }} className="text-muted">
                    {`${replicationInterval} Min`}
                </div>
            </div>
            <div style={{ width: '40%', textAlign: 'left', marginLeft: '5px' }} className={`repl_col_font_size ${targetSite && targetSite.name ? '' : 'text-warning'}`}>{targetSiteName}</div>
        </div>
    );
};

PlanReplicationRenderer.propTypes = {
    data: PropTypes.object.isRequired,
    field: PropTypes.string.isRequired,
};

export default PlanReplicationRenderer;
