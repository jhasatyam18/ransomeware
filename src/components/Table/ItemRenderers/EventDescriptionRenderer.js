import React from 'react';

function EventDescriptionRenderer({ data }) {
  const resp = data.description;
  return (
    <p className="text-break">
      {resp}
    </p>
  );
}

export default EventDescriptionRenderer;
