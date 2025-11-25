import { faChevronLeft, faChevronRight, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component } from 'react';
import { Button, ButtonGroup, Col, Popover, PopoverBody, Row } from 'reactstrap';
import { arraysAreNotEqual } from '../../utils/AppUtils';

class DMTPaginator extends Component {
  constructor() {
    super();
    this.state = { popoverOpen: false, data: [], disablePrevious: false, disableNext: false, index: 0, maxRowPerPage: 100, searchStr: '' };
    this.onNext = this.onNext.bind(this);
    this.onBack = this.onBack.bind(this);
    this.onFilter = this.onFilter.bind(this);
    this.onFilterBlur = this.onFilterBlur.bind(this);
    this.onFilterFocus = this.onFilterFocus.bind(this);
    this.onFilterKeyPress = this.onFilterKeyPress.bind(this);
    this.inputRef = React.createRef();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (arraysAreNotEqual(nextProps.data, prevState.data)) {
      const { data, setData } = nextProps;
      const { maxRowPerPage } = prevState;
      const dataToShow = data.slice(0, 0 + maxRowPerPage);
      setData(dataToShow);
      return ({ index: 0 + maxRowPerPage, data, maxRowPerPage: 100, disablePrevious: true, disableNext: !(data.length > maxRowPerPage) });
    }
    return null;
  }

  onFilterFocus(e) {
    const { onFilterFocus } = this.props;
    if (onFilterFocus) {
      onFilterFocus(e);
    }
  }

  onSearchChange = (e) => {
    this.setState({
      searchStr: e.target.value,
    });
  };

  onFilterKeyPress(e) {
    if (e.key === 'Enter') {
      this.onFilter(e);
    }
  }

  onFilterBlur(e) {
    const { onFilterBlur } = this.props;
    if (onFilterBlur) {
      onFilterBlur(e);
    }
  }

  onFilter(e = null) {
    const { onFilter } = this.props;
    const { searchStr } = this.state;
    this.setState({ popoverOpen: false });
    const criteria = (e !== null && typeof e.target.value !== 'undefined' ? e.target.value : searchStr);
    if (onFilter) {
      onFilter(criteria);
    }
  }

  onNext() {
    const { index, maxRowPerPage } = this.state;
    const { setData, data } = this.props;
    if (index < data.length) {
      const dataToShow = data.slice(index, index + maxRowPerPage);
      this.setState({ index: index + maxRowPerPage, disableNext: !(data.length > index + maxRowPerPage), disablePrevious: !(index + maxRowPerPage > maxRowPerPage) });
      setData(dataToShow);
    }
  }

  onBack() {
    const { index, maxRowPerPage } = this.state;
    const { setData, data } = this.props;
    const start = index - (maxRowPerPage * 2);
    const dataToShow = data.slice(start, index - maxRowPerPage);
    this.setState({ index: index - maxRowPerPage, disableNext: !(data.length > index - maxRowPerPage), disablePrevious: !(index - maxRowPerPage > maxRowPerPage) });
    setData(dataToShow);
  }

  setPopoverOpen = (show) => {
    this.setState({
      popoverOpen: show,
    });
  };

  getHelpText(html) {
    return (
      <div>
        {html}
      </div>
    );
  }

  renderFilter() {
    const { showFilter, filterHelpText, id } = this.props;
    const { popoverOpen } = this.state;
    if (showFilter && showFilter === 'true') {
      return (
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            ref={this.inputRef}
            id={id || 'datableSearch'}
            placeholder="Search"
            onFocus={this.onFilterFocus}
            onBlur={this.onFilterBlur}
            onKeyPress={this.onFilterKeyPress}
            onChange={this.onSearchChange}
            onMouseEnter={() => this.setPopoverOpen(true)}
            onMouseLeave={() => this.setPopoverOpen(false)}
            autoComplete="off"
          />
          <span className="input-group-append input-group-text  bg-transparent">
            <div className=" bg-transparent">
              <FontAwesomeIcon size="sm" icon={faSearch} onClick={this.onFilter} />
            </div>
          </span>
          {filterHelpText ? (
            <Popover placement="bottom" isOpen={popoverOpen} target={this.inputRef} style={{ backgroundColor: '#222736' }}>
              <PopoverBody style={{ color: 'white' }}>
                {this.getHelpText(filterHelpText)}
              </PopoverBody>
            </Popover>
          ) : null}
        </div>
      );
    }
    return null;
  }

  renderData() {
    const { disablePrevious, disableNext, maxRowPerPage } = this.state;
    const { data, index } = this.state;
    const tPages = Math.ceil(data.length / maxRowPerPage);
    const cP = (index > 0 ? Math.ceil(index / maxRowPerPage) : 0);
    return (
      <Row>
        <Col className=" margin-0 display__flex__reverse dmapi_col">
          {this.renderFilter()}
        </Col>
        <Col className=" margin-0 display__flex__reverse">
          <ButtonGroup className="btn-group-sm ">
            <Button disabled={disablePrevious} onClick={this.onBack}>
              <FontAwesomeIcon size="xs" icon={faChevronLeft} className="padding-4 pt-2" />
            </Button>
            <Button>
              {cP}
              &nbsp;
              /
              &nbsp;
              {tPages}
            </Button>
            <Button disabled={disableNext} onClick={this.onNext}>
              <FontAwesomeIcon size="xs" icon={faChevronRight} className="padding-4 pt-2" />
            </Button>

          </ButtonGroup>
        </Col>
      </Row>
    );
  }

  render() {
    const { defaultLayout } = this.props;
    if (defaultLayout) {
      return (this.renderData());
    }
    return (
      <Row className="float-end">
        {this.renderData()}
      </Row>
    );
  }
}

export default DMTPaginator;
