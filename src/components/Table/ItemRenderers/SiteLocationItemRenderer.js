import { useEffect, useState } from 'react';
import { PLATFORM_TYPES } from '../../../constants/InputConstants';

function SiteLocationItemRenderer({ data }) {
  const { availZone, hostname, region, platformType } = data.platformDetails;
  const [loc, setLoc] = useState(availZone);

  useEffect(() => {
    if (platformType === PLATFORM_TYPES.VMware) {
      setLoc(hostname);
    }
    if (platformType === PLATFORM_TYPES.Azure) {
      setLoc(region);
    }
  }, []);

  return loc;
}

export default SiteLocationItemRenderer;
