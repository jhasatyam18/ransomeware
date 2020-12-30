import React, { Component } from 'react';
import { Button, ButtonGroup } from 'reactstrap';

// Import Images

class DMTPaginator extends Component {
  constructor() {
    super();
    // totalRows: 0, index: 0, maxRowPerPage: 10, data: [],
    this.state = { enablePrivious: false, enableNext: false };
  }

  render() {
    const { enablePrivious, enableNext } = this.state;
    return (
      <>
        <ButtonGroup>
          <Button disabled={enablePrivious}>Privious</Button>
          <Button disabled={enableNext}>Next</Button>
        </ButtonGroup>
      </>
    );
  }
}

export default DMTPaginator;
