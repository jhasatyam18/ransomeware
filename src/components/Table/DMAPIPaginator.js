import React, { useEffect, useRef, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { connect, useSelector } from 'react-redux';
import { Button, ButtonGroup, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row } from 'reactstrap';
import { MILI_SECONDS_TIME } from '../../constants/EventConstant';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import { API_LIMIT_HUNDRED } from '../../constants/UserConstant';
import { hideApplicationLoader, showApplicationLoader } from '../../store/actions';
import { addMessage } from '../../store/actions/MessageActions';
import { callAPI } from '../../utils/ApiUtils';

function DMAPIPaginator(props) {
  const { pageLimit = API_LIMIT_HUNDRED, fetchInInterval = undefined } = props;
  const emptyPageInfo = { limit: pageLimit, currentPage: 0, hasNext: false, hasPrev: false, nextOffset: 0, pageRecords: 0, totalPages: 0, totalRecords: 0 };
  const [pageInfo, setPageInfo] = useState(emptyPageInfo);
  const [currentP, setCurrentPage] = useState(emptyPageInfo.currentPage);
  const { apiUrl, storeFn, dispatch, columns, t, isParameterizedUrl, name } = props;
  const [isOpenFilterCol, toggleFilterCol] = useState(false);
  const [filterColumns, setFilterColumns] = useState([]);
  const [forceUpdate, setForceUpdate] = useState(1);
  const [searchStr, setSearchStr] = useState('');
  const refresh = useSelector((state) => state.user.context.refresh);
  const timerRef = useRef(null);
  const searchStrRef = useRef(searchStr);
  const pageNummRef = useRef(currentP);

  const getBaseURL = () => {
    if (isParameterizedUrl === 'true') {
      return `${apiUrl}&`;
    }
    return `${apiUrl}?`;
  };

  const getUrl = (offset) => {
    let url = getBaseURL();
    if (offset === 0) {
      url = `${url}limit=${pageInfo.limit}`;
    } else {
      url = `${url}offset=${offset}&limit=${pageInfo.limit}`;
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
    return url;
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
      setPageInfo({ ...others, limit: pageLimit || API_LIMIT_HUNDRED });
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
      fetchData(0);
      setCurrentPage(1);
      const cols = Array.from(columns);
      setFilterColumns(cols.filter((c) => c.allowFilter));
      setIntervalToFetch();
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
    pageNummRef.current = currentP;
  }, [searchStr, currentP]);

  const onNext = () => {
    const { nextOffset } = pageInfo;
    fetchData(nextOffset, true);
    setCurrentPage((currentP + 1));
  };

  const onBack = () => {
    const { currentPage, limit } = pageInfo;
    fetchData((currentPage * limit) - (limit * 2), true);
    setCurrentPage(currentP - 1);
  };

  const onSearch = () => {
    setPageInfo(emptyPageInfo);
    if (currentP === '') {
      fetchData(0);
      setCurrentPage(1);
    } else {
      fetchData((currentP - 1) * API_LIMIT_HUNDRED);
    }
  };

  const applyFilter = () => {
    toggleFilterCol(false);
    fetchData(0);
  };

  const onKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSearch();
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
    const { totalPages } = pageInfo;
    const numStr = ' 0123456789';
    const valueStr = e.target.value[e.target.value.length - 1] || '';
    const valInNum = parseInt(e.target.value, 10) || '';
    if (numStr.indexOf(valueStr) !== -1) {
      if (valInNum < 0) {
        setCurrentPage(1);
      } else if (valInNum > totalPages) {
        setCurrentPage(totalPages);
      } else {
        setCurrentPage(valInNum);
      }
    }
  };

  const updateFilterColumns = (field) => {
    const cols = [];
    filterColumns.forEach((f) => {
      if (field.field === f.field) {
        const chF = f;
        chF.checked = !f.checked;
        cols.push(chF);
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
      <Dropdown id={`filter-${name}`} isOpen={isOpenFilterCol} className="d-inline-block" key={dropdownKey} toggle={() => function et() { }}>
        <DropdownToggle className="btn header-item waves-effect dropdown__col__filter" id="datagridColFilter" tag="button" toggle={() => toggleFilterCol(true)}>
          <a href="#" onClick={() => toggleFilterCol(true)}>
            <i className="fas fa-filter text-secondary" />
          </a>
        </DropdownToggle>
        <DropdownMenu right>
          {
            filterColumns.map((col) => {
              const { label, field } = col;
              return (
                <DropdownItem key={`filterItem-${field}`}>
                  <div className="custom-control custom-checkbox">
                    <input type="checkbox" className="custom-control-input" id={`${name}-${field}`} name={`${name}-${field}`} onChange={() => updateFilterColumns(col)} checked={col.checked === true} />
                    <label className="custom-control-label" htmlFor={`${name}-${field}`}>
                      {label}
                    </label>
                  </div>
                </DropdownItem>
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
    const { hasNext, hasPrev, totalPages } = pageInfo;
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
              <box-icon type="solid" name="chevron-left" size="xs" />
            </Button>
            <div className="input-group input_div">
              <input type="text" className="paginator_input  paginator_input_div  " id="tablecurrentpage" value={currentP} onChange={(e) => setCurrentPageValue(e)} onKeyPress={(e) => onKeyPress(e)} />
              <div className="dmaipaginator_totalpage input-group ">
                <p className="paginator_input totalpag_text ">
                  {`/ ${totalPages}`}
                </p>
              </div>
            </div>
            <Button disabled={!hasNext} onClick={onNext}>
              <box-icon type="solid" name="chevron-right" size="xs" />
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
