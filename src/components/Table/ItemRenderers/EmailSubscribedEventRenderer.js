import React from 'react';

function EmailSubscribedEventRenderer({ data }) {
  let events = '';
  if (data.subscribedEvents && data.subscribedEvents.length > 0) {
    events = data.subscribedEvents.split(',').join(', ');
  }
  return (
    <div style={{ width: 'calc(100% - 10px)', wordWrap: 'break-word', whiteSpace: 'normal', overflowWrap: 'break-word' }}>
      {events}
    </div>
  );
}

export default EmailSubscribedEventRenderer;
