import React, { useEffect, useRef, useState } from 'react';
import { Card, CardBody } from 'reactstrap';
import { SUCCESS, WARNING } from '../../constants/ColorConstant';
import StackedBarChart from './Chart';
import { connect, useSelector } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { FieldOption, GlobalInterface, INITIAL_STATE_INTERFACE, UserInterface } from '../../interfaces/interface';
import { STATIC_KEYS } from '../../constants/StoreKey';
import { callAPI, getValue } from '../../utils/apiUtils';
import { onReplicationBarChartClick } from '../../store/actions/actions';
import SiteSelectionDropdown from './SiteSelectionDropdown';
import Pagination from './Pagination';
import CardHeaderWithInfo from './CardHeaderWithInfo';
import RadioOption from './RadioOption';
import { StackWindowSize } from './StackWindowSize';
import { structureDataForChart } from '../../utils/StackBarUtils';
import { API_DASHBOARD_REPLICATION_BAR_STATS } from '../../constants/ApiUrlConstant';
import { addMessage } from '../../store/reducers/messageReducer';
import { MESSAGE_TYPES } from '../../constants/userConstant';
import { faFilter, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { REPLICATION_TABLE } from '../../constant/tableConstant';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMemo } from 'react';

interface Props {
    dispatch: any;
    global: GlobalInterface;
    user: UserInterface;
}
interface PageInfo {
    currentPage: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
    nextOffset: number;
    totalInSync: number;
    totalExceedsInterval: number;
    totalFailed: number;
}
export interface ReplicationSeriesProps {
    xValues: string[];
    rto?: number[];
    achievedRpo?: number[];
    changeRate?: number[];
    compression?: number[];
    series: { name: string; data: number[] }[];
}

