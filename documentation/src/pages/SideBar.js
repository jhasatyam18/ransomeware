import React from 'react'
import { Link } from 'react-router-dom';
import logo from '../assets/logo_name.png';
export default function SideBar() {
  const subKeys = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p'];
  const ROUTES = [
    { path: 'introduction', label: 'Introduction', hasChildren: false },
    { path: 'architecture', label: 'Architecture', hasChildren: false },
    { path: 'capabilities', label: 'Capabilities and Benefits', hasChildren: false },
    { path: 'supportmatrix', label: 'Support Matrix', hasChildren: false },
    { path: 'authentication', label: 'Authentication', hasChildren: false },
    { path: 'dashboard', label: 'Dashboard', hasChildren: false },
    {
      path: '', label: 'Nodes', hasChildren: true,
      children: [
        { path: 'nodes', label: 'Configuration', hasChildren: false },
        { path: 'nodeactions', label: 'Actions', hasChildren: false }
      ]
    },
    {
      path: '', label: 'Configure Site', hasChildren: true,
      children: [
        { path: 'createvmwaresite', label: 'VMware Site', hasChildren: false },
        { path: 'createawssite', label: 'AWS Site', hasChildren: false },
        { path: 'creategcpsite', label: 'GCP Site', hasChildren: false },
        { path: 'siteactions', label: 'Actions', hasChildren: false },
      ]
    },
    {
      path: '', label: 'Protection plans', hasChildren: true,
      children: [
        { path: 'protectionplan', label: 'Configuration', hasChildren: false },
        { path: 'protectionactions', label: 'Actions', hasChildren: false },
      ]
    },
    {
      path: '', label: 'Recovery', hasChildren: true,
      children: [
        { path: 'testrecovery', label: 'Test', hasChildren: false },
        { path: 'fullrecovery', label: 'Full', hasChildren: false },
        { path: 'migration', label: 'Migration', hasChildren: false },
      ]
    },
    {
      path: '', label: 'Jobs', hasChildren: true,
      children: [
        { path: 'replicationJobs', label: 'Replication', hasChildren: false },
        { path: 'recoveryJobs', label: 'Recovery ', hasChildren: false },
      ]
    },
    {
      path: '', label: 'Monitor ', hasChildren: true,
      children: [
        { path: 'events', label: 'Events', hasChildren: false },
        { path: 'alerts', label: 'Alerts', hasChildren: false },
        { path: 'reports', label: 'Reports', hasChildren: false },
      ]
    },
    {
      path: '', label: 'Settings ', hasChildren: true,
      children: [
        { path: 'license', label: 'License', hasChildren: false },
        { path: 'email', label: 'Email', hasChildren: false },
        { path: 'throttling', label: 'Throttling', hasChildren: false },
        { path: 'users', label: 'Users', hasChildren: false },
        { path: 'roles', label: 'Roles', hasChildren: false },
        { path: 'sb', label: 'Tech Support', hasChildren: false },
      ]
    },
    { path: 'troubleshooting', label: 'Troubleshooting', hasChildren: false },
  ];
  function renderNode(item, index) {
    return (
      <Link to={item.path}>
        {typeof index !== 'undefined' ? ` ${subKeys[index]}. ` : ''}
        {item.label}
      </Link>
    );
  }

  function renderParent(item) {
    return (
      <ul className='stack__items'>
        {item.label}
        {item.children.map((child, index) => {
          return renderRoutes(child, index)
        })}
      </ul>
    );
  }

  function renderRoutes(item, index) {
    if (item.hasChildren) {
      return renderParent(item, index);
    } else {
      return renderNode(item, index);
    }
  }

  return (
    <div className='stack__items'>
      <div className="logo">
        <img src={logo} />
      </div>
      {ROUTES.map((route) => {
        return renderRoutes(route);
      })}
    </div>
  )
}
