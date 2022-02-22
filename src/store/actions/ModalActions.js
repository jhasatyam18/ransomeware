import * as Types from '../../constants/actionTypes';

export function closeModal() {
  return {
    type: Types.CLOSE_MODAL,
  };
}

export function openModal(content, options = {}, showFooter = true) {
  return {
    type: Types.OPEN_MODAL,
    content,
    options,
    showFooter,
  };
}
