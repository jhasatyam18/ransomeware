import React, { Component } from 'react';
import { Button, ButtonGroup } from 'reactstrap';

class DMTPaginator extends Component {
  constructor() {
    super();
    this.state = { totalRows: 0, disablePrivious: false, disableNext: false, index: 0, maxRowPerPage: 10 };
    this.onNext = this.onNext.bind(this);
    this.onBack = this.onBack.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.data.length !== prevState.totalRows) {
      const { data, setData } = nextProps;
      const { index, maxRowPerPage } = prevState;
      const dataToShow = data.slice(index, index + maxRowPerPage);
      setData(dataToShow);
      return ({ index: index + maxRowPerPage, totalRows: data.length, maxRowPerPage: 10, disablePrivious: true, disableNext: !(data.length > maxRowPerPage) });
    }
    return null;
  }

  onNext() {
    const { index, maxRowPerPage } = this.state;
    const { setData, data } = this.props;
    if (index < data.length) {
      const dataToShow = data.slice(index, index + maxRowPerPage);
      this.setState({ index: index + maxRowPerPage, disableNext: !(data.length > index + maxRowPerPage), disablePrivious: !(index + maxRowPerPage > maxRowPerPage) });
      setData(dataToShow);
    }
  }

  onBack() {
    const { index, maxRowPerPage } = this.state;
    const { setData, data } = this.props;
    const strat = index - (maxRowPerPage * 2);
    const dataToShow = data.slice(strat, index - maxRowPerPage);
    this.setState({ index: index - maxRowPerPage, disableNext: !(data.length > index - maxRowPerPage), disablePrivious: !(index - maxRowPerPage > maxRowPerPage) });
    setData(dataToShow);
  }

  render() {
    const { disablePrivious, disableNext, maxRowPerPage } = this.state;
    const { totalRows, index } = this.state;
    const tPages = totalRows / maxRowPerPage;
    const cP = (index > 0 ? index / maxRowPerPage : 0);
    return (
      <>
        <ButtonGroup style={{ paddingLeft: 20 }}>
          <Button disabled={disablePrivious} onClick={this.onBack}>
            <box-icon type="solid" name="chevron-left" size="xs" />
          </Button>
          <Button>
            Page
            &nbsp;&nbsp;
            {cP}
            &nbsp;&nbsp;
            of
            &nbsp; &nbsp;
            {tPages}
          </Button>
          <Button disabled={disableNext} onClick={this.onNext}>
            <box-icon type="solid" name="chevron-right" size="xs" />
          </Button>
        </ButtonGroup>
      </>
    );
  }
}

export default DMTPaginator;
