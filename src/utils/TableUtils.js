export function getRecoveryVMName(text) {
  if (typeof text !== 'undefined') {
    const parts = text.split(':');
    if (parts.length > 0) {
      return parts[0];
    }
  }
  return text;
}
