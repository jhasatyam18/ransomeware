import React from "react";
import { ROUTE_CONSTANTS } from "../../../Constants/InputConstants";
 
 interface SiteLinkRendererProps {
   data: any;
   field: string;
 }
 
 const ProtectionPlanNameRenderer: React.FC<SiteLinkRendererProps> = ({ data, field }) => {

   if (!data || !data[field]) {
     return <p>-</p>;
   }
   const { sourcePlanID, sourceSite } = data.protectionPlan ?? data;
   const { hostName, mgmtPort } = sourceSite ?? {};
   let name = data[field];

   if(!hostName || !mgmtPort || !sourcePlanID) {
    return <p>{name}</p>;
   }
 
   return (
     <a
       href={`https://${hostName}:${mgmtPort}${ROUTE_CONSTANTS.MGMT}/protection/plan/details/${sourcePlanID}`}
       key={`plan-link-${hostName}-${data.id}`}
       target="_blank"
       rel="noopener noreferrer"
     >
       {name}
     </a>
   );
 };
 
 export default ProtectionPlanNameRenderer;