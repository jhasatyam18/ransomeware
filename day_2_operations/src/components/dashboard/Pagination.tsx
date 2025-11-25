import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Button, ButtonGroup } from 'reactstrap';

interface PageInfo {
    currentPage: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
    nextOffset: number;
    totalInSync: number;
    totalExceedsInterval: number;
    totalFailed: number;
}

interface PaginationProps {
    pageInfo: PageInfo;
    handleNext: () => void;
    handlePrevious: () => void;
}

const Pagination: React.FC<PaginationProps> = ({ pageInfo, handleNext, handlePrevious }) => {
    return (
        <div className="padding-0 ms-2">
            <ButtonGroup className="btn-group-sm chart_paginator_height">
                <Button disabled={!pageInfo.hasPrev} onClick={handlePrevious} style={{ paddingLeft: '3px' }}>
                    <FontAwesomeIcon size="xs" icon={faChevronLeft} />
                </Button>
                <div className="input-group input_div" style={{ paddingTop: '8%', paddingLeft: '3px', paddingRight: '3px', minWidth: '50%' }}>
                    <span className="paginator_font_Size paginator_input">
                        {' '}
                        {pageInfo.currentPage}&nbsp; /&nbsp; {pageInfo.totalPages || 1}{' '}
                    </span>
                </div>
                <Button disabled={!pageInfo.hasNext} onClick={handleNext} style={{ paddingLeft: '3px' }}>
                    <FontAwesomeIcon size="xs" icon={faChevronRight} />
                </Button>
            </ButtonGroup>
        </div>
    );
};

export default Pagination;
