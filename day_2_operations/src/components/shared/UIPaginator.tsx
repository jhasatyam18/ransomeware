import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, ButtonGroup } from 'reactstrap';
import { STATIC_KEYS } from '../../constants/StoreKey';
import { MESSAGE_TYPES } from '../../constants/userConstant';
import { UserInterface } from '../../interfaces/interface';
import { setSiteHealth } from '../../store/reducers/DashboardReducer';
import { addMessage } from '../../store/reducers/messageReducer';
import { callAPI, getValue } from '../../utils/apiUtils';

interface Pagination {
    currentPage: number;
    hasNext: boolean;
    hasPrev: boolean;
    limit: number;
    nextOffset: number;
    records: any[];
    totalPages: number;
    totalRecords: any[];
}

interface Props {
    user: UserInterface;
    dispatch: any;
    url: string;
    setLoader?: any;
    filteredData?: (data: any[]) => any[];
}

const UIPaginator: React.FC<Props> = ({ user, dispatch, url, setLoader, filteredData }) => {
    const refresh = useSelector((state: any) => state.global.context.refresh);
    const [pagination, setNodes] = useState<Pagination>({
        currentPage: 1,
        hasNext: false,
        hasPrev: false,
        limit: 4,
        nextOffset: 0,
        records: [],
        totalPages: 1,
        totalRecords: [],
    });

    const { values } = user;
    const SITE_ID = getValue({ key: STATIC_KEYS.GLOBAL_SITE_KEY, values }) || '1';
    const siteIdRef = useRef(SITE_ID);
    useEffect(() => {
        siteIdRef.current = SITE_ID;
    }, [SITE_ID]);
    useEffect(() => {
        let isUnmounting = false;
        const currentSiteId = SITE_ID;
        setNodes(() => ({ currentPage: 1, hasNext: false, hasPrev: false, limit: 4, nextOffset: 0, records: [], totalPages: 1, totalRecords: [] }));
        if (typeof setLoader !== 'undefined') setLoader(true);
        callAPI(url).then(
            (json) => {
                if (isUnmounting) return;
                if (siteIdRef.current !== currentSiteId) {
                    return;
                }
                const d = SITE_ID !== '1' ? json?.data[0]?.plans || [] : json.data || [];
                let finalData = d;
                if (filteredData && typeof filteredData === 'function') {
                    finalData = filteredData(d);
                }
                const startIndex = 0;
                const endIndex = pagination.limit;
                const slicedData = finalData.slice(startIndex, endIndex);
                const totalPages = Math.ceil(finalData.length / pagination.limit);

                const hasNext = 1 < totalPages;
                const hasPrev = false;

                setNodes(() => ({
                    ...pagination,
                    records: slicedData,
                    totalPages,
                    hasNext,
                    hasPrev,
                    totalRecords: finalData,
                    currentPage: 1,
                }));
                dispatch(setSiteHealth({ siteHealth: slicedData }));
                if (typeof setLoader !== 'undefined') setLoader(false);
            },
            (err) => {
                if (isUnmounting) return;
                dispatch(addMessage({ message: err.message, messageType: MESSAGE_TYPES.ERROR }));
                if (typeof setLoader !== 'undefined') setLoader(false);
            },
        );

        return () => {
            setNodes(() => ({
                currentPage: 1,
                hasNext: false,
                hasPrev: false,
                limit: 4,
                nextOffset: 0,
                records: [],
                totalPages: 1,
                totalRecords: [],
            }));
            dispatch(setSiteHealth({ siteHealth: [] }));
        };
    }, [SITE_ID, refresh]);
    const handlePageChange = (page: number) => {
        const si = (page - 1) * pagination.limit;
        const tr = pagination.totalRecords.slice(si, si + pagination.limit);
        setNodes((prev) => ({
            ...prev,
            currentPage: page,
            hasPrev: page > 1,
            hasNext: page < prev.totalPages,
            records: tr,
        }));

        dispatch(setSiteHealth({ siteHealth: tr }));
    };

    const handlePrev = () => {
        if (pagination.hasPrev && pagination.currentPage > 1) {
            handlePageChange(pagination.currentPage - 1);
        }
    };

    const handleNext = () => {
        if (pagination.hasNext && pagination.currentPage < pagination.totalPages) {
            handlePageChange(pagination.currentPage + 1);
        }
    };

    return pagination?.records.length === 0 ? null : (
        <div className="padding-0 ms-2">
            <ButtonGroup className="btn-group-sm chart_paginator_height">
                <Button disabled={!pagination.hasPrev} onClick={handlePrev} style={{ paddingLeft: '3px' }}>
                    <FontAwesomeIcon size="xs" icon={faChevronLeft} />
                </Button>
                <div className="input-group input_div" style={{ paddingTop: '8%', paddingLeft: '3px', paddingRight: '3px', minWidth: '50%' }}>
                    <span className="paginator_font_Size paginator_input">
                        {' '}
                        {pagination.currentPage}&nbsp; /&nbsp; {pagination.totalPages || 1}{' '}
                    </span>
                </div>
                <Button disabled={!pagination.hasNext} onClick={handleNext} style={{ paddingLeft: '3px' }}>
                    <FontAwesomeIcon size="xs" icon={faChevronRight} />
                </Button>
            </ButtonGroup>
        </div>
    );
};

export default UIPaginator;
