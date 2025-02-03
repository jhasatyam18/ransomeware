import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { connect, useSelector } from 'react-redux';
import { Button, ButtonGroup, CardTitle, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row } from 'reactstrap';
import { MILI_SECONDS_TIME } from '../../constants/EventConstant';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import { API_LIMIT_HUNDRED } from '../../constants/UserConstant';
import { hideApplicationLoader, showApplicationLoader, valueChange } from '../../store/actions';
import { addMessage } from '../../store/actions/MessageActions';
import { callAPI, removeSimilarQuery } from '../../utils/ApiUtils';
import { getValue } from '../../utils/InputUtils';

function DMAPIPaginator(props) {
  const { pageLimit = API_LIMIT_HUNDRED, fetchInInterval = undefined, subFilter = [], subFilterTitle = '' } = props;
  const emptyPageInfo = { limit: pageLimit, currentPage: 0, hasNext: false, hasPrev: false, nextOffset: 0, pageRecords: 0, totalPages: 0, totalRecords: 0 };
  const { apiUrl, storeFn, dispatch, columns, t, isParameterizedUrl, name, user } = props;
  const { values } = user;
  const metadata = getValue(`${name}.dmapipaginator.metadata`, values) || {};
  const [isOpenFilterCol, toggleFilterCol] = useState(false);
  const [filterColumns, setFilterColumns] = useState([]);
  const [forceUpdate, setForceUpdate] = useState(1);
  const [searchStr, setSearchStr] = useState('');
  const [apiQuery, setApiQuery] = useState({});
  const refresh = useSelector((state) => state.user.context.refresh);
  const timerRef = useRef(null);
  const searchStrRef = useRef(searchStr);
  const pageNummRef = useRef(Object.keys(metadata).length > 0 ? metadata.currentPage : 1);

  const getBaseURL = () => {
    if (isParameterizedUrl === 'true') {
      return `${apiUrl}&`;
    }
    return `${apiUrl}?`;
  };

  const getUrl = (offset) => {
    let url = getBaseURL();
    if (offset === 0) {
      url = `${url}limit=${Object.keys(metadata).length > 0 ? metadata.limit : pageLimit}`;
    } else {
      url = `${url}offset=${offset}&limit=${Object.keys(metadata).length > 0 ? metadata.limit : pageLimit}`;
    }
    if (searchStr !== '') {
      // include encoded search value and field in the API
      const encodedSearchStr = encodeURIComponent(searchStr.trim());
      const applicableCols = filterColumns.filter((f) => f.checked === true);
      if (applicableCols.length > 0) {
        const searchFields = applicableCols.map((m) => m.field).join(',');
        url = `${url}&searchstr=${encodedSearchStr}&searchcol=${searchFields}`;
      }
    }
    return removeSimilarQuery(url, apiQuery);
  };

  const fetchData = (offset = 0, onPgaeChange) => {
    const url = getUrl(offset);

    /**
    * if there is a continuous fetching of data in an interval then loader comes and it's gets annoying for user to see it continuous
      hence removed loader also
    */

    if (!fetchInInterval || onPgaeChange) {
      dispatch(showApplicationLoader(url, 'loading...'));
    }

    /**
    * if there is a continuous fetching of data in an interval then table shows empty until it fetches the data
      hence for interval removed confition to empty the data
    */

    if (!fetchInInterval || onPgaeChange) {
      dispatch(storeFn([]));
    }
    callAPI(url).then((json) => {
      dispatch(hideApplicationLoader(url));
      const { records, ...others } = json;
      dispatch(valueChange(`${name}.dmapipaginator.metadata`, { ...others, limit: pageLimit || API_LIMIT_HUNDRED }));
      dispatch(storeFn(records));
      return json;
    },
    (err) => {
      dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      dispatch(hideApplicationLoader(url));
      return false;
    });
  };

  useEffect(() => {
    let isUnmounting = false;
    if (!isUnmounting) {
      const pagec = Object.keys(metadata).length > 0 ? metadata.currentPage : 0;
      dispatch(valueChange(`${name}.dmapipaginator.metadata`, { ...metadata, currentPage: Object.keys(metadata).length > 0 ? metadata.currentPage : 1 }));
      const cols = Array.from(columns);
      const arr = [...cols.filter((c) => c.allowFilter), ...subFilter];
      setFilterColumns(arr);
      setIntervalToFetch();
      subFilter?.forEach((f) => {
        addSubFilterQuery(f);
      },
      );
      fetchData(pagec > 0 ? (pagec - 1) * API_LIMIT_HUNDRED : pagec * API_LIMIT_HUNDRED);
    }
    return () => {
      isUnmounting = true;
      dispatch(storeFn([]));
      if (typeof fetchInInterval !== 'undefined') {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [refresh]);

  useEffect(() => {
    searchStrRef.current = searchStr;
    pageNummRef.current = Object.keys(metadata).length > 0 ? metadata.currentPage : 1;
  }, [searchStr, metadata]);

  const onNext = () => {
    const { nextOffset = 0 } = metadata;
    fetchData(nextOffset, true);
    dispatch(valueChange(`${name}.dmapipaginator.metadata`, { ...metadata, currentPage: metadata.currentPage + 1 }));
  };

  const onBack = () => {
    const { currentPage = 0, limit = pageLimit } = metadata;
    fetchData((currentPage * limit) - (limit * 2), true);
    dispatch(valueChange(`${name}.dmapipaginator.metadata`, { ...metadata, currentPage: metadata.currentPage - 1 }));
  };

  const onSearch = () => {
    dispatch(valueChange(`${name}.dmapipaginator.metadata`, emptyPageInfo));
    if (Object.keys(metadata).length === 0) {
      fetchData(0);
      dispatch(valueChange(`${name}.dmapipaginator.metadata`, { ...metadata, currentPage: 1 }));
    } else {
      fetchData(0);
    }
  };

  const onPageJump = () => {
    if (metadata.currentPage) {
      fetchData((metadata.currentPage - 1) * API_LIMIT_HUNDRED);
    } else {
      fetchData(0);
    }
  };

  const applyFilter = () => {
    toggleFilterCol(false);
    dispatch(valueChange(`${name}.dmapipaginator.metadata`, { ...metadata, currentPage: 1 }));
    fetchData(0);
  };

  const onKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };
  const onKeyPressPageJump = (e) => {
    if (e.key === 'Enter') {
      onPageJump();
    }
  };

  function setIntervalToFetch() {
    if (fetchInInterval) {
      if (timerRef.current === null) {
        timerRef.current = setInterval(() => {
          if ((searchStrRef.current === '' && searchStrRef.current.length === 0) && pageNummRef.current === 1) {
            fetchData(0);
          }
        }, MILI_SECONDS_TIME.TWENTY_THOUSAND_MS);
      }
    }
  }

  const setCurrentPageValue = (e) => {
    const { totalPages = 0 } = metadata;
    const numStr = ' 0123456789';
    const valueStr = e.target.value[e.target.value.length - 1] || '';
    const valInNum = parseInt(e.target.value, 10) || '';
    if (numStr.indexOf(valueStr) !== -1) {
      if (valInNum < 0) {
        dispatch(valueChange(`${name}.dmapipaginator.metadata`, { ...metadata, currentPage: 1 }));
      } else if (valInNum > totalPages) {
        dispatch(valueChange(`${name}.dmapipaginator.metadata`, { ...metadata, currentPage: totalPages }));
      } else {
        dispatch(valueChange(`${name}.dmapipaginator.metadata`, { ...metadata, currentPage: valInNum }));
      }
    }
  };

  const updateFilterColumns = (field) => {
    const cols = [];
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

  function addSubFilterQuery(obj) {
    let isAvailable = false;
    if (Object.keys(apiQuery).length !== 0 && (apiQuery[obj.query] && apiQuery[obj.query].includes(obj.value))) {
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

  const renderColFilter = () => {
    const dropdownKey = `${forceUpdate}-filter`;
    return (
      <Dropdown
        id={`filter-${name}`}
        isOpen={isOpenFilterCol}
        className="d-inline-block"
        key={dropdownKey}
        toggle={() => function et() { }}
      >
        <DropdownToggle
          className="btn header-item waves-effect dropdown__col__filter"
          id="datagridColFilter"
          tag="button"
          toggle={() => toggleFilterCol(true)}
        >
          <a href="#" onClick={() => toggleFilterCol(true)}>
            <i className="fas fa-filter text-secondary" />
          </a>
        </DropdownToggle>
        <DropdownMenu right>
          {
            filterColumns.map((col, ind) => {
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
                    <div className="custom-control custom-checkbox">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id={`${label}-${field}`}
                        name={`${label}-${field}`}
                        onChange={() => updateFilterColumns(col)}
                        checked={col.checked === true}
                      />
                      <label
                        className="custom-control-label"
                        htmlFor={`${label}-${field}`}
                      >
                        {label}
                      </label>
                    </div>
                  </DropdownItem>
                </>
              );
            })
          }
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
      <input type="text" className="form-control" id="datableSearch" placeholder="Search" autoComplete="off" value={searchStr} onChange={(e) => setSearchStr(e.target.value)} onKeyPress={(e) => onKeyPress(e)} />
      <span className="input-group-append">
        <div className="input-group-text bg-transparent">
          <a href="#" onClick={() => onSearch()}>
            <i className="fas fa-search text-secondary" />
          </a>
        </div>
      </span>
      {renderColFilter()}
    </div>
  );

  const renderData = () => {
    const { showFilter } = props;
    const { hasNext = false, hasPrev = false, totalPages = 0 } = metadata;
    return (
      <Row>
        {showFilter && showFilter === 'true' ? (
          <Col className="padding-0 margin-0 display__flex__reverse dmapi_col ">
            {renderFilter()}
          </Col>
        ) : null}
        <Col className="padding-0 margin-0 display__flex__reverse padding-right-20">
          <ButtonGroup className="btn-group-sm">
            <Button disabled={!hasPrev} onClick={onBack}>
              <FontAwesomeIcon size="xs" icon={faChevronLeft} className="padding-4" />
            </Button>
            <div className="input-group input_div">
              <input type="text" className="paginator_input  paginator_input_div  " id="tablecurrentpage" value={metadata.currentPage} onChange={(e) => setCurrentPageValue(e)} onKeyPress={(e) => onKeyPressPageJump(e)} />
              <div className="dmaipaginator_totalpage input-group ">
                <p className="paginator_input totalpag_text ">
                  {`/ ${totalPages}`}
                </p>
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

  const render = () => {
    const { defaultLayout } = props;
    if (defaultLayout) {
      return (renderData());
    }
    return (
      <Row className="float-right" id={name}>
        {renderData()}
      </Row>
    );
  };

  return render();
}

function mapStateToProps(state) {
  const { user } = state;
  return { user };
}
export default connect(mapStateToProps)(withTranslation()(DMAPIPaginator));
