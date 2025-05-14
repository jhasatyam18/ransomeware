import React, { useRef, useState } from 'react';
import { Row, Col, PopoverBody, Popover } from 'reactstrap';

function NodeNameItemRenderer({ data }) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const targetRef = useRef(null);
  const { node } = data;
  const key = `${node.type}-${node.id}`;
  const fields = [{ label: 'Hostname', field: 'hostname' }, { label: 'Platform', field: 'platformType' }, { label: 'Type', field: 'nodeType' }, { label: 'Status', field: 'status' }];
  return (
    <>
      <div>
        <label ref={targetRef} id={key} key={key} onMouseEnter={() => setPopoverOpen(true)} onMouseLeave={() => setPopoverOpen(false)}>{node.name}</label>
        <Popover placement="bottom" isOpen={popoverOpen} target={targetRef} style={{ backgroundColor: '#222736', minWidth: '250px' }}>
          <PopoverBody>
            {
              fields.map((f) => (
                <Row key={`row-${f.field}`}>
                  <Col sm={6}>{f.label}</Col>
                  <Col sm={6}>{node[f.field]}</Col>
                </Row>
              ))
            }
          </PopoverBody>
        </Popover>
      </div>
    </>
  );
}

export default NodeNameItemRenderer;
