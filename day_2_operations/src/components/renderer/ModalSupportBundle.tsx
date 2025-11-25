import React, { ChangeEvent, useState } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Card, CardBody, Container, Form, Input } from 'reactstrap';
import { getCookie } from '../../utils/apiUtils';
import { generateSupportBundle } from '../../store/actions/SupportActions';
import { closeModal } from '../../store/reducers/ModalReducer';
import { APPLICATION_API_USER } from '../../constants/userConstant';
import { ModalData, UserInterface } from '../../interfaces/interface';

interface ModalProps {
    dispatch: any;
    user: UserInterface;
    modal: ModalData;
}

const ModalSupportBundle: React.FC<WithTranslation & ModalProps> = ({ t, dispatch }) => {
    const [description, setDescription] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        setDescription(e.target.value);
        setError('');
    };

    const onClose = (): void => {
        dispatch(closeModal());
    };

    const onBundleCreate = (): void => {
        const user = getCookie(APPLICATION_API_USER);
        if (description.trim().length === 0) {
            setError('Required, message for support bundle generation.');
            return;
        }
        const payload = { description, generatedBy: user };
        dispatch(generateSupportBundle(payload));
        dispatch(closeModal());
    };

    return (
        <>
            <Container>
                <Card>
                    <CardBody>
                        <Form>
                            <div className="form-group row">
                                <div className="col-sm-12">
                                    <Input type="textarea" placeholder="Description for support bundle generation" className="form-control" id="description-input" value={description} autoComplete="off" onChange={handleChange} maxLength={80} />
                                    {error.length > 0 ? <span className="error">{error}</span> : null}
                                </div>
                            </div>
                        </Form>
                    </CardBody>
                </Card>

                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>
                        {t ? t('Close') : 'Close'}
                    </button>
                    <button type="button" className="btn btn-success" onClick={onBundleCreate}>
                        {t ? t('Generate Bundle') : 'Generate Bundle'}
                    </button>
                </div>
            </Container>
        </>
    );
};

export default withTranslation()(ModalSupportBundle);
