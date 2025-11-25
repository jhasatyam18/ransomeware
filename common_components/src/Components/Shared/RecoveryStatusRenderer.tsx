import { faCircleInfo, faListCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Col, Popover, PopoverBody, Row } from 'reactstrap';
import { JOB_COMPLETION_STATUS, JOB_FAILED, RECOVERY_STEPS } from '../../Constants/AppStatus';
import StatusItemRenderer from '../Table/ItemRenderer/StatusItemRenderer';
import StepStatus from './StepStatus';
import {Theme, UserInterface} from '../../interfaces/interfaces'
import { APPLICATION_THEME, THEME_CONSTANTS } from '../../Constants/userConstants';
import { getValue } from '../../utils/AppUtils';
interface RecoveryStatusRendererProps extends WithTranslation {
  data: any;
  field: string;
  dispatch: any;
  user: UserInterface;
  options:{onIconClick:any}
}

const RecoveryStatusRenderer: React.FC<RecoveryStatusRendererProps> = ({ data, field, dispatch ,options, user}) => {
  const [toggle, setToggle] = useState<boolean>(data.step === '');
  const [popOver, setPopOver] = useState<boolean>(false);
  const [jobData, setJobData] = useState<any>(data);
  const [steps, setSteps] = useState<any[]>([]);
  const [detailedStepError, setDetailedStepError] = useState<boolean>(false);
  const timerId = useRef<NodeJS.Timeout | undefined>();
  const RecoveryStatus = [JOB_COMPLETION_STATUS, JOB_FAILED];
  const {onIconClick} = options;
  const {values} = user;
  const theme = (getValue({key:APPLICATION_THEME, values}) as Theme)  || 'dark';
  useEffect(() => { 
    if (data?.step) {
      try {
        const step = JSON.parse(data.step);
        step.forEach((element: any) => {
          if (element.data && element.name === RECOVERY_STEPS.VALIDATION_INSTANCE_FOR_RECOVERY) {
            const parseData = JSON.parse(element.data);
            parseData.forEach((pd: any) => {
              const key = Object.keys(pd);
              if (pd[key[0]].result === 'Fail') {
                setDetailedStepError(true);
              }
            });
          }
        });
      } catch (e) {
        console.error("Error parsing step data:", e);
      }
    }

    return () => clearInterval(timerId.current);
  }, [data]);

  const fetchRunningJobsSteps = async () => {
     let step = JSON.parse(data.step);
      setSteps(step);
      setJobData(data);
      if (RecoveryStatus.includes(data.status)) {
        clearInterval(timerId.current);
      }
  };

  const handleCheckbox = () => {
    setToggle(!toggle);
    if (!toggle) {
      if (RecoveryStatus.includes(jobData.status)) {
        try {
          setSteps(JSON.parse(jobData.step));
        } catch {
          setSteps([]);
        }
      } else {
        fetchRunningJobsSteps();
      }
    } else {
      clearInterval(timerId.current);
      timerId.current = undefined;
    }
  };

  const renderShowProgress = () => {
    const key = `step-status-${field}-${data.id}`;
    const color = THEME_CONSTANTS.POPOVER?.[theme]?.color;
    const bgColor = THEME_CONSTANTS.POPOVER?.[theme]?.bgColor;
    return (
      <>
        <FontAwesomeIcon
          size="lg"
          icon={faListCheck}
          className="progress_list"
          onClick={jobData.step ? handleCheckbox : undefined}
          onMouseEnter={() => setPopOver(true)}
          onMouseLeave={() => setPopOver(false)}
          id={key}
          color={toggle ? '#bfc8e2' : '#50a5f1'}
        />
        <Popover placement="bottom" isOpen={popOver && !toggle} target={key} style={{ backgroundColor: bgColor, width: '150px', textAlign: 'center', borderRadius: '5px' }}>
          <PopoverBody style={{ color: color }}>{'View Progress'}</PopoverBody>
        </Popover>
      </>
    );
  };

  const onClick =()=>{
    dispatch(onIconClick(data, user))
  }

  return (
    <div className="rec_job_parent">
      <Row>
        <Col lg={8}>
          <StatusItemRenderer data={jobData} field={field} user={user} />
        </Col>
        <Col sm={4}>
          <Row>
            <Col sm={3} className="show_details margin-left-8 margin-right-5">
              {renderShowProgress()}
            </Col>
            <Col sm={3}>
              <FontAwesomeIcon className="info__icon test_summary_icon" size="sm" icon={faCircleInfo} onClick={onClick} />
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className="padding-left-2">
        <Col sm={12}>{toggle && <StepStatus steps={steps} data={jobData} user={user} />}</Col>
      </Row>
    </div>
  );
};

export default withTranslation()(RecoveryStatusRenderer);