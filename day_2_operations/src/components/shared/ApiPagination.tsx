import React, { useEffect, useRef, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Button, ButtonGroup, CardTitle, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faFilter, faSearch } from '@fortawesome/free-solid-svg-icons';
import { MILI_SECONDS_TIME } from '../../constants/userConstant';
import { MESSAGE_TYPES } from '../../constants/userConstant';
import { hideApplicationLoader, showApplicationLoader } from '../../store/reducers/globalReducer';
import { addMessage } from '../../store/reducers/messageReducer';
import { callAPI, getValue, removeSimilarQuery } from '../../utils/apiUtils';
import { GlobalState, INITIAL_STATE_INTERFACE, UserInterface } from '../../interfaces/interface';
import { STATIC_KEYS } from '../../constants/StoreKey';
import { valueChange } from '../../store/reducers/userReducer';
import { AppDispatch } from '../../store';

interface PageInfo {
    limit: number;
    currentPage: number;
    hasNext: boolean;
    hasPrev: boolean;
    nextOffset: number;
    pageRecords: number;
    totalPages: number;
    totalRecords: number;
}

interface Column {
    field: string;
    label: string;
    allowFilter?: boolean;
    checked?: boolean;
}

interface DMAPIPaginatorProps extends WithTranslation {
    apiUrl: string;
    storeFn: (data: any[]) => void;
    dispatch: AppDispatch;
    columns: Column[];
    name: string;
    isParameterizedUrl?: boolean;
    pageLimit?: number;
    fetchInInterval?: boolean;
    showFilter?: string;
    defaultLayout?: boolean;
    global: GlobalState;
    setUrl?: (url: string) => void;
    user: UserInterface;
    searchString?: string;
    subFilter?: any[];
    subFilterTitle?: string;
}

