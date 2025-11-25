import React from 'react';
import { Col, Row } from 'reactstrap';

type textType = {
    width: number;
    text: string;
};

interface BarSegment {
    label?: string;
    color: string;
    value: number;
    fontColor?: string;
}

interface HorizontalBarProps {
    segments: BarSegment[];
    barText: textType[];
}

const HorizontalBar: React.FC<HorizontalBarProps> = ({ segments, barText }) => {
    const total = segments.reduce((sum, seg) => sum + seg.value, 0);

    return (
        <>
            {barText ? (
                <Row>
                    {barText.map((el) => {
                        return (
                            <Col key={`${el.text}-${el.width}`} className="text-muted" sm={el.width}>
                                {el.text}
                            </Col>
                        );
                    })}
                </Row>
            ) : null}
            <div className="horizontal-bar">
                {segments.map((segment, index) => {
                    const width = total > 0 ? (segment.value / total) * 100 : 0;
                    return (
                        <>
                            <div
                                key={index}
                                className="bar-segment d-flex align-items-center justify-content-center"
                                style={{
                                    width: `${width}%`,
                                    backgroundColor: segment.color,
                                }}
                                title={`${segment.label || 'Segment'}: ${segment.value} (${width.toFixed(2)}%)`}
                            >
                                <span className="text-center" style={{ color: `${segment.fontColor || ''}`, fontWeight: '450' }}>{`${segment.label} (${segment.value})`}</span>
                            </div>
                        </>
                    );
                })}
            </div>
        </>
    );
};

export default HorizontalBar;
