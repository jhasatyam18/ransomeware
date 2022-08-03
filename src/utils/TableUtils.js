export function getRecoveryVMName(text) {
  const vmArray = [];
  if (typeof text !== 'undefined') {
    // if multiple vms their in test or full recovery then the'll come in comma separated format
    const parts = text.split(',');
    if (parts.length > 0) {
      for (let i = 0; i < parts.length; i += 1) {
        // if we split it by collon then in first index tehir would be vms name
        parts[i] = parts[i].split(':');
        vmArray.push(parts[i][0]);
        if (i !== parts.length - 1) {
          vmArray.push(' , ');
        }
      }
      return vmArray;
    }
  }
  return text;
}
