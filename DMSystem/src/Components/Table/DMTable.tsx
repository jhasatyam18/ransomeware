import React, { ChangeEvent, Component } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import { Card, CardBody, Col, Row } from 'reactstrap';
import DMTableRow from './DMTableRow';
import DMToolTip from './DMToolTip';

type Column = {
    label: string;
    width?: number | string | any;
    info?: string;
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
    user: any;
    onSelect?: any;
} & WithTranslation;

type State = {
    selected: boolean;
};

class DMTable extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { selected: false };
        this.onChange = this.onChange.bind(this);
    }
    onChange(e: ChangeEvent<HTMLInputElement>) {
        const { onSelectAll, dispatch, data } = this.props;
        this.setState({ selected: e.target.checked });
        dispatch(onSelectAll(e.target.checked, data));
    }

    renderHeaderLabels(columns: Column[]) {
        const { t } = this.props;
        return columns.map((col, index) => (
            <Th key={`${index + 1}-${col.label}`} width={`${col.width * 10}%`}>
                <Row>
                    <Col sm={9}>{t(col.label)}</Col>
                    <Col sm={1}>{typeof col.info !== 'undefined' && col.info !== null && col.info && <DMToolTip tooltip={col.info} />}</Col>
                </Row>
            </Th>
        ));
    }

    renderCheckBoxPlaceHolder() {
        const { isSelectable, name } = this.props;
        const { selected } = this.state;
        if (isSelectable && name) {
            return (
                <Th className="dm_table_th">
                    <div className="custom-control custom-checkbox" key="global-select">
                        <input type="checkbox" className="custom-control-input" id={`chk-${name}`} checked={selected} onChange={this.onChange} name={`chk-${name}`} />
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

    renderHeaders() {
        const { columns } = this.props;
        return (
            <Thead>
                <Tr>
                    {this.renderCheckBoxPlaceHolder()}
                    {this.renderHeaderLabels(columns)}
                </Tr>
            </Thead>
        );
    }

    renderNoDataToShow() {
        const { columns } = this.props;
        return (
            <Tr>
                <Td colSpan={Object.keys(columns).length + 1}> No Data To Display</Td>
            </Tr>
        );
    }

    renderRows() {
        const { dispatch, data, columns, isSelectable, onSelect, selectedData, primaryKey, user, name } = this.props;
        return data.map((row, index) => (
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

    render() {
        const { data, name } = this.props;
        return (
            <Row>
                <Col>
                    <Card>
                        <CardBody>
                            <Table className="table table-bordered" id={name}>
                                {this.renderHeaders()}
                                <Tbody id={name}>{data && data.length > 0 ? this.renderRows() : this.renderNoDataToShow()}</Tbody>
                            </Table>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        );
    }
}

export default withTranslation()(DMTable);