const DMAPIPaginator: React.FC<DMAPIPaginatorProps> = (props) => {
    const { pageLimit = 100, fetchInInterval, apiUrl, storeFn, dispatch, user, columns, t, isParameterizedUrl, name, defaultLayout, subFilter = [], subFilterTitle = '' } = props;

    const emptyPageInfo: PageInfo = {
        limit: pageLimit,
        currentPage: 0,
        hasNext: false,
        hasPrev: false,
        nextOffset: 0,
        pageRecords: 0,
        totalPages: 0,
        totalRecords: 0,
    };

    const { values } = user;
    const defaultCols = getValue({ key: 'columns.filter.apply', values }) || [];
    const defaultSearchStr = getValue({ key: 'pagination.filter.value', values }) || '';
    const metadata = getValue({ key: `${name}.dmapipaginator.metadata`, values }) || {};
    const [isOpenFilterCol, setIsOpenFilterCol] = useState<boolean>(false);
    const [apiQuery, setApiQuery] = useState<any>({});
    const [filterColumns, setFilterColumns] = useState<Column[]>([]);
    const [forceUpdate, setForceUpdate] = useState<number>(1);
    const [searchStr, setSearchStr] = useState<string>(defaultSearchStr);

    const refresh = useSelector((state: INITIAL_STATE_INTERFACE) => state.global.context.refresh);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const searchStrRef = useRef<string>(searchStr);
    const pageNumRef = useRef<number>(Object.keys(metadata).length > 0 && metadata.currentPage ? metadata.currentPage : 1);

    const getBaseURL = (): string => {
        return isParameterizedUrl === true ? `${apiUrl}` : `${apiUrl}&`;
    };

    const getUrl = (offset: number, filterCol: any[]): string => {
        let url = getBaseURL();
        if (offset === 0) {
            url = `${url}limit=${Object.keys(metadata).length > 0 && metadata.limit ? metadata.limit : pageLimit}`;
        } else {
            url = `${url}offset=${offset}&limit=${Object.keys(metadata).length > 0 && metadata.limit ? metadata.limit : pageLimit}`;
        }
        if (searchStr !== '' && typeof searchStr !== 'undefined') {
            // include encoded search value and field in the API
            const encodedSearchStr = encodeURIComponent(searchStr.trim());
            const applicableCols = typeof filterCol !== 'undefined' && filterCol?.length > 0 ? filterCol.filter((f) => f.checked === true) : filterColumns?.filter((f) => f.checked === true);
            if (applicableCols.length > 0) {
                const searchFields = applicableCols.map((m) => m.field).join(',');
                url = `${url}&searchStr=${encodedSearchStr}&searchCol=${searchFields}`;
            }
        }
        return removeSimilarQuery(url, apiQuery);
    };

    const fetchData = (offset = 0, onPageChange = false, filterCol: any[]): void => {
        if (!apiUrl || apiUrl.trim() === '' || apiUrl === 'undefined' || apiUrl === 'null') {
            storeFn([]);
            dispatch(hideApplicationLoader(apiUrl));
            return;
        }
        const url = getUrl(offset, filterCol);
        if (!fetchInInterval || onPageChange) {
            dispatch(showApplicationLoader({ key: url, value: 'loading...' }));
        }

        if (!fetchInInterval || onPageChange) {
            storeFn([]);
        }

        callAPI(url).then(
            (json: any) => {
                dispatch(hideApplicationLoader(url));
                const { records, ...others } = json;
                dispatch(valueChange([`${name}.dmapipaginator.metadata`, { ...others, limit: pageLimit }]));
                storeFn(records);
            },
            (err: Error) => {
                dispatch(addMessage({ message: err.message, messageType: MESSAGE_TYPES.ERROR }));
                dispatch(hideApplicationLoader(url));
            },
        );
    };

    useEffect(() => {
        let isUnmounting = false;

        if (!isUnmounting) {
            const pagec = Object.keys(metadata).length > 0 && metadata.currentPage ? metadata.currentPage : 0;
            dispatch(valueChange([`${name}.dmapipaginator.metadata`, { ...metadata, currentPage: Object.keys(metadata).length > 0 && metadata.currentPage ? metadata.currentPage : 1 }]));
            const arr = [...columns.filter((c) => c.allowFilter), ...subFilter];
            setFilterColumns(arr);
            setIntervalToFetch();
            subFilter
                ?.filter((f) => f.checked)
                .forEach((f) => {
                    addSubFilterQuery(f);
                });
            fetchData(pagec > 0 ? (pagec - 1) * pageLimit : pagec * pageLimit, false, arr);
        }

        return () => {
            isUnmounting = true;
            storeFn([]);
            if (fetchInInterval) {
                clearInterval(timerRef.current!);
                timerRef.current = null;
            }
            dispatch(valueChange([`${name}.dmapipaginator.metadata`, '']));
        };
    }, [refresh, apiUrl, defaultSearchStr]);

    useEffect(() => {
        searchStrRef.current = searchStr;
        pageNumRef.current = Object.keys(metadata).length > 0 && metadata.currentPage ? metadata.currentPage : 1;
    }, [searchStr, values, defaultSearchStr, defaultCols]);

    useEffect(() => {
        if (!defaultSearchStr) {
            setSearchStr('');
            if (Object.keys(metadata).length > 0) {
                dispatch(valueChange([`${name}.dmapipaginator.metadata`, { ...metadata, currentPage: 1, hasPrev: false }]));
            }
        }
    }, [values[STATIC_KEYS.GLOBAL_SITE_KEY]]);

    useEffect(() => {
        if (defaultSearchStr) {
            setSearchStr(defaultSearchStr);
        }
        return () => {
            dispatch(valueChange(['pagination.filter.value', '']));
            dispatch(valueChange(['columns.filter.apply', '']));
        };
    }, [defaultSearchStr]);

    function addSubFilterQuery(obj: any) {
        let isAvailable = false;
        if (Object.keys(apiQuery).length !== 0 && apiQuery[obj.query] && apiQuery[obj.query].includes(obj.value)) {
            isAvailable = true;
        }
        if (obj && obj.checked && !isAvailable) {
            setApiQuery({ ...apiQuery, [obj.query]: [...(apiQuery[obj.query] || []), obj.value] });
        } else if (!obj.checked && apiQuery[obj.query]) {
            const apiQ = apiQuery[obj.query];
            const ind = apiQ.indexOf(obj.value);
            if (ind !== -1) {
                apiQ.splice(ind, 1);
            }
            setApiQuery({ ...apiQuery, [obj.query]: apiQ });
        }
    }
    const onNext = (): void => {
        const { nextOffset = 0 } = metadata;
        fetchData(nextOffset, true, []);
        dispatch(valueChange([`${name}.dmapipaginator.metadata`, { ...metadata, currentPage: metadata.currentPage + 1 }]));
    };

    const onBack = (): void => {
        const { currentPage = 0, limit = pageLimit } = metadata;
        fetchData(currentPage * limit - limit * 2, true, []);
        dispatch(valueChange([`${name}.dmapipaginator.metadata`, { ...metadata, currentPage: metadata.currentPage - 1 }]));
    };

    const onSearch = (): void => {
        dispatch(valueChange(['pagination.filter.value', '']));
        dispatch(valueChange([`${name}.dmapipaginator.metadata`, emptyPageInfo]));
        if (Object.keys(metadata).length === 0) {
            fetchData(0, false, []);
            dispatch(valueChange([`${name}.dmapipaginator.metadata`, { ...metadata, currentPage: 1 }]));
        } else {
            fetchData(0, false, []);
        }
    };

    const onPageJump = () => {
        if (metadata.currentPage) {
            fetchData((metadata.currentPage - 1) * pageLimit, false, []);
        } else {
            fetchData(0, false, []);
        }
    };

    const applyFilter = (): void => {
        setIsOpenFilterCol(false);
        dispatch(valueChange([`${name}.dmapipaginator.metadata`, { ...metadata, currentPage: 1 }]));
        fetchData(0, false, []);
    };

    const onKeyPressPageJump = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            onPageJump();
        }
    };

    const onKeyPress = (e: React.KeyboardEvent): void => {
        if (e.key === 'Enter') {
            onSearch();
        }
    };

    const setIntervalToFetch = (): void => {
        if (fetchInInterval && timerRef.current === null) {
            timerRef.current = setInterval(() => {
                if (!searchStrRef.current && pageNumRef.current === 1) {
                    fetchData(0, false, []);
                }
            }, MILI_SECONDS_TIME.TWENTY_THOUSAND);
        }
    };

    const setCurrentPageValue = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { totalPages = 0 } = metadata;
        const valueStr = e.target.value;
        const valInNum = parseInt(valueStr, 10) || 0;

        if (!isNaN(valInNum)) {
            if (valInNum <= 0) {
                dispatch(valueChange([`${name}.dmapipaginator.metadata`, { ...metadata, currentPage: 1, hasPrev: false }]));
            } else if (valInNum > totalPages) {
                dispatch(valueChange([`${name}.dmapipaginator.metadata`, { ...metadata, currentPage: totalPages }]));
            } else {
                dispatch(valueChange([`${name}.dmapipaginator.metadata`, { ...metadata, currentPage: valInNum }]));
            }
        }
    };

    const updateFilterColumns = (field: any) => {
        const cols: any[] = [];
        filterColumns.forEach((f) => {
            if (field.label === f.label) {
                const chF = f;
                chF.checked = !f.checked;
                cols.push(chF);
                if (field?.query) {
                    addSubFilterQuery(chF);
                }
            } else {
                cols.push(f);
            }
        });
        setFilterColumns(cols);
        setForceUpdate(forceUpdate + 1);
    };

    const renderColFilter = () => {
        const dropdownKey = `${forceUpdate}-filter`;
        return (
            <Dropdown id={`filter-${name}`} isOpen={isOpenFilterCol} className="d-inline-block" key={dropdownKey} toggle={() => function et() {}}>
                <DropdownToggle className="btn header-item waves-effect dropdown__col__filter" tag="button" toggle={() => setIsOpenFilterCol(true)}>
                    <a href="#" onClick={() => setIsOpenFilterCol(true)}>
                        <FontAwesomeIcon className="text-muted" size="sm" icon={faFilter} />
                    </a>
                </DropdownToggle>
                <DropdownMenu right>
                    {filterColumns.map((col, ind) => {
                        const { label, field } = col;
                        return (
                            <>
                                {subFilter.length > 0 && ind === filterColumns.length - subFilter.length && subFilterTitle.length > 0 ? (
                                    <>
                                        <hr className="mb-0" />
                                        <CardTitle className="ml-4 mt-2">{subFilterTitle}</CardTitle>
                                    </>
                                ) : null}
                                <DropdownItem key={`filterItem-${label}`}>
                                    <div className="form-check">
                                        <input type="checkbox" className="form-check-input" id={`${label}-${field}`} name={`${label}-${field}`} onChange={() => updateFilterColumns(col)} checked={col.checked === true} />
                                        <label className="form-check-label" htmlFor={`${label}-${field}`}>
                                            {label}
                                        </label>
                                    </div>
                                </DropdownItem>
                            </>
                        );
                    })}
                    <DropdownItem>
                        <a href="#" className="btn btn-link" onClick={() => applyFilter()}>
                            {t('apply.filter')}
                        </a>
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        );
    };

    const renderFilter = () => (
        <div className="input-group">
            <input type="text" className="form-control h-100" id="datableSearch" placeholder="Search" autoComplete="off" value={searchStr} onChange={(e) => setSearchStr(e.target.value)} onKeyPress={(e) => onKeyPress(e)} />
            <span className="input-group-append input-group-text bg-transparent">
                <a href="#" onClick={() => onSearch()}>
                    <FontAwesomeIcon className="text-muted" size="sm" icon={faSearch} />
                </a>
            </span>
            {renderColFilter()}
        </div>
    );

    const renderData = () => {
        const { showFilter } = props;
        const { hasNext = false, hasPrev = false, totalPages = 0, currentPage = 1 } = metadata;
        return (
            <Row>
                {showFilter && showFilter === 'true' ? <Col className="padding-0 margin-0 display__flex__reverse dmapi_col ">{renderFilter()}</Col> : null}
                <Col className="padding-0 margin-0 display__flex__reverse" style={{ height: '35px' }}>
                    <ButtonGroup className="btn-group-sm">
                        <Button disabled={!hasPrev} onClick={onBack}>
                            <FontAwesomeIcon size="xs" icon={faChevronLeft} className="padding-4" />
                        </Button>
                        <div className="input-group input_div">
                            <input type="text" className="paginator_input  paginator_input_div h-100" id="tablecurrentpage" value={currentPage} onChange={(e) => setCurrentPageValue(e)} onKeyPress={(e) => onKeyPressPageJump(e)} />
                            <div className="dmaipaginator_totalpage input-group ">
                                <p className="paginator_input totalpag_text ">{`/ ${totalPages}`}</p>
                            </div>
                        </div>
                        <Button disabled={!hasNext} onClick={onNext}>
                            <FontAwesomeIcon size="xs" icon={faChevronRight} className="padding-4" />
                        </Button>
                    </ButtonGroup>
                </Col>
            </Row>
        );
    };

    return defaultLayout ? (
        renderData()
    ) : (
        <Row className="float-end mb-3" id={name}>
            {renderData()}
        </Row>
    );
};

const mapStateToProps = (state: INITIAL_STATE_INTERFACE) => ({ user: state.user, global: state.global });

export default connect(mapStateToProps)(withTranslation()(DMAPIPaginator));
