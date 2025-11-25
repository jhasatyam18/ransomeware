import { THEME_CONSTANT } from '../../constants/userConstant';
import { Theme } from '../../interfaces/interface';
import { calculateSize, formatTime } from '../../utils/appUtils';

type FieldKey = 'replication' | 'recovery' | 'testRecovery' | 'alert';
interface ChartTooltipValues {
    rto?: number[];
    achievedRpo?: number[];
    changeRate?: number[];
    compression?: number[];
}

export const ChartTooltip = ({ series, seriesIndex, dataPointIndex, w }: any, fieldKey: FieldKey, averageValues: ChartTooltipValues, theme: Theme) => {
    const { rto = [], achievedRpo = [], changeRate = [], compression = [] } = averageValues;
    const category = w.globals.labels[dataPointIndex];

    const STATUS_MAP: Record<FieldKey, { label: string; value: any; color: string; icon: string }[]> = {
        replication: [
            { label: 'In-Sync', value: series[0][dataPointIndex], color: '#28a745', icon: 'far fa-check-circle' },
            { label: 'Exceeds Interval', value: series[1][dataPointIndex], color: '#ffc107', icon: 'fa fa-exclamation-triangle' },
            { label: 'Failed', value: series[2][dataPointIndex], color: '#dc3545', icon: 'fa fa-times-circle' },
        ],
        recovery: [
            { label: 'Passed', value: series[0][dataPointIndex], color: '#28a745', icon: 'fa fa-check-circle' },
            { label: 'Failed', value: series[1][dataPointIndex], color: '#ffc107', icon: 'fa fa-times-circle' },
            { label: 'Not Recovered', value: series[2][dataPointIndex], color: '#dc3545', icon: 'fa fa-exclamation-triangle' },
        ],
        testRecovery: [
            { label: 'Passed', value: series[0][dataPointIndex], color: '#28a745', icon: 'fa fa-check-circle' },
            { label: 'Failed', value: series[1][dataPointIndex], color: '#ffc107', icon: 'fa fa-times-circle' },
            { label: 'Not Tested', value: series[2][dataPointIndex], color: '#dc3545', icon: 'fa fa-exclamation-triangle' },
        ],
        alert: [
            { label: 'Critical', value: series[0][dataPointIndex], color: '#dc3545', icon: 'fa fa-check-circle' },
            { label: 'Error', value: series[1][dataPointIndex], color: '#d88080', icon: 'fa fa-times-circle' },
            { label: 'Major', value: series[2][dataPointIndex], color: '#ffc107', icon: 'fa fa-exclamation-triangle' },
        ],
    };

    const statuses = STATUS_MAP[fieldKey] || [];
    const configuredRPO = `${formatTime(rto[dataPointIndex])}`;
    const achievedRPO = `${formatTime(achievedRpo[dataPointIndex])}`;
    const changeRateVal = `${calculateSize(changeRate[dataPointIndex])}`;
    const compressionVal = `${compression[dataPointIndex]} %`;

    return `
    <div style="padding: 15px; border-radius: 2px; background: ${THEME_CONSTANT.CUSTOM_DURATION?.[theme || 'dark']}; color: ${THEME_CONSTANT.DASHBOARD_CHARTS.XAXIS?.[theme || 'dark']}; font-size: 10px;box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2); max-width: 400px; min-width: 170px; font-family: 'Arial', sans-serif;">
      <div style="font-weight: bold; color: ${THEME_CONSTANT.DASHBOARD_CHARTS.XAXIS?.[theme || 'dark']};font-size: 13px; margin-bottom: 6px;">${category}</div>
      ${statuses
          .map(
              (status) => `
                          <div style="
                              display: flex;
                              justify-content: space-between;
                              font-size: 11px;
                              margin-bottom: 3px;
                              margin-left: 6px;
                          ">
                            <span style="color: ${status.color};">
                              <i className="${status.icon}"></i> ${status.label}: ${status.value}
                            </span>
                          </div>
                        `,
          )
          .join('')}
      <hr style="border-color: ${THEME_CONSTANT.GRAPH_TOOLTIP_HR?.[theme || 'dark']}; margin-bottom: 5px;" />
      ${rto.length > 0 && fieldKey === 'replication' ? `<div style="font-size: 11px;"><i className="fa fa-spinner fa-spin" /><strong>Average Configured RPO:</strong> ${configuredRPO}</div>` : ''}
      ${fieldKey !== 'testRecovery' ? `<div style="font-size: 11px;"><strong>Average Achieved ${fieldKey === 'replication' ? 'RPO' : 'RTO'}:</strong> ${achievedRPO}</div>` : ''}
      ${changeRate && fieldKey === 'replication' ? `<div style="font-size: 11px;"><strong>Average Change Rate:</strong> ${changeRateVal}</div>` : ''}
      ${compression && fieldKey === 'replication' ? `<div style="font-size: 11px;"><strong>Average Compression:</strong> ${compressionVal}</div>` : ''}
    </div>
  `;
};
