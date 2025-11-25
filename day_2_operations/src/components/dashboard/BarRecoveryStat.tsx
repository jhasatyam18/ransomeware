import React, { useEffect, useRef, useState } from 'react';
import { Card, CardBody } from 'reactstrap';
import { SUCCESS, WARNING } from '../../constants/ColorConstant';
import { DASHBOARD_REPLICATION_DURATION, RECOVERY_JOBS } from '../../constant/tableConstant';
import StackedBarChart from './Chart';
import { FieldOption, GlobalInterface, INITIAL_STATE_INTERFACE, UserInterface } from '../../interfaces/interface';
import { connect, useSelector } from 'react-redux';
import Pagination from './Pagination';
import SiteSelectionDropdown from './SiteSelectionDropdown';
import { callAPI, getValue } from '../../utils/apiUtils';
import { STATIC_KEYS } from '../../constants/StoreKey';
import { onReplicationBarChartClick } from '../../store/actions/actions';
import { faCalendarDays, faFilter, faSpinner } from '@fortawesome/free-solid-svg-icons';
import CardHeaderWithInfo from './CardHeaderWithInfo';
import RadioOption from './RadioOption';
import { API_DASHBOARD_RECOVERY_BAR_STATS } from '../../constants/ApiUrlConstant';
import { StackWindowSize } from './StackWindowSize';
import { structureDataForChart } from '../../utils/StackBarUtils';
import { addMessage } from '../../store/reducers/messageReducer';
import { MESSAGE_TYPES } from '../../constants/userConstant';
import DurationDropdown from './DurationDropdown';
import { getDurationText, getStartEndTime } from '../../utils/appUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
interface ReplicationSeriesProps {
    xValues: string[];
    series: { name: string; data: number[] }[];
    rto?: number[];
}
const BarRecoveeryStat: React.FC<Props> = ({ dispatch, user }) => {
    const { values } = user;
    const radioSelection = getValue({ key: 'radio-button-recoveryStat', values }) || 'workloadView';
    const [selectedSiteIds, setSelectedSiteIds] = useState<string[]>([]);
    const [duration, setDuration] = useState<string>('');
    const [loader, setloader] = useState<boolean>(false);
    const [pageInfo, setPageInfo] = useState<PageInfo>({ currentPage: 1, totalPages: 1, hasNext: false, hasPrev: false, nextOffset: 0, totalInSync: 0, totalExceedsInterval: 0, totalFailed: 0 });
    const [chartData, setChartData] = useState<ReplicationSeriesProps>({ xValues: [], series: [], rto: [] });
    const lavel = getValue({ key: STATIC_KEYS.GLOBAL_SITE_KEY, values }) || '1';
    const options: FieldOption[] = getValue({ key: STATIC_KEYS.GLOBAL_OPT_SITE_DATA, values });
    const filteredOptions = Array.isArray(options) ? options.filter((opt: FieldOption) => opt?.value?.length > 1) : [];
    const { count } = StackWindowSize();
    const refresh = useSelector((state: any) => state.global.context.refresh);
    const totalPlans = useSelector((state: any) => state.dashboard.titles.protectionPlans) || 0;
    const siteIdRef = useRef(lavel);
    useEffect(() => {
        siteIdRef.current = lavel;
    }, [lavel]);

    const fetchData = async (offset = 0, siteIDs?: string[], durationValue?: string) => {
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
        let url = `${API_DASHBOARD_RECOVERY_BAR_STATS}limit=${count}&recoveryType=full recovery&groupBy=${groupBy}&viewType=${viewType}${siteParam}`;
        if (offset > 0) {
            url += `&offset=${offset}`;
        }
        const effectiveDuration = durationValue || 'month';
        const { start, end } = getStartEndTime(effectiveDuration, user, 'recovery.time.duration');
        url += `&startTime=${start}&endTime=${end}`;
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
                const seriesData = structureDataForChart(records, 'radio-button-recoveryStat', user, 'recovery');
                setChartData(seriesData);
            },
            (err) => {
                setloader(false);
                dispatch(addMessage({ message: err.message, messageType: MESSAGE_TYPES.ERROR }));
            },
        );
    };

    const handleSiteFilterApply = (includedIds: string[]) => {
        setSelectedSiteIds(includedIds);
    };

    const handleNext = () => {
        if (pageInfo.hasNext) {
            fetchData(pageInfo.nextOffset, selectedSiteIds, duration);
        }
    };

    const handlePrevious = () => {
        const prevOffset = (pageInfo.currentPage - 2) * count;
        if (pageInfo.hasPrev && prevOffset >= 0) {
            fetchData(prevOffset, selectedSiteIds, duration);
        }
    };

    const renderHoverInfo = () => {
        return (
            <>
                <div>
                    <span style={{ fontWeight: '500', fontSize: '11px' }}>Shows recovery performance across your top target sites/plans.</span>
                    <ul className="mt-2">
                        <li>Target Sites/Plans: Only recoveries from these are considered.</li>
                        <li>Passed: Completed successfully within expected RTO.</li>
                        <li>Failed: Did not complete or encountered errors.</li>
                        <li>Not Recovered: Recovery not yet executed.</li>
                        <li>RTO: Time taken to complete recovery for each plan.</li>
                    </ul>
                </div>
            </>
        );
    };

    useEffect(() => {
        const effectiveDuration = duration && duration !== '' ? duration : 'month';
        if (effectiveDuration !== 'custom') {
            fetchData(0, selectedSiteIds, effectiveDuration);
        }
        return () => {
            setChartData({ xValues: [], series: [], rto: [] });
            setloader(false);
        };
    }, [lavel, selectedSiteIds, radioSelection, duration, refresh]);
    return (
        <Card>
            <CardBody className="box-shadow" style={{ minHeight: '315px' }}>
                <CardHeaderWithInfo text={`Full Recoveries By Site (Top ${count})`} IconText={renderHoverInfo} />
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
                                        <div className="dash_radio_button_width" style={{ minHeight: '20px', textAlign: 'right' }}>
                                            <RadioOption fieldkey="radio-button-recoveryStat" />
                                        </div>
                                    ) : null}
                                    {lavel === '1' ? (
                                        <div className="dash_site_filter_width" style={{ minHeight: '10px', textAlign: 'right', marginRight: '5px' }}>
                                            <SiteSelectionDropdown user={user} fieldkey="recovery.site.dropdown" options={filteredOptions} icon={faFilter} checkbox onApply={handleSiteFilterApply} />
                                        </div>
                                    ) : null}

                                    <div className="dash_site_duration_width" style={{ minHeight: '10px', marginRight: '10px' }}>
                                        <DurationDropdown
                                            user={user}
                                            fieldkey="recovery.time.duration"
                                            options={DASHBOARD_REPLICATION_DURATION}
                                            icon={faCalendarDays}
                                            onChange={(value: any) => {
                                                setDuration(value);
                                            }}
                                            onApplyCustomRange={() => fetchData(0, selectedSiteIds, 'custom')}
                                        />
                                    </div>
                                    <Pagination pageInfo={pageInfo} handleNext={handleNext} handlePrevious={handlePrevious} />
                                </div>
                            </div>

                            {chartData.series && chartData.series.length > 0 && <StackedBarChart column={RECOVERY_JOBS} seriesData={chartData} showLabel={true} colors={[SUCCESS, WARNING, '#d88080']} height={240} onBarClicked={lavel === '1' ? onReplicationBarChartClick : null} onNavigateToReplication={lavel !== '1' ? '/dop/recovery' : null} fieldkey="recovery" />}
                            <div className="text-center dashboard_rec_heading_size">
                                <div>
                                    <span>{`${chartData.series.length > 0 ? `(Data For ${getDurationText(duration, user, 'recovery.time.duration')})` : 'No Recovery Data Available'}`}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    'No data to show'
                )}
            </CardBody>
        </Card>
    );
};

function mapStateToProps(state: INITIAL_STATE_INTERFACE) {
    const { user, nodes, layout, global } = state;
    return {
        user,
        nodes,
        layout,
        global,
    };
}

export default connect(mapStateToProps)(BarRecoveeryStat);
