import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { INITIAL_STATE } from '../../interfaces/interfaces';
import { UpgradeStepsInterface } from '../../interfaces/upgradeInterfaces';
import { addUpgradeStep, setCurrentUpgradeStep } from '../../store/actions/upgradeAction';

interface Props {
    steps: UpgradeStepsInterface[];
    dispatch: Dispatch<any>;
    currentStep: number;
}

const UpgradeSteps: React.FC<Props> = (props: Props) => {
    const { steps, dispatch, currentStep } = props;
    const onStepClick = (st: UpgradeStepsInterface, index: number) => {
        if (st.state === 'done' && !st.stepIsDisabled) {
            const arr = [...steps];
            arr[currentStep].state = '';
            dispatch(addUpgradeStep(arr));
            dispatch(setCurrentUpgradeStep(index));
        }
    };
    const renderStepIcon = (st: UpgradeStepsInterface, index: number) => {
        if (index === steps.length - 1) {
            return (
                <>
                    <div className="link-item" onClick={() => onStepClick(st, index)}>
                        <div className="d-flex upgrade_end_step">
                            <FontAwesomeIcon size="xl" icon={faCheckCircle} className={`${currentStep === index && index !== steps.length - 1 ? 'link_color' : st.state === 'done' ? 'text-success' : 'text-secondary'}  'upgrade_end_step'`} />
                        </div>
                        <div style={{ position: 'relative', left: '-20px' }} className={`${currentStep === index && index !== steps.length - 1 ? 'link_color' : st.state === 'done' ? 'text-success' : 'text-secondary'}`}>
                            {st.label}
                        </div>
                    </div>
                </>
            );
        } else {
            return (
                <>
                    <div className="link-item" onClick={() => onStepClick(st, index)}>
                        <div className="d-flex">
                            <FontAwesomeIcon size="xl" icon={faCheckCircle} className={`${currentStep === index && index !== steps.length - 1 ? 'link_color' : st.state === 'done' ? 'text-success' : 'text-secondary'}`} />
                            <hr className={`upgrade_status_line ${st.state === 'done' ? 'upgrade_steps_success' : ''}`}></hr>
                        </div>
                        <div style={{ position: 'relative', right: '100px' }} className={`${currentStep === index && index !== steps.length - 1 ? 'link_color' : st.state === 'done' ? 'text-success' : 'text-secondary'} `}>
                            {st.label}
                        </div>
                    </div>
                </>
            );
        }
    };
    return (
        <>
            <div className="w-100 m-auto">
                <div className="d-flex justify-content-center">
                    {steps.map((st, ind) => {
                        return renderStepIcon(st, ind);
                    })}
                </div>
            </div>
        </>
    );
};

function mapStateToProps(state: INITIAL_STATE) {
    const { upgrade } = state;
    return {
        upgrade,
    };
}

export default connect(mapStateToProps)(withTranslation()(UpgradeSteps));
