import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { connect, useSelector } from 'react-redux';
import ReactApexChart from 'react-apexcharts';
import { Card, CardBody } from 'reactstrap';
import { API_DASHBOARD_BANDWIDTH_USAGE } from '../../constants/ApiConstants';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import { DANGER, SUCCESS } from '../../constants/ProtectionPlanAnalysisConstant';
import { addMessage } from '../../store/actions/MessageActions';
import { callAPI } from '../../utils/ApiUtils';
import Spinner from '../Common/Spinner';
import { APPLICATION_THEME, THEME_CONSTANT } from '../../constants/UserConstant';

function BandwidthChart(props) {
  const refresh = useSelector((state) => state.user.context.refresh);
  const [loading, setLoading] = useState(false);
  const { dispatch, t } = props;
  const upLoadSpeedTitle = t('upload.speed.mbps');
  const downloadSpeedTitle = t('download.speed.mbps');

  const theme = localStorage.getItem(APPLICATION_THEME) || '';
  const [state, setState] = useState({
    series: [
      {
        name: upLoadSpeedTitle,
        data: [],
      },
      {
        name: downloadSpeedTitle,
        data: [],
      },
    ],
    options: {
      chart: { toolbar: 'false', foreColor: THEME_CONSTANT.BANDWIDTH.XAXIX[theme], stacked: true },
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
      tooltip: { theme, x: { format: 'dd MMM yyyy hh:mm' } },
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
  });

  useEffect(() => {
    let isUnmounting = false;
    setLoading(true);
    setState({ ...state, series: [{ name: upLoadSpeedTitle, data: [] }, { name: downloadSpeedTitle, data: [] }] });
    callAPI(API_DASHBOARD_BANDWIDTH_USAGE).then((json) => {
      if (isUnmounting) return;
      try {
        setLoading(false);
        const uploadSpeed = [];
        const downloadSpeed = [];
        if (json !== null) {
          json.forEach((item) => {
            uploadSpeed.push([item.timeStamp * 1000, item.uploadSpeed]);
            downloadSpeed.push([item.timeStamp * 1000, item.downloadSpeed]);
          });
          setState({ ...state, options: { ...state.options, chart: { ...state.options.chart, foreColor: THEME_CONSTANT.BANDWIDTH.XAXIX[theme] }, tooltip: { ...state.toolbar, theme } }, series: [{ name: upLoadSpeedTitle, data: uploadSpeed }, { name: downloadSpeedTitle, data: downloadSpeed }] });
        }
      } catch (e) {
        if (isUnmounting) return;
        setLoading(false);
        dispatch(addMessage(e.message, MESSAGE_TYPES.ERROR));
      }
    },
    (err) => {
      if (isUnmounting) return;
      setLoading(false);
      dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
    });
    return () => {
      isUnmounting = true;
    };
  }, [refresh, theme]);

  if (loading === true) {
    return (
      <>
        <Card>
          <CardBody>
            <p className="font-weight-medium color-white">
              {t('dashboard.bandwidth.usage.title')}
            </p>
            <div>
              <Spinner />
            </div>
          </CardBody>
        </Card>
      </>
    );
  }

  const render = () => {
    const { options, series } = state;
    return (
      <>
        <Card className="box-shadow">
          <CardBody>
            <p className="font-weight-medium color-white">
              {t('dashboard.bandwidth.usage.title')}
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
  };
  return render();
}

const mapStateToProps = (state) => {
  const { user } = state;
  return { user };
};

export default connect(mapStateToProps)(withTranslation()(BandwidthChart));
