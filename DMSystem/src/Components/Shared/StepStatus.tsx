import { faCaretDown, faCaretRight, faCheckCircle, faCircleXmark, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useRef, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Popover, PopoverBody } from 'reactstrap';
import { Dispatch } from 'redux';
import SimpleBar from 'simplebar-react';
import { INITIAL_STATE } from '../../interfaces/interfaces';
import { JOB_COMPLETION_STATUS, JOB_FAILED, JOB_IN_PROGRESS } from '../../Constants/statusConstant';

interface Step {
    status: string;
    name: string;
    SubSteps?: any;
    startTime: string;
    endTime: string;
    failureMessage: string;
    id: string;
}

interface Data {
    id: string;
    failureMessage?: string;
}

interface Props {
    steps: Step[];
    data?: Data;
    noCard?: boolean;
    dispatch: Dispatch<any>;
    maxHeight?: string;
}

const StepStatus: React.FC<Props> = (props) => {
    const { steps, noCard, dispatch, maxHeight } = props;
    const [popOver, setPopOver] = useState<Record<string, boolean>>({});
    const pop: Record<string, boolean> = {};
    const [showSubStep, setShowSubStep] = useState<Record<string, boolean>>(pop || {});
    const targetRef = useRef(null);

    if (!steps || steps?.length === 0) {
        return null;
    }

    const cleanString = (input: string): string => {
        return input.replace(/[^a-zA-Z0-9]/g, '');
    };

    for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        const id = cleanString(`st-pop-${step.id}-${step.name.trim()}`);
        pop[id] = false;
    }
    const renderIcon = (st: Step, iconClass: boolean) => {
        const { status } = st;
        if (iconClass) {
            return <FontAwesomeIcon size="lg" icon={faExclamationTriangle} className="text-warning recovery_step_icon" />;
        }
        if (status === JOB_COMPLETION_STATUS) {
            return <FontAwesomeIcon size="lg" icon={faCheckCircle} className={`${iconClass || 'text-success'} recovery_step_icon mb-2 `} />;
        }
        if (status === JOB_FAILED) {
            return <FontAwesomeIcon size="lg" icon={faCircleXmark} className="text-danger recovery_step_icon" />;
        }
        if (status === JOB_IN_PROGRESS) {
            return <i className="fa fa-spinner fa-lg fa-spin text-info recovery_step_icon mt-2 " />;
        }
        return null;
    };

    const renderPopOver = (hoverInfo: string, key: string) => {
        const data = popOver[key];
        return (
            <Popover
                placement="bottom"
                isOpen={data}
                target={targetRef}
                style={{
                    backgroundColor: 'black',
                    color: 'white',
                    border: 'none',
                    minWidth: '400px',
                    textAlign: 'center',
                    borderRadius: '3px',
                }}
            >
                <PopoverBody>{hoverInfo}</PopoverBody>
            </Popover>
        );
    };

    const renderSteps = (st: Step, i: number) => {
        const { name, endTime, status, startTime } = st;
        let parseData: any[] = [];
        const stepStatusWarn = false;
        const convertTedTime = parseInt(status === JOB_IN_PROGRESS ? startTime : endTime, 10) * 1000;
        const d = new Date(convertTedTime);
        const resp = `${d.toLocaleTimeString()}`;
        if (st.SubSteps && st.SubSteps !== 'null') {
            parseData = st.SubSteps;
        }
        const stepDivClass = parseData.length > 0 && showSubStep[st.startTime] ? 'step_msg_div_data' : 'step_msg_div';
        const id = cleanString(`st-pop-${st.id}-${st.name.trim()}`);
        return (
            <div className="step_parent_div" key={i}>
                <div className="step_icon_div">{renderIcon(st, stepStatusWarn)}</div>
                <div className={` ${stepDivClass} ${i === steps.length - 1 ? '' : 'progress_step_border'}`}>
                    <p ref={targetRef} className="step_msg text-muted pr-2" onMouseEnter={() => setPopOver({ [id]: true })} onMouseLeave={() => setPopOver({ [id]: false })}>
                        <span style={{ cursor: parseData.length > 0 || st.failureMessage ? 'pointer' : '' }} id={id} onClick={() => (parseData.length > 0 ? setShowSubStep({ ...showSubStep, [id]: !showSubStep[id] }) : null)}>{`${name}`}</span>
                        {st.failureMessage ? renderPopOver(st.failureMessage, id) : null}
                        {parseData.length > 0 ? (
                            showSubStep[id] ? (
                                <>
                                    <FontAwesomeIcon
                                        size="xs"
                                        icon={faCaretDown}
                                        className=" recovery_step_icon margin-left-10"
                                        style={{ cursor: parseData.length > 0 || st.failureMessage ? 'pointer' : '' }}
                                        onClick={() =>
                                            setShowSubStep({
                                                ...showSubStep,
                                                [id]: !showSubStep[id],
                                            })
                                        }
                                    />
                                </>
                            ) : (
                                <FontAwesomeIcon
                                    size="xs"
                                    icon={faCaretRight}
                                    className="substep_icon recovery_step_icon margin-left-10 "
                                    style={{ cursor: parseData.length > 0 || st.failureMessage ? 'pointer' : '' }}
                                    onClick={() =>
                                        setShowSubStep({
                                            ...showSubStep,
                                            [id]: !showSubStep[id],
                                        })
                                    }
                                />
                            )
                        ) : null}
                        <span style={{ fontSize: '0.5rem', display: 'block' }}>{` ${resp}`}</span>
                    </p>
                    {showSubStep[id] ? (
                        <>
                            <div style={{ position: 'relative', top: '-12px', left: '13px' }}>
                                <StepStatus steps={JSON.parse(st.SubSteps)} noCard={true} dispatch={dispatch} />
                            </div>
                        </>
                    ) : null}
                </div>
            </div>
        );
    };

    const renderProgress = () => steps.map((st, i) => <>{renderSteps(st, i)}</>);

    return <>{noCard ? renderProgress() : <SimpleBar style={{ maxHeight: maxHeight }}>{renderProgress()}</SimpleBar>}</>;
};

const mapStateToProps = (state: INITIAL_STATE) => {};

export default connect(mapStateToProps)(withTranslation()(StepStatus));
