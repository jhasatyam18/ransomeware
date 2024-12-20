import React from 'react';
import { connect } from 'react-redux';
import ModalRenderer from '../Components/renderer/ModalRenderer';
import { ModalData } from '../interfaces/interfaces';

// Define the prop types for the component
interface ModalContainerProps {
    modal: Record<string, any>;
    dispatch: any;
    user: any;
}

const ModalContainer: React.FC<ModalContainerProps> = ({ modal, dispatch, user }) => {
    if (!modal || modal.length === 0) {
        return null;
    }
    return (
        <>
            {modal.map((modelKey: ModalData, index: number) => (
                <ModalRenderer key={index} dispatch={dispatch} modal={modelKey} user={user} />
            ))}
        </>
    );
};

// Map state to props
const mapStateToProps = (state: any) => {
    const { modal, user, dispatch } = state;
    return { modal, user, dispatch };
};

// Connect the component
const connector = connect(mapStateToProps);

export default connector(ModalContainer);
