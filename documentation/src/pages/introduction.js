import React from 'react'
import intro from '../assets/intro.PNG';
export default function Introduction() {
  return (
    <div className="content">
      <h2>
        Introduction
      </h2>
      <p>
        Datamotive Workload Mobility product suite delivers a disaster recovery and workload migration service and offers cloud economics to help keep your disaster recovery and migration costs under control.
      </p>
      <p>
        Datamotive Workload Mobility can be used to protect your vSphere virtual machines by replicating them periodically to the cloud and recovering them as needed to a target public cloud platform as a native cloud instance (E.g., protected virtual machine is recovered as a native AWS EC2 instance or a GCP Compute instance).
      </p>
      <p>
        The Datamotive Replication Engine replicates the entire protected VM over to the target platform. This includes the OS, the OS configuration, the registry entries, application and application data, everything inside the VM is replicated. The first replication iteration is a full copy of the VM from the source environment to the target cloud platform. Following iterations, only replicate the changed data from the previously successfully completed replication iterations. Datamotive does not require or need any agents to be deployed or installed on the protected VMs. Each VM is completely treated as a black box by Datamotive. As a result, the enterprises workloads (VMs) require no operational management, nor require any special security configurations. There is also minimal performance impact on the business applications.
      </p>
      <p>
        The Datamotive Replication Engine also enables near instantaneous recovery of the workloads in the target cloud platforms. When the workloads are recovered or migrated in the cloud, they are already in the native cloud platform (AWS EC2 instance or GCP Compute instance formats). No additional conversion or rehydration or seeding is required. Datamotive provides an unprecedented Recovery Time Objective (RTO) of 10 minutes per protected virtual machine. Similarly provided, in the case of Migration, is a Cutover Time Objective (CTO) of 10 minutes per VM with zero data loss.
      </p>
      <p>
        The Datamotive platform currently provides and supports Disaster Recovery and Migration use-cases. Very soon, Datamotive will also be providing and supporting Ransomware Recovery and Rapid Dev/Test Deployments (Cloud Cloning) use-cases.
      </p>
      <img alt="" src={intro} width="80%"></img>
    </div>
  )
}
