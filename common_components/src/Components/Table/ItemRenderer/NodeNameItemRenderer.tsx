import React, { useState } from 'react';
import { Col, Label, Popover, PopoverBody, Row } from 'reactstrap';
import { NODE_NAME_POPOVER_FIELDS } from '../../../Constants/TableConstants';
import { APPLICATION_THEME, THEME_CONSTANTS } from '../../../Constants/userConstants';
import { Theme, UserInterface } from '../../../interfaces/interfaces';
import { getValue } from '../../../utils/AppUtils';

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
    user:UserInterface
}

const NodeNameItemRenderer: React.FC<NodeNameItemRendererProps> = ({ data, user }) => {
    const [popoverOpen, setPopoverOpen] = useState(false);
    const { node } = data;
    const key = `${node.type}-${node.id}`;
    const theme = (getValue({key:APPLICATION_THEME, values:user?.values}) as Theme)  || 'dark';
    const color = THEME_CONSTANTS.POPOVER?.[theme]?.color;
    const bgColor = THEME_CONSTANTS.POPOVER?.[theme]?.bgColor;
    return (
        <>
            <div>
                <Label id={key} key={key} onMouseEnter={() => setPopoverOpen(true)} onMouseLeave={() => setPopoverOpen(false)}>
                    {node.name}
                </Label>
                <Popover placement="bottom" isOpen={popoverOpen} target={key} style={{ backgroundColor: bgColor, minWidth: '250px' }}>
                    <PopoverBody style={{ color:color }}>
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
