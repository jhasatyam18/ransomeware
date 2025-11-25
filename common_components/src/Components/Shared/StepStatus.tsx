import { faCheckCircle, faCircleXmark, faExclamationTriangle, faS, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Col, Row } from 'reactstrap';
import { DETAILED_STEP_COMPONENTS } from '../../Constants/AppStatus';
import { UserInterface } from '../../interfaces/interfaces';
import RenderDetailedSteps from './renderDetailedSteps'

type DataTypes = {
    failureMessage: string,
    time: number,
    data: any,
    message: string,
    status: string,
    id:string
}

interface StepStatusProps extends WithTranslation {
  steps: any[];
  data: DataTypes;
  dispatch: any;
  user:UserInterface
}

const StepStatus: React.FC<StepStatusProps> = ({ steps, data, user }) => {
  const { id } = data;
  const shortFailureMsg = data.failureMessage ? data.failureMessage.substring(0, 30) : '';
  const [errormsg, setErrorMsg] = useState(`${shortFailureMsg}...`);
  const [show, setShow] = useState(false);

  if (!steps || steps.length === 0) {
    return null;
  }

  const renderIcon = (st: any, iconClass?: string) => {
    const { status } = st;
    if (iconClass) {
      return <FontAwesomeIcon size="lg" icon={faExclamationTriangle} className="text-warning recovery_step_icon" />;
    }
    if (status === 'completed') {
      return <FontAwesomeIcon size="lg" icon={faCheckCircle} className={`${iconClass || 'text-success'} recovery_step_icon`} />;
    } 
    if (status === 'failed') {
      return <FontAwesomeIcon size="lg" icon={faCircleXmark} className="text-danger recovery_step_icon" />;
    } 
    if (status === 'running') {
      return <FontAwesomeIcon size="lg" className="text-info recovery_step_icon" icon={faSpinner} />;
    }
  };

  const renderDetailedSteps = (parseData: any[], name: string) => (
    <RenderDetailedSteps parseData={parseData} id={id} name={name} css="pending_detailed_step_div" user={user} />
  );

  const showFullErrorText = () => {
    setShow(!show);
    setErrorMsg(show ? `${data.failureMessage.substring(0, 30)}...` : data.failureMessage);
  };

  const renderSteps = (st: any, i: number) => {
    const { message, time } = st;
    let parseData: any[] = [];
    let stepStatusWarn = false;
    if (st.data) {
      parseData = JSON.parse(st.data);
    }

    if (st.name === DETAILED_STEP_COMPONENTS.PENDING_STATUS_STEPS) {
      parseData.forEach((pd) => {
        if (pd.result === 'Fail') {
          stepStatusWarn = true;
        }
      });
    } else if (parseData.length > 0) {
      parseData.forEach((pd) => {
        const key = Object.keys(pd);
        if (pd[key[0]].result === 'Fail') {
          stepStatusWarn = true;
        }
      });
    }

    const convertTedTime = time * 1000;
    const d = new Date(convertTedTime);
    const resp = `${d.toLocaleTimeString()}`;
    const stepDivClass = parseData.length > 0 ? 'step_msg_div_data w-100' : 'step_msg_div';

    return (
      <div className="step_parent_div" key={i}>
        <div className="step_icon_div">{renderIcon(st, stepStatusWarn ? 'text-warning' : undefined)}</div>
        <div className={`  ${stepDivClass} ${i === steps.length - 1 ? '' : 'progress_step_border'}`}>
          <p className="step_msg" style={{ cursor: 'pointer' }}>{message}</p>
          <p className="step_time">{resp}
            {st.status === 'failed' ? (
              <p aria-hidden onClick={showFullErrorText} className="rec_status_error_Div">
                {errormsg}&nbsp;
                <span className="link_color">{show ? 'Less' : 'More'}</span>
              </p>
            ) : null}
          </p>
          {parseData.length > 0 && renderDetailedSteps(parseData, st.name)}
        </div>
      </div>
    );
  };

  return <>{steps.map((st, i) => (<Row key={i}><Col sm={12}>{renderSteps(st, i)}</Col></Row>))}</>;
};

const mapStateToProps = (state: any) => {
  return { dispatch: state.dispatch };
};

export default connect(mapStateToProps)(withTranslation()(StepStatus));
