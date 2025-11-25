import { STATIC_KEYS } from '../constants/StoreKey';
import { getValue } from './apiUtils';

interface SiteRecord {
    siteName: string;
    siteID: string;
    recoverySiteID: string;
    passedCount?: number;
    exceedIntervalCount?: number;
    failedCount: number;
    averageConfiguredRPO: number;
    averageAchievedRPO: number;
    averageChangeRate: number;
    averageCompressionRatio: number;
    passed?: number;
    notRecovered?: number;
    notTested?: number;
    protectionPlanName: string;
    notTestedCount: number;
    averageAchivedRTO: number;
}

export function sumColumn(matrix: number[][], index: number) {
    return matrix.reduce((sum, row) => sum + (row[index] || 0), 0);
}

export const structureDataForChart = (data: SiteRecord[] = [], fieldkey: string, user: any, mode: 'replication' | 'recovery' | 'test-recovery') => {
    const { values } = user;
    const lavel = getValue({ key: STATIC_KEYS.GLOBAL_SITE_KEY, values }) || '1';
    const xValues = data.map((item) => (lavel.length > 1 ? item.protectionPlanName : item.siteName));
    const siteIds = data.map((item) => item.siteID);
    const targetSiteIds = data.map((item) => item.recoverySiteID);
    const planNames = data.map((item) => item.protectionPlanName);

    // capture all averages you care about
    const rto = data.map((item) => (mode === 'replication' ? item.averageConfiguredRPO : item.averageAchivedRTO));
    const achievedRpo = data.map((item) => (mode === 'replication' ? item.averageAchievedRPO : item.averageAchivedRTO));
    const changeRate = data.map((item) => item.averageChangeRate);
    const compression = data.map((item) => item.averageCompressionRatio);

    let yValues: number[][] = [];
    let seriesLabels: string[] = [];

    switch (mode) {
        case 'recovery':
            yValues = data.map((item) => [item.passedCount || 0, item.failedCount || 0, item.notTestedCount || 0]);
            seriesLabels = ['Passed', 'Failed', 'Not Recovered'];
            break;
        case 'test-recovery':
            yValues = data.map((item) => [item.passedCount || 0, item.failedCount || 0, item.notTestedCount || 0]);
            seriesLabels = ['Passed', 'Failed', 'Not Tested'];
            break;
        case 'replication':
        default:
            yValues = data.map((item) => [item.passedCount || 0, item.exceedIntervalCount || 0, item.failedCount || 0]);
            seriesLabels = ['In-sync', 'Exceeds Interval', 'Failed'];
            break;
    }
    return {
        xValues,
        siteIds,
        planNames,
        targetSiteIds,
        rto,
        achievedRpo,
        changeRate,
        compression,
        series:
            yValues.length === 0
                ? []
                : [
                      { name: `${seriesLabels[0]} (${sumColumn(yValues, 0)})`, data: yValues.map((item) => item[0]) },
                      { name: `${seriesLabels[1]} (${sumColumn(yValues, 1)})`, data: yValues.map((item) => item[1]) },
                      { name: `${seriesLabels[2]} (${sumColumn(yValues, 2)})`, data: yValues.map((item) => item[2]) },
                  ],
    };
};
