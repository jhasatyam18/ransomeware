import { faCheckCircle, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Col, Popover, PopoverBody, Row } from 'reactstrap';
import SimpleBar from 'simplebar-react';
import { DETAILED_STEP_COMPONENTS } from '../../Constants/AppStatus';
import { APPLICATION_THEME, THEME_CONSTANTS } from '../../Constants/userConstants';
import { Theme, UserInterface } from '../../interfaces/interfaces';
import { getValue } from '../../utils/AppUtils';

interface StepData {
  name: string;
  message: string;
  result: string;
}

interface DetailedStep {
  [key: string]: {
    result: string;
    message: string;
  };
}

interface RenderDetailedStepsProps extends WithTranslation {
  parseData: StepData[] | DetailedStep[];
  id: string | number;
  name: string;
  css: string;
  user:UserInterface
}

const RenderDetailedSteps: React.FC<RenderDetailedStepsProps> = ({ parseData, id, t, name, css, user }) => {
  const [popOver, setPopOver] = useState<{ [key: string]: boolean }>({});
  const [showErr, setShowErr] = useState<{ [key: string]: boolean }>({});
  const theme = (getValue({key:APPLICATION_THEME, values:user?.values}) as Theme)  || 'dark';
  const color = THEME_CONSTANTS.POPOVER?.[theme]?.color;
  const bgColor = THEME_CONSTANTS.POPOVER?.[theme]?.bgColor;
  const renderPopOver = (hoverInfo: string, key: string, isOpen: string) => (
    <Popover
      placement="bottom"
      isOpen={popOver[isOpen]}
      target={key}
      style={{ backgroundColor: bgColor, color: 'white', border: 'none', width: '200px', textAlign: 'left' }}
    >
      <PopoverBody>
        <SimpleBar style={{ maxHeight: '100px', minHeight: '30px',color:color }}>{hoverInfo}</SimpleBar>
      </PopoverBody>
    </Popover>
  );

  const renderIcons = (value: string) => (
    value === 'Pass' ? (
      <span className="text-success margin-right-5 ml-2">
        <FontAwesomeIcon size="sm" icon={faCheckCircle} />
      </span>
    ) : (
      <span className="text-danger margin-right-5 ml-2">
        <FontAwesomeIcon size="sm" icon={faCircleXmark} />
      </span>
    )
  );

  if (name === DETAILED_STEP_COMPONENTS.PENDING_STATUS_STEPS) {
    if (parseData.length === 0) return null;

    return (
      <>
        {parseData.map((pd:any, ind) => {
          const key = `${ind}-${pd.message.trim()}`;
          return (
            <div key={key} className={`${css} d-flex`} id={`rec-step-${id}-${key}`}>
              {renderIcons(pd.result)}
              <Row className="w-100">
                <Col sm={4}>{t(pd.name)}</Col>
                <Col sm={8} className="text-align-right d-flex">
                  :
                  <span
                    className="ml-2"
                    aria-hidden
                    onClick={() => setShowErr((prev) => ({ ...prev, [pd.name.trim()]: !prev[pd.name.trim()] }))}
                  >
                    {pd.message.length > 30 && !showErr[pd.name.trim()] ? (
                      <span>{`${pd.message.substring(0, 30)}...`}</span>
                    ) : (
                      pd.message
                    )}
                    {pd.message.length > 30 && (
                      <span className="link_color">{showErr[pd.name.trim()] ? 'Less' : 'More'}</span>
                    )}
                  </span>
                </Col>
              </Row>
            </div>
          );
        })}
      </>
    );
  }

  return (
    <ul className="rec_step_list" style={{ listStyleType: 'none' }}>
      {parseData.map((pd) => {
        const key = Object.keys(pd)[0];
        const detailedStep = pd as DetailedStep;
        const detailedStepStatus = detailedStep[key].result;

        return (
          <li
            key={key}
            id={`rec-step-${id}-${key}`}
            onMouseEnter={() => setPopOver((prev) => ({ ...prev, [key]: true }))}
            onMouseLeave={() => setPopOver((prev) => ({ ...prev, [key]: false }))}
          >
            {t(key)}
            {renderIcons(detailedStepStatus)}
            {renderPopOver(detailedStep[key].message, `rec-step-${id}-${key}`, key)}
          </li>
        );
      })}
    </ul>
  );
};

export default withTranslation()(RenderDetailedSteps);
