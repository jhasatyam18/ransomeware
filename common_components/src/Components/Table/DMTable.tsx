import React, { ChangeEvent, useEffect, useState } from 'react';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import DMTableRow from './DMTableRow';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import { Theme, UserInterface } from '../../interfaces/interfaces';
import { APPLICATION_THEME, THEME_CONSTANTS } from '../../Constants/userConstants';
import { getValue } from '../../utils/AppUtils';

type Column = {
    label: string;
    field: string;
    allowSort?: boolean;
    allowFilter?: boolean;
    checked?: boolean;
    itemRenderer?: string;
    width?: number | string | any;
    defaultSort?: number;
};

type Props = {
    dispatch: any;
    onSelectAll?: any;
    data: any[];
    selectedData?: any;
    isSelectable: boolean;
    name?: string;
    columns: Column[];
    primaryKey: string;
    user: UserInterface;
    onSelect?: any;
    setUrl: any;
    url: string;
};

export const DMTable: React.FC<Props> = (props) => {
    const { url, user } = props;
    const [selected, setSelected] = useState(false);
    const [sortState, setSortState] = useState<{ column: string | null; state: number }>({
        column: null,
        state: 0, // 0 = no sort, 1 = asc, 2 = desc
    });
    const theme = (getValue({ key: APPLICATION_THEME, values: user.values }) as Theme) || 'dark';
    const getInitialSortState = () => {
        const params = new URLSearchParams(url.split('?')[1]);
        const sortColumn = params.get("sortColumn");
        const sortOrder = params.get("sortOrder");
        if (sortColumn && sortOrder) {
            return { column: sortColumn, state: sortOrder === "asc" ? 1 : 2 };
        }
        return { column: null, state: 0 }; // No sorting applied
    };

    useEffect(() => {
        setSortState(getInitialSortState());
    }, [url]);

    function onChange(e: ChangeEvent<HTMLInputElement>) {
        const { onSelectAll, dispatch, data } = props;
        setSelected(e.target.checked);
        dispatch(onSelectAll(e.target.checked, data));
    }

    function onSortClick(columnLabel: string) {
        const { setUrl, url } = props;

        setSortState((prevState) => {
            const newState = prevState.column === columnLabel ? (prevState.state + 1) % 3 : 1; // Cycle sorting states

            if (setUrl && url) {
                let [baseUrl, queryString] = url.split('?'); // Separate base URL and query string
                let params = new URLSearchParams(queryString); // Convert to URLSearchParams

                // ✅ Remove previous sortColumn and sortOrder if they exist
                params.delete("sortColumn");
                params.delete("sortOrder");

                // ✅ Add new sorting parameters if sorting is enabled
                if (newState === 1) {
                    params.set("sortColumn", columnLabel);
                    params.set("sortOrder", "asc");
                } else if (newState === 2) {
                    params.set("sortColumn", columnLabel);
                    params.set("sortOrder", "desc");
                }

                // ✅ Construct the final URL
                let newUrl = params.toString() ? `${baseUrl}?${params.toString()}` : `${baseUrl}?`;
                setUrl(newUrl);
            }

            return { column: columnLabel, state: newState };
        });
    }

    function getSortIcon(columnLabel: string) {
        if (sortState.column !== columnLabel) return faSortDown;
        return sortState.state === 1 ? faSortUp : sortState.state === 2 ? faSortDown : faSortDown;
    }

    function renderHeaderLabels(columns: Column[]) {
        return columns.map((col, index) => {
            const isActive = sortState.column === col.field && sortState.state !== 0;
            const iconColor = !isActive ?  THEME_CONSTANTS.TABLE?.[theme]?.sortingIcon : "";
            return (
                <Th key={`${index + 1}-${col.label}`} width={`${col.width * 10}%`}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ width: '90%' }}>{col.label}</div>
                        <div>{col.allowSort && <FontAwesomeIcon icon={getSortIcon(col.field)} onClick={() => onSortClick(col.field)} style={{ cursor: 'pointer' }} color={iconColor} />}</div>
                    </div>
                </Th>
            );
        });
    }

    function renderCheckBoxPlaceHolder() {
        const { isSelectable, name } = props;
        if (isSelectable && name) {
            return (
                <Th className="dm_table_th">
                    <div className="custom-control custom-checkbox" key="global-select">
                        <input type="checkbox" className="custom-control-input" id={`chk-${name}`} checked={selected} onChange={onChange} name={`chk-${name}`} />
                        <label className="custom-control-label" htmlFor={`chk-${name}`}>
                            &nbsp;
                        </label>
                    </div>
                </Th>
            );
        }
        if (isSelectable) {
            return <Th className="dmtable-checkbox" />;
        }
        return null;
    }

    function renderHeaders() {
        const { columns } = props;
        return (
            <Thead>
                <Tr>
                    {renderCheckBoxPlaceHolder()}
                    {renderHeaderLabels(columns)}
                </Tr>
            </Thead>
        );
    }

    function renderNoDataToShow() {
        const { columns } = props;
        return (
            <Tr>
                <Td colSpan={Object.keys(columns).length + 1}> No Data To Display</Td>
            </Tr>
        );
    }

    function renderRows() {
        const { dispatch, data, columns, isSelectable, onSelect, selectedData, primaryKey, user, name } = props;
        return data.map((row: any, index: any) => (
            <DMTableRow
                columns={columns}
                dispatch={dispatch}
                index={index}
                data={row}
                isSelectable={isSelectable}
                onSelect={onSelect}
                selectedData={selectedData}
                primaryKey={primaryKey}
                user={user}
                name={name}
                key={`dmtable-row-${index + 1}`}
            // dataType={dataType}
            />
        ));
    }
    const { data, name } = props;
    return (
        <Table className="table table-bordered" id={name}>
            {renderHeaders()}
            <Tbody id={name}>{data && data.length > 0 ? renderRows() : renderNoDataToShow()}</Tbody>
        </Table>
    );
};

