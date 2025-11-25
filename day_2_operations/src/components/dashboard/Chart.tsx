import React from 'react';
import Chart from 'react-apexcharts';
import { connect } from 'react-redux';
import { valueChange } from '../../store/reducers/userReducer';
import { useNavigate } from 'react-router-dom';
import { ChartTooltip } from './ChartToolTip';
import { StackWindowSize } from './StackWindowSize';
import { APPLICATION_THEME, THEME_CONSTANT } from '../../constants/userConstant';
import { Theme, UserInterface } from '../../interfaces/interface';
import { getValue } from '../../utils/apiUtils';
import { formatTime } from '../../utils/appUtils';
import { STATIC_KEYS } from '../../constants/StoreKey';

export interface SeriesData {
    name: string;
    data: number[];
}

export interface ReplicationSeriesProps {
    xValues: string[];
    rto?: number[];
    compression?: number[];
    changeRate?: number[];
    achievedRpo?: number[];
    siteIds?: string[];
    planNames?: string[];
    targetSiteIds?: string[];
    series: SeriesData[];
}

type FieldKey = 'replication' | 'recovery' | 'testRecovery' | 'alert';

interface Props {
    column?: any;
    seriesData: ReplicationSeriesProps;
    height?: number;
    colors: string[];
    showLabel?: boolean;
    horizontal?: boolean;
    onBarClicked?: any;
    onNavigateToReplication?: any;
    dispatch: any;
    user: UserInterface;
    fieldkey: FieldKey;
}

const StackedBarChart: React.FC<Props> = ({ column, seriesData, height = 150, colors, showLabel = false, horizontal = false, onBarClicked, onNavigateToReplication, dispatch, fieldkey, user }) => {
    const { xValues, series, rto = [], compression, changeRate, achievedRpo, siteIds = [], planNames = [], targetSiteIds = [] } = seriesData;
    const navigate = useNavigate();
    const { count, totalFontSize, responsiveColWidth } = StackWindowSize();
    const { values } = user;
    const level = getValue({ key: STATIC_KEYS.GLOBAL_SITE_KEY, values }) || '1';
    const theme = getValue({ key: APPLICATION_THEME, values }) as Theme;
    let data: any = [];
    data = series.map((s: any) => {
        let d = Array.from({ length: count > s.data.length ? s.data.length : count }, (_, i) => {
            let d2 = s.data[i];
            return d2;
        });
        return { name: s.name, data: d };
    });
    const xData = Array.from({ length: count > series[0]?.data.length ? series[0]?.data.length : count }, (_, i) => xValues[i]);
    const handleCategoryClick = (category: string, planName: string) => {
        if (onNavigateToReplication !== null) {
            if (fieldkey !== 'replication' && level.length > 1) {
                dispatch(valueChange([STATIC_KEYS.GLOBAL_SITE_KEY, category]));
            }
            dispatch(valueChange(['pagination.filter.value', planName]));
            dispatch(valueChange(['columns.filter.apply', column]));
            navigate(onNavigateToReplication);
        } else if (onBarClicked) {
            onBarClicked(dispatch, category);
        }
    };

    const options = {
        chart: {
            type: 'bar',
            stacked: true,
            toolbar: { show: false },
            events: {
                dataPointMouseEnter: (event: any) => {
                    if (onBarClicked || onNavigateToReplication) event.target.style.cursor = 'pointer';
                },
                dataPointSelection: (_event: any, _ctx: any, { dataPointIndex }: any) => {
                    handleCategoryClick(fieldkey !== 'replication' && level.length > 1 ? targetSiteIds[dataPointIndex] : siteIds[dataPointIndex], planNames[dataPointIndex]);
                },
            },
        },
        grid: { show: false },
        yaxis: {
            labels: {
                show: false,
                style: {
                    colors: THEME_CONSTANT.DASHBOARD_CHARTS?.XAXIS?.[theme || 'dark'], // Change this to your desired color
                    fontSize: '14px', // Optional: Adjust font size
                },
            },
        },
        xaxis: {
            categories: xData,
            labels: {
                style: {
                    colors: THEME_CONSTANT.DASHBOARD_CHARTS?.XAXIS?.[theme || 'dark'], // Change this to your desired color
                    fontSize: totalFontSize, // Optional: Adjust font size
                },
                trim: true,
            },
        },
        plotOptions: {
            bar: {
                horizontal,
                columnWidth: responsiveColWidth,
                dataLabels: {
                    enabled: showLabel,
                    total: {
                        enabled: true,
                        formatter: (totalValue: number, { dataPointIndex }: any) => {
                            // Here, dataPointIndex corresponds to the bar series index.
                            const rtoValue = formatTime(rto[dataPointIndex]); // Access RTO using dataPointIndex
                            return `${fieldkey === 'replication' ? `RPO: ${rtoValue ? rtoValue : 0}` : fieldkey === 'recovery' ? `RTO: ${rtoValue ? rtoValue : 0}` : ''}`; // handle undefined
                        },
                        style: {
                            fontSize: totalFontSize,
                            fontWeight: 600,
                            color: THEME_CONSTANT.DASHBOARD_CHARTS?.XAXIS?.[theme || 'dark'], // Ensure visibility against the chart background
                        },
                        // style: { fontSize: totalFontSize, fontWeight: 600, color: '#fff' },
                    },
                },
            },
        },
        legend: { position: 'bottom', show: true, labels: { colors: THEME_CONSTANT.DASHBOARD_CHARTS?.XAXIS?.[theme || 'dark'] }, fontSize: totalFontSize },
        dataLabels: {
            enabled: showLabel || false,
            style: {
                fontSize: totalFontSize,
                fontWeight: 500,
                colors: ['#fff'],
            },
        },
        // dataLabels: {
        //     enabled: showLabel,
        //     style: { fontSize: totalFontSize, fontWeight: 500, colors: ['#fff'] },
        // },
        colors,
        tooltip: {
            enabled: true,
            // fixed: { enabled: true, offsetY: 0, offsetX: -450 },
            theme: 'dark',
            style: { fontSize: '14px', fontWeight: 'bold', marginLeft: '5%' },
            y: { formatter: (val: any) => `${val}` },
            custom: (params: any) => ChartTooltip(params, fieldkey, { rto, achievedRpo, changeRate, compression }, theme),
        },
    };

    return <Chart options={options} series={data} type="bar" height={height} />;
};

// export default StackedBarChart;
const mapStateToProps = (state: any) => {
    const { dashboard, user } = state;
    return { dashboard, user };
};

export default connect(mapStateToProps)(StackedBarChart);
