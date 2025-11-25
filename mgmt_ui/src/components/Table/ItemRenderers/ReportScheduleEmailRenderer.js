import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ReportScheduleEmailRenderer = ({ data, field }) => {
  const [showAll, setShowAll] = useState(false);
  if (!data || !data[field]) {
    return <span>-</span>;
  }
  const emails = (data[field] || '').split(',').map((e) => e.trim()).filter(Boolean);
  if (emails.length === 0) {
    return <span>-</span>;
  }
  const visibleEmails = showAll ? emails : emails.slice(0, 2);
  const remainingCount = emails.length - 2;

  return (
    <div className="space-y-1">
      {visibleEmails.map((email, idx) => (
        <div key={`${idx + 1}`} className="text-sm text-white">
          {email}
        </div>
      ))}

      {remainingCount > 0 && (
        <Link onClick={() => setShowAll(!showAll)} className="text-xs text-blue-400 hover:underline mt-1 d-inline-block" style={{ marginLeft: '80%' }}>
          {showAll ? 'Show less' : 'show more'}
        </Link>
      )}
    </div>
  );
};

export default ReportScheduleEmailRenderer;
