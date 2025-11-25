import React, { useEffect, useState } from 'react';
// import { PLATFORM_TYPES } from '../../../Constants/InputConstants';

interface SiteLocationItemRendererProps {
    data: {
        location: string;
        // platformDetails: {
        //     availZone: string;
        //     hostname: string;
        //     region: string;
        //     platformType: string;
        // };
    };
}

const SiteLocationItemRenderer: React.FC<SiteLocationItemRendererProps> = ({ data }) => {
    if (!data) return <>-</>;
    const { location } = data;
    if (!location) return <span>-</span>;
    return <span>{location}</span>;
    // const { availZone, hostname, region, platformType } = data.platformDetails;
    // const [loc, setLoc] = useState<string>(availZone);

    // useEffect(() => {
    //     if (platformType === PLATFORM_TYPES.VMware) {
    //         setLoc(hostname);
    //     }
    //     if (platformType === PLATFORM_TYPES.Azure) {
    //         setLoc(region);
    //     }
    // }, [platformType, hostname, region]);

    // return <span>{loc}</span>;
};

export default SiteLocationItemRenderer;
