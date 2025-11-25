import React from 'react';
import { Link } from 'react-router-dom';

interface CleanupItemRendererProps {
    // Define your props here
    data: any;
}

const CleanupItemRenderer: React.FC<CleanupItemRendererProps> = ({ data }) => {
    const {isCleanupRequired, targetSite, targetPlanID} = data;
    return (
        <div>
            <p className={`${isCleanupRequired ? 'text-warning': 'text-muted'}`}>{isCleanupRequired ?  <Link target="_blank"
              rel="noopener noreferrer" style={{ fontWeight: '410' }} to={`https://${targetSite?.hostName}:5000/mgmt/protection/plan/${targetPlanID}/cleanup`}>
                  <span className="text-warning">Yes</span>
              </Link> : 'No'}</p>
        </div>
    );
};

export default CleanupItemRenderer;