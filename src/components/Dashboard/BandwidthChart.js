import React, { Component } from 'react';
import ReactApexChart from 'react-apexcharts';
import { Card, CardBody } from 'reactstrap';
import { API_DASHBOARD_BANDWIDTH_USAGE } from '../../constants/ApiConstants';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import { SUCCESS, DANGER } from '../../constants/ProtectionPlanAnalysisConstant';
import { addMessage } from '../../store/actions/MessageActions';
import { callAPI } from '../../utils/ApiUtils';

class BandwidthChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      series: [
        {
          name: 'Upload Speed (Mbps)',
          data: [],
        },
        {
          name: 'Download Speed (Mbps)',
          data: [],
        },
      ],
      options: {
        chart: { toolbar: 'false', foreColor: 'white', stacked: true },
        colors: [DANGER, SUCCESS],
        dataLabels: { enabled: !1 },
        stroke: { curve: 'smooth', width: 2 },
        markers: { size: 0, style: 'hollow' },
        xaxis: {
          type: 'datetime',
          labels: {
            datetimeUTC: false,
          },
        },
        fill: {
          type: 'gradient',
          gradient: {
            opacityFrom: 0.6,
            opacityTo: 0.8,
          },
        },
        tooltip: { theme: 'dark', x: { format: 'dd MMM yyyy hh:mm' } },
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
        const uploadSpeed = [];
        const downloadSpeed = [];
        if (json !== null) {
          json.forEach((item) => {
            uploadSpeed.push([item.timeStamp * 1000, item.uploadSpeed]);
            downloadSpeed.push([item.timeStamp * 1000, item.downloadSpeed]);
          });
          this.setState({
            series: [
              { name: 'Upload Speed (Mbps)', data: uploadSpeed },
              { name: 'Download Speed (Mbps)', data: downloadSpeed }] });
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
              Bandwidth Usage ( Last 12 hours )
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
