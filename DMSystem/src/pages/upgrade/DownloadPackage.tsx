import React, { useEffect, useRef, useState } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Col, Input, Label, Row } from 'reactstrap';
import { RendererProps } from '../../interfaces/upgradeInterfaces';
import { API_GET_UPGRADE_DOWNLOAD, API_UPGRADE_UPLOAD } from '../../Constants/apiConstants';
import { FIELD_TYPE } from '../../Constants/FielsConstants';
import { MESSAGE_TYPES } from '../../Constants/MessageConstants';
import { IN_PROGRESS } from '../../Constants/statusConstant';
import { STATIC_KEYS } from '../../Constants/userConstants';
import { callAPI, getUrlPath } from '../../utils/apiUtils';
import { getValue } from '../../utils/inputUtils';
import { addErrorMessage, hideApplicationLoader, showApplicationLoader, valueChange } from '../../store/actions';
import { addMessage } from '../../store/actions/MessageActions';
import { addUpgradeStep, clearUpgrade, goToNextStep, setCurrentUpgradeStep } from '../../store/actions/upgradeAction';
import ActionButton from '../../Components/Shared/ActionButton';
import DMText from '../../Components/Shared/DMText';
import ProgressBar from '../../Components/Shared/ProgressBar';

const DownloadPackages: React.FC<RendererProps & WithTranslation> = (props) => {
    const { dispatch, upgrade, user, t } = props;
    const { currentStep, steps } = upgrade;
    const { values } = user;
    let uploadUrl = getValue('UI.UPGRADE', values);
    const [progress, setProgress] = useState<number>(0);
    const [showProgress, setShowProgress] = useState<boolean>(false);
    const [state, setState] = useState<string>('init');
    const [name, setName] = useState<string>('');
    const [file, setFile] = useState<File | null>(null);
    const [fileUploadErro, setFileUploaError] = useState<string>('');
    const timerId = useRef<number | null>(null);
    const disableUpload = showProgress || state === 'validating' || state === 'uploading';
    const xhr = new XMLHttpRequest();
    let xhrRef = useRef<XMLHttpRequest | null>(null);
    const inputField = {
        label: '',
        errorMessage: '',
        placeHolderText: 'Please provide package url to upload',
        shouldShow: true,
        type: FIELD_TYPE.TEXT,
        hideLabel: true,
        onChange: () => setdisableUrlInput(),
        disabled: progress > 0,
    };
    useEffect(() => {
        getDownloadUpgradeProgress(undefined);
        return () => {
            setProgress(0);
            setName('');
            setState('init');
            dispatch(valueChange('UI.UPGRADE', ''));
            setShowProgress(false);
            if (timerId.current !== null) {
                clearInterval(timerId.current);
            }
            if (xhrRef.current) {
                xhrRef.current.abort(); // Abort the request if it's still in progress
            }
        };
    }, []);

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

    const upgradeThroughFile = () => {
        const arr = [...steps];
        arr[currentStep].doNotShoNextLabel = true;
        dispatch(addUpgradeStep(arr));
        uploadFile(file);
        dispatch(valueChange('UI.UPGRADE', ''));
        setShowProgress(true);
        setProgress(0);
        setFileUploaError('');
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        dispatch(valueChange('UI.UPGRADE', ''));
        if (!e.target.files || e.target.files.length === 0) {
            return;
        }
        setName(e.target.files[0].name);
        setFile(e.target.files[0]);
        setShowProgress(false);
    };

    const uploadFile = async (file: any | undefined) => {
        const url = getUrlPath(API_UPGRADE_UPLOAD);
        const formData = new FormData();
        setFileUploaError('');
        if (file && !uploadUrl) {
            formData.append('file', file);
            setState('uploading');
        } else if (!file && uploadUrl) {
            setProgress(0);
            setName('');
            formData.append('downloadURL', uploadUrl);
            dispatch(showApplicationLoader('upload', 'Uploading...'));
        }
        xhrRef.current = xhr;
        xhr.open('POST', url, true);
        if (!uploadUrl && file) {
            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const percentComplete = Math.round((event.loaded / event.total) * 100);
                    setProgress(percentComplete);
                    if (percentComplete === 100) {
                        dispatch(showApplicationLoader('upload', 'Uploading...'));
                    }
                }
            };
        }
        xhr.onload = () => {
            if (xhr.status === 200) {
                dispatch(hideApplicationLoader('upload'));
                setTimeout(() => {
                    setState('success');
                    const jsns = JSON.parse(xhr.response);
                    if (jsns.status === 'completed') {
                        const arr = [...steps];
                        arr[currentStep].doNotShoNextLabel = false;
                        steps[currentStep].state = 'done';
                        dispatch(addUpgradeStep(arr));
                        dispatch(setCurrentUpgradeStep(currentStep + 1));
                    } else if (jsns.status === 'failed') {
                        dispatch(addErrorMessage(jsns.failureMessage, MESSAGE_TYPES.ERROR));
                        return;
                    } else if (jsns.status === 'in-progress' && uploadUrl && !file) {
                        getDownloadUpgradeProgress(true);
                        setState('init');
                        if (!showProgress) {
                            setShowProgress(true);
                        }
                    }
                    dispatch(hideApplicationLoader('upload'));
                }, 1000);
            } else if (xhr.status === 400 || xhr.status !== 200) {
                dispatch(hideApplicationLoader('upload'));
                setProgress(0);
                setName('');
                setState('init');
                dispatch(valueChange('UI.UPGRADE', ''));
                setShowProgress(false);
                if (file && !uploadUrl) {
                    setFileUploaError(JSON.parse(xhr.responseText));
                }
                dispatch(addMessage(JSON.parse(xhr.responseText), MESSAGE_TYPES.ERROR));
            }
        };
        xhr.onerror = () => {
            dispatch(hideApplicationLoader('upload'));
            setProgress(0);
            setName('');
            setShowProgress(false);
            setState('init');
            dispatch(valueChange('UI.UPGRADE', ''));
            if (file && !uploadUrl) {
                setFileUploaError(JSON.parse(xhr.responseText));
            }
            dispatch(addMessage(JSON.parse(xhr.responseText), MESSAGE_TYPES.ERROR));
        };
        xhr.send(formData);
    };

    const renderFileDetails = () => {
        if (state === 'success') {
            return (
                <div className="padding-left-20">
                    <div className="upload__success__info">
                        <Label className="text-center width-100 ">{t('file.details')}</Label>
                        <Label className="text-center width-100">{name}</Label>
                    </div>
                </div>
            );
        }
        return null;
    };

    const renderUpload = () => {
        let msg = state === 'validating' ? t('template.validating') : t('template.drag.file');
        msg = state === 'uploading' ? 'Uploading upgrade package' : msg;
        return (
            <Row>
                <Col sm={12} className={`mr-4 ${state === 'uploading' || showProgress ? 'disabled' : ''}`}>
                    <div className={`upload__icon ${state === 'uploading' ? 'text-info' : ''} d-flex justify-content-center `} onDragOver={dragOver} onDragEnter={dragEnter} onDragLeave={dragLeave} onDrop={dragDrop}>
                        <label
                            htmlFor="fileUpload"
                            className={`label`}
                            role="button"
                            onClick={() =>
                                setTimeout(() => {
                                    setFileUploaError('');
                                }, 1000)
                            }
                        >
                            <i className="fas fa-cloud-upload-alt fa-1x mr-2" />
                            {fileUploadErro ? (
                                <span style={{ fontSize: '0.8rem', fontWeight: '300' }} className={`text-warning mt-2 font-bold`}>{`File upload failed due to ${fileUploadErro} please upload again`}</span>
                            ) : (
                                <span style={{ fontSize: '0.8rem', fontWeight: '300' }} className={`ml-2 mt-2 font-bold ${state === 'uploading' ? 'text-info' : ''}`}>
                                    {name || msg}
                                </span>
                            )}
                        </label>
                        <Input
                            type="file"
                            disabled={state === 'uploading' || showProgress}
                            except=".gz"
                            id="fileUpload"
                            name="fileUpload"
                            onClick={(event) => {
                                event.currentTarget.value = '';
                            }}
                            className="modal-file-upload"
                            onChange={onFileChange}
                        />
                    </div>
                </Col>
            </Row>
        );
    };

    const setdisableUrlInput = () => {
        setName('');
        const arr = [...steps];
        arr[currentStep].doNotShoNextLabel = true;
        dispatch(addUpgradeStep(arr));
        setProgress(0);
        setShowProgress(false);
        dispatch(addUpgradeStep);
        uploadUrl = '';
    };

    function getDownloadUpgradeProgress(timerFunctionCall: undefined | boolean) {
        if (!timerFunctionCall) {
            dispatch(showApplicationLoader('fetch_download_package_Data', 'Loading dowloading status'));
        }
        return callAPI(API_GET_UPGRADE_DOWNLOAD).then(
            (json) => {
                dispatch(hideApplicationLoader('fetch_download_package_Data'));
                if (json.status === 'failed') {
                    dispatch(addMessage(json.failureMessage, MESSAGE_TYPES.ERROR));
                    setShowProgress(false);
                    dispatch(valueChange('UI.UPGRADE', ''));
                    setName('');
                    setProgress(0);
                    dispatch(clearUpgrade(json.filename));
                    if (timerId.current !== null) {
                        clearInterval(timerId.current);
                    }
                    return;
                } else {
                    dispatch(valueChange(STATIC_KEYS.UI_FETCH_DOWNLOAD_STATUS, json));
                    if (json.downloadUrl) {
                        dispatch(valueChange(STATIC_KEYS.UI_UPGRADE_PAGE, STATIC_KEYS.UI_UPGRADE));
                        setProgress(json.uploadProgress);
                        if (json.uploadProgress === 100) {
                            dispatch(goToNextStep());
                        }
                        dispatch(valueChange('UI.UPGRADE', json.downloadUrl));
                        setShowProgress(true);
                    } else if (json.filename) {
                        dispatch(valueChange(STATIC_KEYS.UI_UPGRADE_PAGE, STATIC_KEYS.UI_UPGRADE));
                        setProgress(json.uploadProgress);
                        setName(json.filename);
                        setState('success');
                        setShowProgress(true);
                        uploadUrl = '';
                        if (json.uploadProgress === 100) {
                            dispatch(goToNextStep());
                        }
                    } else {
                        dispatch(valueChange('UI.UPGRADE', ''));
                        setName('');
                        setShowProgress(false);
                        setProgress(0);
                    }

                    if (timerId.current === null && json.status === IN_PROGRESS) {
                        timerId.current = window.setInterval(() => {
                            try {
                                getDownloadUpgradeProgress(true);
                            } catch (e: any) {
                                dispatch(addMessage(e, MESSAGE_TYPES.ERROR));
                                if (timerId.current !== null) {
                                    clearInterval(timerId.current);
                                }
                            }
                        }, 5000);
                    }
                }

                if (json.uploadProgress === 100) {
                    if (timerId.current !== null) {
                        clearInterval(timerId.current);
                    }
                }
            },
            (err) => {
                dispatch(hideApplicationLoader('fetch_download_package_Data'));
                dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
            },
        );
    }

    const onCancelClick = () => {
        dispatch(addUpgradeStep([]));
        dispatch(valueChange(STATIC_KEYS.UI_UPGRADE_PAGE, true));
    };

    const uploadFileComponent = () => {
        return (
            <>
                {renderUpload()}
                {renderFileDetails()}
            </>
        );
    };
    return (
        <>
            <Row className="align-items-center padding-10">
                <Col sm={5}>
                    <div className={`w-100 m-auto`}>{uploadFileComponent()}</div>
                </Col>
                <Col sm={1}>
                    <p className="text-center">Or</p>
                </Col>
                <Col sm={6}>
                    <div className={`w-100 ${state === 'validating' || state === 'uploading' || showProgress ? 'disabled' : ''}`}>
                        <DMText field={inputField} fieldKey="UI.UPGRADE" hideLabel={true} />
                    </div>
                </Col>
            </Row>
            <Row className="d-flex align-items-center justify-content-center">
                <Col sm={8}>
                    {showProgress ? (
                        <>
                            <Col sm={12} className="text-muted"></Col>
                            <div style={{ width: '90%', paddingLeft: '12px', paddingBottom: '12px', fontSize: '10px', fontWeight: '550' }}>
                                <span className="padding-bottom-10 d-flex justify-content-center text-info font-bold">{name ? 'Uploading upgrade package from the system.' : 'Uploading upgrade package from the provided URL.'}</span>
                                <ProgressBar completed={progress} />
                            </div>
                        </>
                    ) : null}
                </Col>
            </Row>
            <div className="padding-10 d-flex flex-row-reverse">
                <div>
                    {showProgress ? null : <ActionButton cssName={`btn btn-secondary margin-right-10 btn-sm p-2 pl-3 pr-3`} label="Close" onClick={onCancelClick} />}
                    <ActionButton cssName={`btn btn-success btn-sm p-2 pl-3 pr-3`} label="Upload" isDisabled={(name !== '' && disableUpload) || (uploadUrl !== '' && disableUpload) || (!name && !uploadUrl)} onClick={() => (name ? upgradeThroughFile() : uploadFile(undefined))} />
                </div>
            </div>
        </>
    );
};

export default withTranslation()(DownloadPackages);
