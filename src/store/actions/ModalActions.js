import * as Types from '../../constants/actionTypes';
import { clearValues } from './UserActions';

export function closeModal(clearValue) {
  return (dispatch, getState) => {
    let { modal } = getState();
    modal = modal.splice(0, modal.length - 1);
    dispatch(modalClose(modal));
    if (clearValue) {
      dispatch(clearValues());
    }
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

export function modalClose(updatedModal) {
  return {
    type: Types.CLOSE_MODAL,
    updatedModal,
  };
}
