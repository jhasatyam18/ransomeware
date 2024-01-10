import React from 'react';

export default function RoleItemRenderer({ data }) {
  const { role } = data;
  return (
    <div>
      {role.name}
    </div>
  );
}
