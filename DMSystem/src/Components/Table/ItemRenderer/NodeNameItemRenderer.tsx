import React, { useState } from 'react';
import { Col, Label, Popover, PopoverBody, Row } from 'reactstrap';
import { NODE_NAME_POPOVER_FIELDS } from '../../../Constants/TableConstants';

interface Node {
    id: string;
    type: string;
    name: string;
    hostname: string;
    platformType: string;
    nodeType: string;
    status: string;
}

interface NodeNameItemRendererProps {
    data: {
        node: Node;
    };
}

const NodeNameItemRenderer: React.FC<NodeNameItemRendererProps> = ({ data }) => {
    const [popoverOpen, setPopoverOpen] = useState(false);
    const { node } = data;
    const key = `${node.type}-${node.id}`;

    return (
        <>
            <div>
                <Label id={key} key={key} onMouseEnter={() => setPopoverOpen(true)} onMouseLeave={() => setPopoverOpen(false)}>
                    {node.name}
                </Label>
                <Popover placement="bottom" isOpen={popoverOpen} target={key} style={{ backgroundColor: '#222736', minWidth: '250px' }}>
                    <PopoverBody>
                        {NODE_NAME_POPOVER_FIELDS.map((f) => (
                            <Row key={`row-${f.field}`}>
                                <Col sm={6}>{f.label}</Col>
                                <Col sm={6}>{node[f.field as keyof Node]}</Col>
                            </Row>
                        ))}
                    </PopoverBody>
                </Popover>
            </div>
        </>
    );
};

export default NodeNameItemRenderer;
