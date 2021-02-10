// time-delayed function
export function fetchByDelay(dispatch, fun, delay, args) {
  setTimeout(
    () => {
      dispatch(fun(args));
    },
    delay,
  );
}
