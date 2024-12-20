import { AnyAction, Dispatch } from 'redux';

export function fetchByDelay(dispatch: Dispatch<AnyAction>, fun: (args?: any) => AnyAction, delay: number, args?: any): void {
    setTimeout(() => {
        dispatch(fun(args));
    }, delay);
}
