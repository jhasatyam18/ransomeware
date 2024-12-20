import React, { Component } from 'react';
import { Th, Tr } from 'react-super-responsive-table';
import { getAppKey } from '../../utils/appUtils';
import getItemRendererComponent from '../../utils/ItemRenderer';

type Props = {
    dispatch: any;
    onSelect: any;
    data: any;
    primaryKey: string;
    user: any;
    isSelectable: boolean;
    selectedData: any;
    name?: string;
    columns: any[];
    index: number;
};

type Header = {
    field: string;
    itemRenderer: any;
    filterText: any;
    ifEmptyShow: any;
};

class DMTableRow extends Component<Props> {
    constructor(props: Props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }

    onChange(e: any) {
        const { dispatch, onSelect, data, primaryKey } = this.props;
        dispatch(onSelect(data, e.target.checked, primaryKey));
    }

    getItemRenderer(render: string, data: any, field: string) {
        const { user, dispatch } = this.props;
        return getItemRendererComponent({ itemRenderer: render, data, field, user, dispatch });
    }

    getObjectValue(object: any, field: string) {
        const parts = field.split('.');
        switch (parts.length) {
            case 2:
                return object[parts[0]][parts[1]];
            case 3:
                return object[parts[0]][parts[1]][parts[2]];
            case 4:
                return object[parts[0]][parts[1]][parts[2]][parts[3]];
            default:
                return object[field];
        }
    }

    hasOwnRow(key: any) {
        const { data, primaryKey } = this.props;
        if (primaryKey) {
            return key === `${data[primaryKey]}`;
        }
        return false;
    }

    renderCellContent(tableHeader: Header, data: any) {
        const { field, itemRenderer, filterText } = tableHeader;
        if (itemRenderer) {
            return this.getItemRenderer(itemRenderer, data, field);
        }
        const value = this.getObjectValue(data, field);
        if (typeof filterText !== 'undefined') {
            return filterText(value);
        }
        if (typeof value === 'undefined' || value === null || value === '') {
            const { ifEmptyShow } = tableHeader;
            if (typeof ifEmptyShow !== 'undefined') {
                return ifEmptyShow;
            }
        }
        return value;
    }

    renderCheckBox(index: number | undefined) {
        const { isSelectable, selectedData, primaryKey, name, data } = this.props;
        // check row is mark as disabled
        if (typeof data.isDisabled !== 'undefined' && data.isDisabled === true) {
            return <Th />;
        }
        let rKey = '';
        const keyVal = typeof index !== 'undefined' ? index : getAppKey();
        if (name) {
            rKey = `chk-${primaryKey}-${keyVal}-${name}`;
        } else {
            rKey = `chk-${primaryKey}-${keyVal}`;
        }

        let showSelected = false;
        let hasOwnDataInSelection = null;
        if (selectedData) {
            hasOwnDataInSelection = Object.keys(selectedData).filter((key) => this.hasOwnRow(key));
            if (hasOwnDataInSelection && hasOwnDataInSelection.length > 0) {
                showSelected = true;
            }
        }
        if (isSelectable) {
            return (
                <Th>
                    <div className="custom-control custom-checkbox">
                        <input type="checkbox" className="custom-control-input" id={rKey} checked={showSelected} onChange={this.onChange} name={rKey} />
                        <label className="custom-control-label" htmlFor={rKey}>
                            &nbsp;
                        </label>
                    </div>
                </Th>
            );
        }
        return null;
    }

    render() {
        const { data, columns, index } = this.props;
        const cells = columns.map((tableHeader) => (
            <Th key={`${tableHeader.field}-${index}`} className="itemRendererContainer">
                {this.renderCellContent(tableHeader, data)}
            </Th>
        ));
        return (
            <Tr>
                {this.renderCheckBox(index)}
                {cells}
            </Tr>
        );
    }
}

export default DMTableRow;
