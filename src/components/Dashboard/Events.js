import React, { Component } from 'react';
import { Row, Col, Card, CardBody, Media } from 'reactstrap';

class Events extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [
        { state: '', label: 'New protection plan DMZ-WEBAPP configured successfully.', text: 'text-success' },
        { state: 'bx-fade-right', label: 'Migration started for virtual machine Windows-2012-Mysql.', text: 'text-primary' },
        { state: '', label: 'Test Recovery failed for virtual machine Windows-2016.', text: 'text-danger' },
        { state: '', label: 'Added 5 new virtual machines in protection plan DMZ-WEBAPP.', text: 'text-success' },
        { state: '', label: 'Site configuration updated.', text: 'text-success' },
      ],
    };
  }

  render() {
    const { events } = this.state;
    return (
      <>
        <Card>
          <CardBody>
            <p className="font-weight-medium color-white">
              Events
            </p>
            <Row>
              {events.map((event) => (
                <Col sm={12}>
                  <Media className="padding-10">
                    <div className="mr-4">
                      <h5 className="font-size-16">
                        <i className={`bx bxs-right-arrow-circle ${event.state} ${event.text} font-size-14`} />
                      </h5>
                    </div>
                    <Media body>
                      <div>{event.label}</div>
                    </Media>
                  </Media>
                </Col>
              ))}
            </Row>
          </CardBody>
        </Card>

      </>
    );
  }
}

export default Events;
