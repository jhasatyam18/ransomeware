import React from 'react'
import pList from '../assets/protectionPlanList.PNG'
import cpgeneral from '../assets/cpgeneral.PNG'
import vmList from '../assets/vmList.PNG'
import awsNet from '../assets/awsNet.PNG'
import ppBootOrder from '../assets/ppBootOrder.PNG'
import cpReplicationConfig from '../assets/cpReplicationConfig.PNG'
import cpScripts from '../assets/cpScripts.PNG'
import cpSummary from '../assets/cpSummary.PNG'
import cpRecovery from '../assets/recoveryConfig.PNG';
import scriptInput from '../assets/scriptInput.PNG';

export default function ProtectionPlan() {
    return (
        <div className="content">
            <h2>Protection Plan</h2>
            <b>Navigation:</b> Home &gt; Configuration &gt; Protection Plans
            <p>Protection plan consists of a group of workloads which will be replicated from source to destination sites </p>
            <img src={pList} />

            <h4>Configure new protection plan</h4>
            <b>Prerequisite - VMware platform:</b>
            <p>1. VMware tools need to be installed in all the Virtual Machines which need to be protected.</p>
            2. CBT (Change block tracking) need to enable for all the Virtual Machines and their disks.
            <p>To create a new protection plan, click on + New button in protection plan list, create protection plan wizard is shown. Follow the guided steps to configure protection plan.</p>

            <h4>General</h4>
            <div className="grid-key-value">
                <div className="key">Name</div>
                <div className="value">Name of the protection plan.</div>
            </div>
            <div className="grid-key-value">
                <div className="key">Protect Site</div>
                <div className="value">Source protection site.</div>
            </div>
            <div className="grid-key-value">
                <div className="key">Recovery Site</div>
                <div className="value">Destination recovery site.</div>
            </div>

            <img src={cpgeneral} style={{ width: "75%", height: "75%" }} />

            <h4>Virtual Machines </h4>
            <p>Select the virtual machines to be protect and click next. Use search & pagination to find virtual machines. </p>
            <img src={vmList} style={{ width: "75%", height: "75%" }} />

            <h4>Recovery Configuration </h4>
            <p>Provide the virtual machine specific recover configuration which will be used for creation of instance on recovery site.  </p>
            <img src={cpRecovery} style={{ width: "75%", height: "75%" }} />
            <h4>General</h4>
            <div className="grid-key-value">
                <div className="key">Instance Type</div>
                <div className="value">Instance type on cloud site - Example t2.micro on AWS or n1-standard-1 on GCP. </div>
            </div>
            <div className="grid-key-value">
                <div className="key">Volume Type</div>
                <div className="value">Instance volume type on cloud site - Example GP-2 on AWS or standard on GCP. </div>
            </div>
            <div className="grid-key-value">
                <div className="key">Volume IOPS</div>
                <div className="value">IOPs value for supported Volume Types. Please note that the IOPs values are submitted 		for volume creation without validations. So make sure that all the rules specific to 		selected volume type are followed while specifying the IOPs value</div>
            </div>
            <div className="grid-key-value">
                <div className="key">Tags</div>
                <div className="value">Instance tags.</div>
            </div>

            <h4>Network</h4>
            <div className="grid-key-value">
                <div className="key">IP Address</div>
                <div className="value">For instance, network configuration click on config button, will open a network configuration popup window.</div>
            </div>
            <div className="grid-col-1">
                <div className="key">For AWS platform provided the following details </div>
            </div>
            <div className="grid-key-value">
                <div className="key">Subnet</div>
                <div className="value">subnet ID which will assigned to the instances in this protection plan.</div>
            </div>
            <div className="grid-key-value">
                <div className="key">Public</div>
                <div className="value">Click on the checkbox if you want to auto assign a public Ip to instance.
                    <span>Note - only one network card can be configured if public Ip is enabled. </span></div>
            </div>
            <div className="grid-key-value">
                <div className="key">Elastic IP</div>
                <div className="value">Select from allocated elastic IP address pool if any.</div>
            </div>
            <div className="grid-key-value">
                <div className="key">Private IP</div>
                <div className="value">Provide the internal IP address for the instance or leave blank for auto assignment.
                    <span>(Please ensure to specify Private IP in the same range as that of given Subnet)</span></div>
            </div>
            <div className="grid-key-value">
                <div className="key">Security Groups</div>
                <div className="value">Select the security groups all configure inbound and outbound traffic for the instance. </div>
            </div>
            <img src={awsNet} style={{ width: "75%", height: "75%" }} />

            <div className="grid-col-1">
                <div className="key">For GCP platform provided the following details </div>
            </div>
            <div className="grid-key-value">
                <div className="key">Subnet</div>
                <div className="value">subnet ID which will assigned to the instances in this protection plan.</div>
            </div>
            <div className="grid-key-value">
                <div className="key">Private IP</div>
                <div className="value">Provide the internal IP address for the instance or leave blank for auto assignment.</div>
            </div>
            <div className="grid-key-value">
                <div className="key">External IP</div>
                <div className="value">Select one of the following options if external Ip address is required for the selected network card else select none.
                    <ol>
                        <li> Auto: gcp will assign a Ip address from its public Ip pool. </li>
                        <li>None: select if external not required. </li>
                        <li>Reserved IP address, GCP project reserved Ip address, will be listed along with 			above two options. You can select any reserved Ip address from the list. </li>
                    </ol>
                </div>
            </div>
            <div className="grid-key-value">
                <div className="key">Network Tire</div>
                <div className="value">Network Service Tiers lets you optimize connectivity between systems on the internet 		and your Google Cloud instances. Premium Tier delivers traffic on Google's premium 		backbone, while Standard Tier uses regular ISP networks  </div>
            </div>
            <div className="grid-key-value">
                <div className="key">Firewall Tags</div>
                <div className="value">The target tag defines the Google Cloud VMs to which the rule applies. </div>
            </div>
            <h4>Scripts </h4>
            <p>Datamotive supports executing custom scripts on recovery of individual virtual machine and complete protection plan as well. Datamotive supports both, Pre & Post scripts. The scripts are executed on the Datamotive management node. To use pre or post scripts, first upload the pre & post scripts to Datamotive management node on recovery site at /opt/dmservice/prescript & /opt/dmservice/postscript respectively. Once these scripts are uploaded, they will start showing up in drop down menu of scripts in create & update protection plan wizard. Once configured, the scripts will get invoked as below.</p>
            <div className="grid-key-value">
                <div className="key">Pre</div>
                <div className="value"><p>Script will run before Datamotive executes recovery workflow for a VM when configured as a VM pre-script and before recovery of protection plan when configured as Protection Plan pre-script. Typically, this script should take care of infrastructure configurations required for the virtual machine to come up. E.g. configuring firewall rules for this VM, creating domains for authentication etc.</p></div>
            </div>
            <div className="grid-key-value">
                <div className="key">Post</div>
                <div className="value"><p>Script will run after the entity is recovered when configured as VM post-script and after Protection Plan recovery when configured as Protection Plan post-script. Typically, this script should take care of recovered entity specific configurations. E.g. Configuring application properties with new internal IPs etc.</p> </div>
            </div>
            <div className="grid-key-value">
                <div className='key'>Scripts Input:</div>
                <div className='value'>
                    <p>
                        Currently, Datamotive supports only shell scripts for execution. In future, binding for different languages will be provided. On invocation the script is provided with following parameters in the order.
                    </p>
                    <ul>
                        <li>Pre-script: None</li>
                        <li>Post-script: JSON string with following format
                            <img src={scriptInput} />
                        </li>
                    </ul>
                </div>
            </div>
            <div className="grid-key-value">
                <div className='key'>Scripts Output:</div>
                <div className='value'>
                    <p>
                        The scripts are checked for it's completion and the process exit status is captured. If there are no errors in executing the script, Datamotive considers it to be successfully executed. If there are errors, the recovery is marked as Partially Completed.
                    </p>
                </div>
            </div>
            <h4>Boot Order  </h4>
            <p>Using boot order configuration defines the boot delay and virtual machine boot order. </p>
            <div className="grid-key-value">
                <div className="key">Boot Delay</div>
                <div className="value">Delay in seconds between virtual machines specified in the boot order</div>
            </div>
            <div className="grid-key-value">
                <div className="key">Boot Order</div>
                <div className="value">Order in which virtual machines will get recovered or migrated. </div>
            </div>
            <img src={ppBootOrder} style={{ width: "75%", height: "75%" }} />

            <h4>Replication Configuration</h4>
            <div className="grid-key-value">
                <div className="key">Start Time</div>
                <div className="value">Time from when protection plan replication will start.</div>
            </div>
            <div className="grid-key-value">
                <div className="key">Replication interval</div>
                <div className="value">Time interval in which the virtual machine changed data will be replicated. </div>
            </div>
            <div className="grid-key-value">
                <div className="key">Encryption On Wire</div>
                <div className="value">Data encryption while transferring from source to destination. </div>
            </div>
            <div className="grid-key-value">
                <div className="key">Compression</div>
                <div className="value">Data compression while transferring from source to destination. </div>
            </div>
            <div className="grid-key-value">
                <div className="key">Dedupe</div>
                <div className="value"> Enables the data deduplication.
                    <span>Note: Deduplication node should be pre-configured on recovery site before using this feature.</span></div>
            </div>
            <div className="grid-key-value">
                <div className="key">Differential Reverse Replication</div>
                <div className="value">nable this feature if you want to allow recovered machines from the 			recovery site to replicate back to its original source site.  </div>
            </div>
            <img src={cpReplicationConfig} style={{ width: "75%", height: "75%" }} />

            <h4>Scripts </h4>
            <div className="grid-key-value">
                <div className="key">Pre Script</div>
                <div className="value"> Pre scripts which will run before recovery workflow for this protection plan. </div>
            </div>
            <div className="grid-key-value">
                <div className="key">Post Scrip</div>
                <div className="value"> Post scripts which will run after all the instances are recovered on recovery site.
                    For details, refer to Scripts section above
                </div>
            </div>
            <img src={cpScripts} style={{ width: "75%", height: "75%" }} />

            <h4>Summary  </h4>
            <p>Review the summary for the protection plan and click finish to configure the protection plan. On successful configuration, replication jobs will start for the virtual machines selected for this protection plan. </p>
            <img src={cpSummary} style={{ width: "75%", height: "75%" }} />
        </div>
    )
}
