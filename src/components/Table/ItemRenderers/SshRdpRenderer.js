import React from 'react';
import { getValue } from '../../../utils/InputUtils';
import { JOB_COMPLETION_STATUS } from '../../../constants/AppStatus';
// TODO: CURRENT LOGIC IS FOR ALPHA RELEASE ONLY
// THIS NEED TO REVERT BACK, BACK_END NEED TO PROVIDE THE OS TYPE II RESPONSE
// TO AVOID THE EXTENSIVE UI LEVEL FILTERING
function SshRdpRenderer({ data, user }) {
  if (data && data.vmName && user) {
    if (data.status && data.status === JOB_COMPLETION_STATUS && data.publicIP && data.protectionPlanID) {
      const { values } = user;
      const drPlans = getValue('ui.values.drplan', values);
      const plans = drPlans || [];
      if (plans) {
        // get drplan byid
        const drPlan = plans.filter((plan) => plan.id === data.protectionPlanID);
        if (drPlan && drPlan.length > 0) {
          // get plan vms
          const { protectedEntities } = drPlan[0];
          const { virtualMachines } = protectedEntities;
          if (virtualMachines) {
            const vm = virtualMachines.filter((v) => v.name === data.vmName);
            if (vm && vm.length > 0 && vm[0].guestOS) {
              // identify os type
              const isWin = (vm[0].guestOS.toLowerCase().indexOf('window') !== -1);
              if (isWin) {
                const d = `charset=utf-8,${encodeURIComponent(`full address:s:${data.publicIP}`)}`;
                return (
                  <div className="row">
                    <div className="col-sm-8">
                      {data.publicIP}
                    </div>
                    <div className="col-sm-4">
                      <a download={`${data.vmName}.rdp`} href={`data:${d}`} title="Download rdp file.">
                        <i className="fa fa-download" />
                      </a>
                    </div>
                  </div>
                );
              }
              return (
                <div>
                  { data.publicIP}
                </div>
              );
            }
          }
        }
      }
      return (
        <div>
          -
        </div>
      );
    }
  }
  return (
    <div>
      -
    </div>
  );
}

export default SshRdpRenderer;
