import React, { useState } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Input, Label } from 'reactstrap';
import { Dispatch } from 'redux';
import { UpgradeStepsInterface } from '../../interfaces/upgradeInterfaces';
import { INITIAL_STATE } from '../../interfaces/interfaces';
import { API_UPGRADE_UPLOAD } from '../../Constants/apiConstants';
import { MESSAGE_TYPES } from '../../Constants/MessageConstants';
import { getUrlPath } from '../../utils/apiUtils';
import { valueChange } from '../../store/actions';
import { addMessage } from '../../store/actions/MessageActions';
import ProgressBar from './ProgressBar';
import { TIMER } from '../../Constants/userConstants';

interface Props extends WithTranslation {
    dispatch: Dispatch<any>;
    fileState: string;
    disabled: boolean;
    setdisableUrlInput: () => void;
    uploadedProgress: number;
    upgrade: {
        steps: UpgradeStepsInterface[];
        currentStep: number;
    };
    fileName: string;
}

const UploadFile: React.FC<Props> = (props) => {
    const { t, fileState, dispatch, disabled, setdisableUrlInput, upgrade, uploadedProgress, fileName } = props;
    const { steps, currentStep } = upgrade;
    const [state, setState] = useState<string>(fileState || 'init');
    const [name, setName] = useState<string>(fileName || '');
    const [progress, setProgress] = useState<number>(uploadedProgress || 0);

    const dragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const dragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const dragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const dragDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const { files } = e.dataTransfer;
        setState('uploading');
        setName(files[0].name);
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (!e.target.files || e.target.files.length === 0) {
            return;
        }
        setName(e.target.files[0].name);
        setProgress(0);
        dispatch(valueChange('UI_UPGRADE', ''));
        uploadFile(e.target.files[0]);
    };

    const uploadFile = async (file: any) => {
        if (!file) return;

        const url = getUrlPath(API_UPGRADE_UPLOAD);
        const formData = new FormData();
        formData.append('file', file);
        setState('uploading');
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        setdisableUrlInput();
        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const percentComplete = Math.round((event.loaded / event.total) * 100);
                setProgress(percentComplete);
            }
        };

        xhr.onload = () => {
            if (xhr.status === 200) {
                setTimeout(() => {
                    setState('success');
                    const jsns = JSON.parse(xhr.response);
                    if (jsns.status === 'completed') {
                        const upgArr = [...steps];
                        upgArr[currentStep].state = 'done';
                        upgArr[currentStep + 1].state = 'running';
                    }
                }, TIMER.FIFTEEN_GUNDRED);
            } else {
                dispatch(addMessage(t('upload.file.err'), MESSAGE_TYPES.ERROR));
            }
        };

        xhr.send(formData);
    };

    const renderFileDetails = () => {
        if (state === 'success' || fileState === 'success' || uploadedProgress === 100) {
            return (
                <div className="padding-left-20">
                    <div className="upload__success__info">
                        <Label className="text-center width-100 ">{t('file.details')}</Label>
                        <Label className="text-center width-100">{name || fileName}</Label>
                    </div>
                </div>
            );
        }
        return null;
    };

    const renderValidating = () => {
        if (state !== 'validating' && state !== 'uploading') {
            return null;
        }
        return (
            <div className="w-100" style={{ padding: '8px 15px' }}>
                <ProgressBar completed={progress} />
            </div>
        );
    };

    const renderUpload = () => {
        let msg = state === 'validating' ? t('template.validating') : t('template.drag.file');
        msg = state === 'uploading' ? 'Uploading Template file' : msg;
        return (
            <>
                <div className={`upload__icon`} onDragOver={dragOver} onDragEnter={dragEnter} onDragLeave={dragLeave} onDrop={dragDrop}>
                    <label htmlFor="fileUpload" className={`label ${!disabled ? 'disabled' : ''}`}>
                        <i className="fas fa-cloud-upload-alt fa-2x" />
                    </label>
                    <Input type="file" except=".gz" id="fileUpload" name="fileUpload" className="modal-file-upload" onChange={onFileChange} disabled={!disabled} />
                </div>
                <span>{msg}</span>
            </>
        );
    };

    return (
        <>
            <div className={`upload__form upload__${state} ${!disabled ? 'disabled' : ''}`}>
                {renderUpload()}
                {renderValidating()}
                {renderFileDetails()}
            </div>
        </>
    );
};

function mapStateToProps(state: INITIAL_STATE) {
    const { user } = state;
    return { user };
}
export default connect(mapStateToProps)(withTranslation()(UploadFile));
