import { useEffect, useState } from 'react';
import { PLATFORM_TYPES } from '../../../constants/InputConstants';

function AppLocationItemRenderer({ data }) {
  const { availZone, hostname, platformType } = data.platformDetails;
  const [loc, setLoc] = useState(availZone);

  useEffect(() => {
    if (platformType === PLATFORM_TYPES.VMware) {
      setLoc(hostname);
    }
  }, []);

  return loc;
}

export default AppLocationItemRenderer;
