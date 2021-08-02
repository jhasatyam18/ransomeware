import React, { useState } from 'react';
import { Label, Row, Col, PopoverBody, Popover } from 'reactstrap';

function NodeNameItemRenderer({ data }) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { node } = data;
  const key = `${node.type}-${node.id}`;
  const fields = [{ label: 'Hostname', field: 'hostname' }, { label: 'Platform', field: 'platformType' }, { label: 'Type', field: 'nodeType' }, { label: 'Status', field: 'status' }];
  return (
    <>
      <div>
        <Label id={key} key={key} onMouseEnter={() => setPopoverOpen(true)} onMouseLeave={() => setPopoverOpen(false)}>{node.name}</Label>
        <Popover placement="bottom" isOpen={popoverOpen} target={key} style={{ backgroundColor: '#222736', minWidth: '250px' }}>
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
