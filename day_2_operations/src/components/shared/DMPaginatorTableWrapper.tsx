import React, { useEffect } from 'react';
import { Col, Row } from 'reactstrap';
import DMAPIPaginator from '../shared/ApiPagination';
import { DMTable } from '@dm/common-comp';
import { SelectedSites, SiteInterface, TableColumn, UserInterface } from '../../interfaces/interface';
import { AppDispatch } from '../../store';

interface DMPaginatorTableWrapperProps {
    apiUrl: string;
    columns: TableColumn[];
    user: UserInterface;
    dispatch: AppDispatch;
    onSelect?: (data: SiteInterface, isSelected: boolean, primaryKey: keyof SiteInterface) => void;
    onSelectAll?: (isSelected: boolean) => void;
    selectedRows?: SelectedSites;
    name?: string;
    isSelectable?: boolean;
    showFilter: string;
    isParameterizedUrl?: boolean;
    storeFn?: any;
    renderActionsComponent?: any;
    subFilter?: any[];
    subFilterTitle?: string;
}

const DMPaginatorTableWrapper: React.FC<DMPaginatorTableWrapperProps> = (props) => {
    const { apiUrl, columns, user, dispatch, onSelect, onSelectAll, selectedRows, name, isSelectable, showFilter, storeFn, subFilter, subFilterTitle } = props;

    const [TableData, setTableData] = React.useState<any[]>([]);
    const [url, setUrl] = React.useState(apiUrl);

    const dataChange = (data: any[]) => {
        setTableData(data);
        if (typeof storeFn === 'function') {
            dispatch(storeFn({ data }));
        }
    };
    useEffect(() => {
        setUrl(apiUrl);
    }, [apiUrl]);
    return (
        <div>
            <Row>
                <Col sm={6}></Col>
                <Col sm={6}>
                    <DMAPIPaginator subFilter={subFilter} subFilterTitle={subFilterTitle} showFilter={showFilter} columns={columns} apiUrl={url} storeFn={dataChange} name={name ? name : 'paginatorTableWrapper'} setUrl={setUrl} />
                </Col>
            </Row>
            <DMTable setUrl={setUrl} url={url} isSelectable={isSelectable || false} user={user} dispatch={dispatch} onSelect={onSelect} onSelectAll={onSelectAll} selectedData={selectedRows} name={name} columns={columns} data={TableData || []} primaryKey="id" />
        </div>
    );
};

export default DMPaginatorTableWrapper;
