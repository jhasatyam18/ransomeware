import React from "react";
import { ROUTE_CONSTANTS } from "../../../Constants/InputConstants";

interface SiteLinkRendererProps {
  data: any;
  field: string;
}

const SiteLinkRenderer: React.FC<SiteLinkRendererProps> = ({ data, field }) => {
  let hostName, mgmtPort, name;
   switch (field) {
     case "name":
       ({ hostName, mgmtPort, name } = data);
       break;
     case "siteName":
       ({ hostName, mgmtPort, name } = data.site);
       break;
     default:
       return <p>-</p>
   }

  return (
    <a
      href={`https://${hostName}:${mgmtPort}${ROUTE_CONSTANTS.MGMT}/sites`}
      key={`site-link-${hostName}-${data.id}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {name}
    </a>
  );
};

export default SiteLinkRenderer;
