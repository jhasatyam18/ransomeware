import React from 'react';

export default function RoleItemRenderer({ data }) {
  const { roles = [] } = data;
  let displayValue = '';
  roles.forEach((role) => {
    if (displayValue.length > 1) {
      displayValue = `${displayValue}, ${role.name}`;
    } else {
      displayValue = role.name;
    }
  });
  return (
    <div>
      {displayValue}
    </div>
  );
}
