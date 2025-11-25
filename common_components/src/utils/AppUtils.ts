export function formatTime(seconds: number): string {
    const day = Math.floor(seconds / (3600 * 24));
    const hour = Math.floor(seconds % (3600 * 24) / 3600);
    const min = Math.floor(seconds % 3600 / 60);
    const sec = Math.floor(seconds % 60);
  
    if (day > 0) {
      if (hour > 0) {
        if (min > 0) {
          if (sec > 0) {
            return (`${day}d ${hour}h ${min}m ${sec}s`);
          }
          return (`${day}d ${hour}h ${min}m`);
        }
        return (`${day}d ${hour}h`);
      }
      return (`${day}d`);
    }
    if (hour > 0) {
      if (min > 0) {
        if (sec > 0) {
          return (`${hour}h ${min}m ${sec}s`);
        }
        return (`${hour}h ${min}m`);
      }
      return (`${hour}h`);
    }
    if (min > 0) {
      if (sec > 0) {
        return (`${min}m ${sec}s`);
      }
      return (`${min}m`);
    }
    if (sec > 0) {
      return ` ${sec}s`;
    }
    return '-';
  }

  
export function getValue({ key, values }: any) {
  return values[key];
}