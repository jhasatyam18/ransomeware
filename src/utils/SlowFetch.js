// time-delayed function
export function fetchByDelay(dispatch, fun, delay) {
  setTimeout(
    () => {
      dispatch(fun());
    },
    delay,
  );
}
