import { useEffect, useState } from 'react';
import { PLATFORM_TYPES } from '../../../constants/InputConstants';

function AppLocationItemRenderer({ data, user }) {
  const { platformType } = user;
  const { region, hostname } = data.platformDetails;
  const [loc, setLoc] = useState(region);

  useEffect(() => {
    if (platformType === PLATFORM_TYPES.VMware) {
      setLoc(hostname);
    }
  }, []);

  return loc;
}

export default AppLocationItemRenderer;
