import React, { useEffect, useState } from 'react';
import { PLATFORM_TYPES } from '../../../Constants/InputConstants';

interface SiteLocationItemRendererProps {
    data: {
        platformDetails: {
            availZone: string;
            hostname: string;
            region: string;
            platformType: string;
        };
    };
}

const SiteLocationItemRenderer: React.FC<SiteLocationItemRendererProps> = ({ data }) => {
    const { availZone, hostname, region, platformType } = data.platformDetails;
    const [loc, setLoc] = useState<string>(availZone);

    useEffect(() => {
        if (platformType === PLATFORM_TYPES.VMware) {
            setLoc(hostname);
        }
        if (platformType === PLATFORM_TYPES.Azure) {
            setLoc(region);
        }
    }, [platformType, hostname, region]);

    return <span>{loc}</span>;
};

export default SiteLocationItemRenderer;
