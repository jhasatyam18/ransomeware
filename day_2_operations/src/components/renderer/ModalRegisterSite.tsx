import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Form } from 'reactstrap';
import { FIELD_TYPE, MESSAGE_TYPES } from '../../constants/userConstant';
import { INITIAL_STATE_INTERFACE, UserInterface, ModalData } from '../../interfaces/interface';
import { modalClose } from '../../store/actions/ModalAction';
import DMFieldText from '../shared/DMFieldText';
import { configureSite } from '../../store/actions/siteAction';
import { getValue } from '../../utils/apiUtils';
import { FIELDS } from '../../constants/FieldsConstant';
import { validateConfigureSite } from '../../utils/ValidationUtils';
import { addMessage } from '../../store/reducers/messageReducer';
import DMFieldNumber from '../shared/DMFieldNumber';

interface ModalProps {
    dispatch: any;
    user: UserInterface;
    modal: ModalData;
    sites: any;
}

interface Site {
    id: string;
    name: string;
    hostName: string;
    location: string;
    platformType: string;
    userName: string;
    password: string;
}
interface SitePayload {
    id?: string; // Optional because it's only there in 'edit' mode
    name: string;
    hostname: string;
    username: string;
    password: string;
    mgmtPort: number;
}

const ModalRegisterSite: React.FC<ModalProps> = ({ user, dispatch, modal, sites }) => {
    const { options } = modal;
    const { values } = user;
    const { isEdit } = options;
    const selectedSites: Record<string, Site> = sites.selectedSites;
    const fields = Object.keys(FIELDS).filter((key) => key.indexOf('configureSite') !== -1);
    const port = { label: 'Port', type: FIELD_TYPE.NUMBER, defaultValue: 5000, min: 1, max: 65536, errorMessage: 'Port value required', fieldInfo: 'info.node.mgmt.port' };

    const onConfigureSite = () => {
        const payload: SitePayload = {
            name: getValue({ key: 'configureSite.name', values }),
            hostname: getValue({ key: 'configureSite.hostName', values }),
            username: getValue({ key: 'configureSite.userName', values }),
            password: getValue({ key: 'configureSite.password', values }),
            mgmtPort: getValue({ key: 'configureSite.port', values }),
        };
        if (validateConfigureSite(user, dispatch)) {
            if (isEdit) {
                const selectedSite: Site | undefined = Object.values(selectedSites)[0]; // Assuming there's at least one
                if (selectedSite) {
                    payload.id = selectedSite.id; // Now TypeScript's cool with this
                }
                dispatch(configureSite(payload, true));
            } else {
                dispatch(configureSite(payload, false));
            }
        } else {
            dispatch(addMessage({ message: 'All field is mandatory', messageType: MESSAGE_TYPES.ERROR, isSticky: false }));
        }
    };

    const renderFooter = () => {
        return (
            <div className="modal-footer mr-3">
                <button type="button" className="btn btn-secondary " onClick={onClose}>
                    Close{' '}
                </button>
                <button type="button" className="btn btn-success " onClick={onConfigureSite}>
                    Register{' '}
                </button>
            </div>
        );
    };

    const onClose = () => {
        dispatch(modalClose());
    };
    return (
        <>
            <Form className="modal-body">
                {fields.map((key: any) => (
                    <DMFieldText dispatch={dispatch} user={user} fieldKey={key} field={FIELDS[key as keyof typeof FIELDS]} key={key} />
                ))}
                <DMFieldNumber dispatch={dispatch} user={user} fieldKey="configureSite.port" field={port} />
            </Form>
            {renderFooter()}
        </>
    );
};

// export default Node;
function mapStateToProps(state: INITIAL_STATE_INTERFACE) {
    const { user, sites } = state;
    return {
        user,
        sites,
    };
}

export default connect(mapStateToProps)(withTranslation()(ModalRegisterSite));
