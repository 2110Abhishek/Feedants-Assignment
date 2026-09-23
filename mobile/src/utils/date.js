/**
 * Date formatting helpers matching screenshot specification
 */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

export const formatDate = (dateInput) => {
  if (!dateInput) return { dateStr: '--', timeStr: '--' };
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return { dateStr: '--', timeStr: '--' };

  const day = d.getDate();
  const month = MONTHS[d.getMonth()];
  const year = d.getFullYear().toString().slice(-2); // e.g. 26

  let hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours.toString().padStart(2, '0') : '12';

  return {
    dateStr: `${day} ${month} ${year}`,
    timeStr: `${hours}:${minutes} ${ampm}`,
  };
};

export const calculateCountdown = (targetDateStr, serverOffsetMs = 0) => {
  if (!targetDateStr) {
    return { days: '00', hours: '00', minutes: '00', seconds: '00', totalSeconds: 0, isExpired: true };
  }

  const targetTime = new Date(targetDateStr).getTime();
  const currentTime = Date.now() + serverOffsetMs;
  const diffMs = targetTime - currentTime;

  if (diffMs <= 0) {
    return { days: '00', hours: '00', minutes: '00', seconds: '00', totalSeconds: 0, isExpired: true };
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    days: days.toString().padStart(2, '0'),
    hours: hours.toString().padStart(2, '0'),
    minutes: minutes.toString().padStart(2, '0'),
    seconds: seconds.toString().padStart(2, '0'),
    totalSeconds,
    isExpired: false,
  };
};
