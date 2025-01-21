import React from 'react';
import { Button, Col, Row } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import { Th, Tr } from 'react-super-responsive-table';
import { getItemRendererComponent } from '../../utils/ComponentFactory';
import { getAppKey } from '../../utils/AppUtils';
import { getObjectValue, hasOwnRow } from '../../utils/InputUtils';

const DMCollapsibleRow = (props) => {
  const { user, dispatch, data = [], primaryKey, childPrimaryKey, columns = [], index, isSelectable, onSelect, selectedData, toggleRow, tblName } = props;
  let cData = null;
  const onChange = (e) => {
    dispatch(onSelect(data, e.target.checked, primaryKey));
  };

  const onChildChange = (e, d) => {
    dispatch(onSelect(d, e.target.checked, childPrimaryKey));
  };

  const getItemRenderer = (render, d, field) => getItemRendererComponent({ render, data: d, field, user, dispatch });

  const renderCellContent = (tableHeader, d) => {
    const { field, itemRenderer, filterText, childKey } = tableHeader;
    if (itemRenderer) {
      return getItemRenderer(itemRenderer, d, field);
    }
    let value = getObjectValue(d, field);
    // const fieldKey = (typeof childKey !== 'undefined' ? childKey : field);
    if (childKey) {
      const childValue = getObjectValue(d, field);
      if (childValue) {
        value = childValue;
      }
    }
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
  };

  const renderCheckBox = (ind) => {
    let rKey = '';
    const keyVal = (typeof ind !== 'undefined' ? ind : getAppKey());
    if (tblName) {
      rKey = `chk-${primaryKey}-${keyVal}-${tblName}`;
    } else {
      rKey = `chk-${primaryKey}-${keyVal}`;
    }

    let showSelected = false;
    let hasOwnDataInSelection = null;
    if (selectedData) {
      hasOwnDataInSelection = Object.keys(selectedData).filter((key) => hasOwnRow(key, data, primaryKey));
      if (hasOwnDataInSelection && hasOwnDataInSelection.length > 0) {
        showSelected = true;
      }
    }
    if (isSelectable) {
      return (
        <Th>
          <div className="custom-control custom-checkbox">
            <input
              type="checkbox"
              className="custom-control-input"
              id={rKey}
              checked={showSelected}
              onChange={onChange}
              name={rKey}
            />
            <label className="custom-control-label" htmlFor={rKey}>
              &nbsp;
            </label>
          </div>
        </Th>
      );
    }
    return null;
  };

  const renderChildCheckBox = (d) => {
    const keyVal = getAppKey();
    let rKey = '';
    if (tblName) {
      rKey = `chk-${childPrimaryKey}-${keyVal}-${tblName}`;
    } else {
      rKey = `chk-${childPrimaryKey}-${keyVal}`;
    }
    let showSelected = false;
    let hasOwnDataInSelection = null;
    if (selectedData) {
      hasOwnDataInSelection = Object.keys(selectedData).filter((key) => hasOwnRow(key, d, childPrimaryKey));
      if (hasOwnDataInSelection && hasOwnDataInSelection.length > 0) {
        showSelected = true;
      }
    }
    if (isSelectable) {
      return (
        <div className="custom-control custom-checkbox">
          <input
            type="checkbox"
            className="custom-control-input"
            id={rKey}
            checked={showSelected}
            onChange={(e) => onChildChange(e, d)}
            name={rKey}
            disabled={d.isDisabled}
          />
          <label className="custom-control-label" htmlFor={rKey}>
            &nbsp;
          </label>
        </div>
      );
    }
    return null;
  };

  const { resources, showChild } = data;
  if (showChild) {
    cData = resources.map((resource) => (
      <Tr key={`${resource[childPrimaryKey]}`} className="child-row">
        <td>&nbsp;</td>
        {columns.map((tableHeader, columnIndex) => (
          <td
            key={`${resource[childPrimaryKey]}-${tableHeader.field}-${columnIndex + 1}`}
            className={`itemRendererContainer ${tableHeader.customCSS || ''}`}
          >
            <Row>
              <Col sm={1}>
                {columnIndex === 1 ? renderChildCheckBox(resource) : null}
              </Col>
              <Col sm={10}>
                {renderCellContent(tableHeader, resource)}
              </Col>
            </Row>
          </td>
        ))}
      </Tr>
    ));
  }
  const cells = columns.map((tableHeader, i) => (
    <td key={`${tableHeader.field}-${index}`} className={`itemRendererContainer ${tableHeader.customCSS}`}>
      {resources && i === 0 ? (
        <Button
          color="link"
          onClick={() => dispatch(toggleRow(data[primaryKey]))}
          style={{ textDecoration: 'none', padding: 0, marginRight: '10px' }}
        >
          {showChild ? '▼' : '▶'}
        </Button>
      ) : null}
      {renderCellContent(tableHeader, data)}
    </td>
  ),
  );

  return (
    <>
      <Tr>
        {renderCheckBox(index)}
        {cells}
      </Tr>
      {resources && showChild && cData !== null ? <>{cData}</> : null}
    </>
  );
};
export default (withTranslation()(DMCollapsibleRow));
