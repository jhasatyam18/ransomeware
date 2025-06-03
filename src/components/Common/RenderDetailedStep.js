import { faCheckCircle, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { createRef, useRef, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { Col, Popover, PopoverBody, Row } from 'reactstrap';
import SimpleBar from 'simplebar-react';
import { DATA_GRID_SHORT_TEXT_LENGTH } from '../../constants/UserConstant';
import { DETAILED_STEP_COMPONENTS } from '../../constants/AppStatus';
import { STATIC_KEYS } from '../../constants/InputConstants';

function RenderDetailedSteps(props) {
  const { parseData, id, t, name, css } = props;
  const [popOver, setPopOver] = useState({});
  const [showErr, setShowErr] = useState({});
  const targetRefs = useRef({});

  const getRefForKey = (key) => {
    if (!targetRefs.current[key]) {
      targetRefs.current[key] = createRef();
    }
    return targetRefs.current[key];
  };

  const renderPopOver = (hoverInfo, key, isOpen) => (
    key && (
    <Popover placement="bottom" isOpen={popOver[isOpen]} target={key} style={{ backgroundColor: 'black', color: 'white', border: 'none', width: '200px', textAlign: 'left' }}>
      <PopoverBody style={{ color: 'white' }}>
        <SimpleBar style={{ maxHeight: '100px', minHeight: '30px' }}>
          {hoverInfo}
        </SimpleBar>
      </PopoverBody>
    </Popover>
    )
  );

  const renderIcons = (value) => (value === STATIC_KEYS.REC_STEP_PASS ? (
    <span className="text-success margin-right-5 margin-left-10">
      <FontAwesomeIcon size="sm" icon={faCheckCircle} />
    </span>
  ) : (
    <>
      <span className="text-danger margin-right-5 margin-left-10">
        <FontAwesomeIcon size="sm" icon={faCircleXmark} />
      </span>
    </>
  ));

  if (name === DETAILED_STEP_COMPONENTS.PENDING_STATUS_STEPS) {
    if (parseData.length === 0) {
      return null;
    }
    return (
      parseData.map((pd, ind) => {
        const key = `${ind}-${pd.message.trim(' ')}`;
        return (
          <div
            className={`${css} d-flex`}
            id={`rec-step-${id}-${key}`}
          >
            {renderIcons(pd.result)}
            <Row className="w-100">
              <Col sm={4} className="">
                { `${t(pd.name)}`}
              </Col>
              <Col sm={8} className="text-align-right d-flex ">
                :
                <span
                  className="ml-2"
                  aria-hidden
                  onClick={() => {
                    setShowErr({ [pd.name.trim(' ')]: !showErr[pd.name.trim(' ')] });
                  }}
                >
                  {pd.message.length > DATA_GRID_SHORT_TEXT_LENGTH && !showErr[pd.name.trim(' ')] ? (
                    <span>
                      {`${pd.message.substring(0, DATA_GRID_SHORT_TEXT_LENGTH)}
                      ...`}
                    </span>
                  ) : pd.message}
                  {pd.message.length > DATA_GRID_SHORT_TEXT_LENGTH ? <span className="link_color">{showErr[pd.name.trim(' ')] ? 'Less' : 'More'}</span> : null}
                </span>

              </Col>
            </Row>
          </div>
        );
      })
    );
  }
  return (
    <ul className="rec_step_list" style={{ listStyleType: 'none' }}>
      {parseData.map((pd) => {
        const key = Object.keys(pd);
        const detailedStepStatus = pd[key[0]].result;
        return (
          <li ref={getRefForKey(key)} id={`rec-step-${id}-${key}`} onMouseEnter={() => setPopOver({ [key]: true })} onMouseLeave={() => setPopOver({ [key]: false })}>
            { `${t(key)}`}
            {renderIcons(detailedStepStatus)}
            {renderPopOver(pd[key[0]].message, getRefForKey(key).current, key)}
          </li>
        );
      })}
    </ul>
  );
}

export default (withTranslation()(RenderDetailedSteps));
