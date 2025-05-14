import React, { useRef, useState } from 'react';
import { Col, Popover, PopoverBody, Row } from 'reactstrap';
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
    const targetRef = useRef(null);
    const { node } = data;
    const key = `${node.type}-${node.id}`;

    return (
        <>
            <div>
                <label ref={targetRef} id={key} key={key} onMouseEnter={() => setPopoverOpen(true)} onMouseLeave={() => setPopoverOpen(false)}>
                    {node.name}
                </label>
                <Popover placement="bottom" isOpen={popoverOpen} target={targetRef} style={{ backgroundColor: '#222736', minWidth: '250px' }}>
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
