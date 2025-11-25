import React from 'react';
import { useNavigate } from 'react-router-dom';
interface WithRouterProps {
    history?: any;
}

// Define a generic type for the component that will be wrapped
type ComponentType<P> = React.ComponentType<P>;

// Define the withRouter HOC function
const withRouter = <P extends object>(Component: ComponentType<P & WithRouterProps>): React.FC<P> => {
    const Wrapper: React.FC<P> = (props) => {
        const history = useNavigate();

        return <Component history={history} {...(props as P)} />;
    };

    return Wrapper;
};

export default withRouter;
