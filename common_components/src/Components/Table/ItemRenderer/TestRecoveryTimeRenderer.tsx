import React from "react";

interface TimeAgoProps {
  data: {
    lastTestRecoveryTime?: number; // epoch seconds
  };
}

const TimeAgo: React.FC<TimeAgoProps> = ({ data }) => {
  const { lastTestRecoveryTime } = data;

  if (!lastTestRecoveryTime || lastTestRecoveryTime <= 0) {
    return <span>-</span>;
  }
  const eventDate = new Date(lastTestRecoveryTime * 1000);
  const now = new Date();
  // Normalize both to midnight for "calendar day" comparison
  const eventDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffInMs = today.getTime() - eventDay.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  let displayText;
  if (diffInDays === 0) {
    displayText = "Today";
  } else {
    displayText = diffInDays
  }
  return <span>{displayText}</span>;
};

export default TimeAgo;
