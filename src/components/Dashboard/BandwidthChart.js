import React, { Component } from 'react';
import { Card, CardBody } from 'reactstrap';
import ReactApexChart from 'react-apexcharts';
import { callAPI } from '../../utils/ApiUtils';
import { API_DASHBOARD_BANDWIDTH_USAGE } from '../../constants/ApiConstants';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import { addMessage } from '../../store/actions/MessageActions';

class BandwidthChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      series: [
        {
          name: 'GB',
          data: [],
        },
      ],
      options: {
        chart: { toolbar: 'false', foreColor: 'white' },
        dataLabels: { enabled: !1 },
        stroke: { curve: 'smooth', width: 2 },
        markers: { size: 0, style: 'hollow' },
        xaxis: {
          type: 'datetime',
        },
        tooltip: { theme: 'dark', x: { format: 'dd MMM yyyy' } },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.6,
            opacityTo: 0.05,
          },
        },
        grid: {
          xaxis: {
            lines: {
              show: false,
            },
          },
          yaxis: {
            show: false,
            lines: {
              show: false,
            },
          },
        },
        yaxis: {
          show: true,
          showAlways: false,
          labels: {
            show: false,
          },
        },
      },
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    callAPI(API_DASHBOARD_BANDWIDTH_USAGE).then((json) => {
      try {
        let chartPoints = [];
        if (json !== null) {
          json.forEach((item) => {
            chartPoints.push([item.timeStamp * 1000, item.transferredSize.toFixed(2)]);
          });
          chartPoints = chartPoints
            .filter((e) => e.transferredSize !== 0)
            .sort((p, n) => p.timeStamp < n.timeStamp);
          this.setState({ series: [{ name: 'MB', data: chartPoints }] });
        }
      } catch (e) {
        dispatch(addMessage(e.message, MESSAGE_TYPES.ERROR));
      }
    },
    (err) => {
      dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
    });
  }

  render() {
    const { options, series } = this.state;
    return (
      <>
        <Card>
          <CardBody>
            <p className="font-weight-medium color-white">
              Bandwidth Usage
            </p>
            <div>
              <div id="overview-chart" className="apex-charts" dir="ltr">
                <div id="overview-chart-timeline">
                  <ReactApexChart
                    options={options}
                    series={series}
                    type="area"
                    height={160}
                  />
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </>
    );
  }
}

export default BandwidthChart;
