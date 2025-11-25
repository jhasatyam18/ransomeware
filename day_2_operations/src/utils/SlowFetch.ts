import { AnyAction, Dispatch } from 'redux';

export function fetchByDelay(dispatch: Dispatch<AnyAction>, fun: (args?: any) => any, delay: number, args?: any): void {
    setTimeout(() => {
        dispatch(fun(args));
    }, delay);
}
