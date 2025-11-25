import * as Types from '../../constants/actionTypes';

export function closeWizard() {
  return {
    type: Types.CLOSE_WIZARD,
  };
}

export function openWizard(options = {}, steps = []) {
  return {
    type: Types.OPEN_WIZARD,
    options,
    steps,
  };
}
