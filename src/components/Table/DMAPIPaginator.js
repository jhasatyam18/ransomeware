import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { connect, useSelector } from 'react-redux';
import { Button, ButtonGroup, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row } from 'reactstrap';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import { hideApplicationLoader, showApplicationLoader } from '../../store/actions';
import { addMessage } from '../../store/actions/MessageActions';
import { callAPI } from '../../utils/ApiUtils';

function DMAPIPaginator(props) {
  const emptyPageInfo = { limit: 100, currentPage: 0, hasNext: false, hasPrev: false, nextOffset: 0, pageRecords: 0, totalPages: 0, totalRecords: 0 };
  const [pageInfo, setPageInfo] = useState(emptyPageInfo);
  const [current, setCurrent] = useState();
  const { apiUrl, storeFn, dispatch, columns, t, isParameterizedUrl, name } = props;
  const [isOpenFilterCol, toggleFilterCol] = useState(false);
  const [filterColumns, setFilterColumns] = useState([]);
  const [forceUpdate, setForceUpdate] = useState(1);
  const [searchStr, setSearchStr] = useState('');
  const refresh = useSelector((state) => state.user.context.refresh);

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
      // include search value and field in the API
      const applicableCols = filterColumns.filter((f) => f.checked === true);
      if (applicableCols.length > 0) {
        const searchFields = applicableCols.map((m) => m.field).join(',');
        url = `${url}&searchstr=${searchStr}&searchcol=${searchFields}`;
      }
    }
    return url;
  };

  const fetchData = (offset = 0) => {
    const url = getUrl(offset);
    dispatch(showApplicationLoader(url, 'loading...'));
    dispatch(storeFn([]));
    callAPI(url).then((json) => {
      dispatch(hideApplicationLoader(url));
      const { records, ...others } = json;
      setPageInfo({ ...others, limit: 100 });
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
      const cols = Array.from(columns);
      setFilterColumns(cols.filter((c) => c.allowFilter));
    }
    return () => {
      isUnmounting = true;
    };
  }, [refresh]);

  const onNext = () => {
    const { nextOffset } = pageInfo;
    fetchData(nextOffset);
  };

  const onBack = () => {
    const { currentPage, limit } = pageInfo;
    fetchData((currentPage * limit) - (limit * 2));
  };

  const onSearch = () => {
    setPageInfo(emptyPageInfo);
    fetchData(0);
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

  const renderFilter = () => {
    const { showFilter } = props;
    if (showFilter && showFilter === 'true') {
      return (
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
    }
    return null;
  };

  const setCurrentValue = (e) => {
    setCurrent(e);
  };
  const renderData = () => {
    const { hasNext, hasPrev, currentPage, totalPages } = pageInfo;
    return (
      <Row>
        <Col className="padding-0 margin-0 display__flex__reverse dmapi_col">
          {renderFilter()}
        </Col>
        <Col className="padding-0 margin-0 display__flex__reverse">
          <ButtonGroup className="btn-group-sm padding-right-20">
            <Button disabled={!hasPrev} onClick={onBack}>
              <box-icon type="solid" name="chevron-left" size="xs" />
            </Button>
            <div className="input-group ">
              <div className="w-20 input-group ">
                <input type="number" className="form-control input_none_border" id="tablecurrentpage" autoComplete="off" value={current || currentPage} onChange={(e) => setCurrentValue(e.target.value)} onKeyPress={(e) => onKeyPress(e)} />
                <span className="input-group-append input_span">
                  /
                </span>
              </div>
              <div className="w-20 input-group ">
                <input type="number" className="form-control input_none_border" id="tableTotalPage" autoComplete="off" value={totalPages} />
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