const ReplicationStat: React.FC<Props> = ({ user, dispatch }) => {
    const { values } = user;
    const radioSelection = getValue({ key: 'radio-button-replicationStat', values }) || 'workloadView';
    const [selectedSiteIds, setSelectedSiteIds] = useState<string[]>([]);
    const [loader, setloader] = useState<boolean>(false);
    const [pageInfo, setPageInfo] = useState<PageInfo>({ currentPage: 1, totalPages: 1, hasNext: false, hasPrev: false, nextOffset: 0, totalInSync: 0, totalExceedsInterval: 0, totalFailed: 0 });
    const [chartData, setChartData] = useState<ReplicationSeriesProps>({ xValues: [], series: [], rto: [] });
    const lavel = getValue({ key: STATIC_KEYS.GLOBAL_SITE_KEY, values }) || '1';
    const options: FieldOption[] = getValue({ key: STATIC_KEYS.GLOBAL_OPT_SITE_DATA, values });

    const filteredOptions = useMemo(() => {
        return Array.isArray(options) ? options.filter((opt: FieldOption) => opt?.value?.length > 1) : [];
    }, [options]);

    const { count } = StackWindowSize();
    const refresh = useSelector((state: any) => state.global.context.refresh);
    const totalPlans = useSelector((state: any) => state.dashboard.titles.protectionPlans) || 0;
    const siteIdRef = useRef(lavel);
    useEffect(() => {
        siteIdRef.current = lavel;
    }, [lavel]);

    const fetchData = async (offset = 0, siteIDs?: string[]) => {
        const currentSiteId = lavel;
        let groupBy = 'site';
        let viewType = radioSelection;
        let siteParam = '';
        if (siteIDs && siteIDs.length > 0 && siteIDs.length !== filteredOptions.length && lavel === '1') {
            siteParam = `&siteIDs=${siteIDs.join(',')}`;
        } else if (lavel.length > 1) {
            groupBy = 'plan';
            viewType = 'workloadView';
            siteParam = `&siteIDs=${lavel}`;
        }
        let url = `${API_DASHBOARD_REPLICATION_BAR_STATS}limit=${count}&groupBy=${groupBy}&viewType=${viewType}${siteParam}`;
        if (offset > 0) {
            url += `&offset=${offset}`;
        }
        setloader(true);
        callAPI(url).then(
            (json) => {
                if (siteIdRef.current !== currentSiteId) {
                    return;
                }
                setloader(false);
                const { currentPage, totalPages, hasNext, hasPrev, nextOffset, totalInSync, totalExceedsInterval, totalFailed } = json;
                setPageInfo({ currentPage, totalPages, hasNext, hasPrev, nextOffset, totalInSync, totalExceedsInterval, totalFailed });
                let { records } = json;
                const seriesData = structureDataForChart(records, 'radio-button-replicationStat', user, 'replication');
                setChartData(seriesData);
            },
            (err) => {
                setloader(false);
                dispatch(addMessage({ message: err.message, messageType: MESSAGE_TYPES.ERROR }));
            },
        );
    };

    useEffect(() => {
        if (selectedSiteIds.length > 0) {
            fetchData(0, selectedSiteIds);
        } else {
            fetchData(0);
        }

        return () => {
            setChartData({ xValues: [], series: [], rto: [] });
            setloader(false);
        };
    }, [lavel, selectedSiteIds, radioSelection, refresh]);

    const handleSiteFilterApply = (includedIds: string[]) => {
        setSelectedSiteIds(includedIds);
        fetchData(0, includedIds);
    };

    const handleNext = () => {
        if (pageInfo.hasNext) {
            fetchData(pageInfo.nextOffset);
        }
    };

    const handlePrevious = () => {
        const prevOffset = (pageInfo.currentPage - 2) * count;
        if (pageInfo.hasPrev && prevOffset >= 0) {
            fetchData(prevOffset);
        }
    };

    const renderHoverInfo = () => {
        return (
            <>
                <div>
                    <span style={{ fontWeight: '500', fontSize: '11px' }}>This section shows replication status across your top source sites/plans</span>
                    <ul className="mt-2">
                        <li>Source Sites/Plans: Only replications originating from these are included.</li>
                        <li>In-Sync: Replications that are up to date.</li>
                        <li>Exceeds Interval: Replications taking longer than the defined RPO.</li>
                        <li>Failed: Replications that didn’t complete successfully.</li>
                        <li>RPO: Indicates how recent the replicated data is compared to the source.</li>
                    </ul>
                </div>
            </>
        );
    };

    const replicationByGlobal = () => {
        return (
            <Card>
                <CardBody className="box-shadow" style={{ minHeight: '350px' }}>
                    <CardHeaderWithInfo text={`Replications By Site (Top ${count})`} IconText={renderHoverInfo} />
                    {loader ? (
                        <>
                            <div className="font-weight-medium" style={{ height: '305px' }}>
                                {' '}
                                <FontAwesomeIcon icon={faSpinner} className="me-2" /> Loading...
                            </div>
                        </>
                    ) : chartData.series && chartData.series.length > 0 ? (
                        <div className="d-container">
                            <div className="d-child2">
                                <div className="d-flex justify-content-end w-100">
                                    <div className={`d-flex align-items-center ${lavel === '1' ? 'graph_actions_resp_width' : 'w-45 justify-content-end '}`} style={{ gap: '10px' }}>
                                        {lavel.length > 1 && lavel !== '1' ? <div style={{ paddingRight: '15px', paddingTop: '5px' }}>{`Protection Plans (${totalPlans})`}</div> : null}
                                        {lavel === '1' ? (
                                            <div style={{ width: '80%', minHeight: '20px', textAlign: 'right' }}>
                                                <RadioOption fieldkey="radio-button-replicationStat" />
                                            </div>
                                        ) : null}
                                        {lavel === '1' ? (
                                            <div style={{ width: '10%', minHeight: '10px', textAlign: 'center' }}>
                                                <SiteSelectionDropdown user={user} fieldkey="replication.site.dropdown" options={filteredOptions} icon={faFilter} checkbox onApply={handleSiteFilterApply} />
                                            </div>
                                        ) : null}
                                        <Pagination pageInfo={pageInfo} handleNext={handleNext} handlePrevious={handlePrevious} />
                                    </div>
                                </div>
                                {chartData.series && chartData.series.length > 0 && <StackedBarChart column={REPLICATION_TABLE} seriesData={chartData} showLabel={true} colors={[SUCCESS, WARNING, '#d88080']} height={240} onBarClicked={lavel === '1' ? onReplicationBarChartClick : null} onNavigateToReplication={lavel !== '1' ? '/dop/replication' : null} fieldkey="replication" />}
                                <div className="text-center dashboard_rec_heading_size">
                                    <div>
                                        <span>{`${chartData.series.length > 0 ? 'Latest Replication Data' : 'No Replication Data Available'}`}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="font-weight-medium" style={{ height: '305px' }}>
                            No data to show
                        </div>
                    )}
                </CardBody>
            </Card>
        );
    };
    return replicationByGlobal();
};

function mapStateToProps(state: INITIAL_STATE_INTERFACE) {
    const { user, nodes, layout, global } = state;
    return { user, nodes, layout, global };
}

export default connect(mapStateToProps)(withTranslation()(ReplicationStat));
