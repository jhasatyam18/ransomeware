import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Label, Row, Col } from 'reactstrap';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SimpleBar from 'simplebar-react';
import { valueChange } from '../../store/actions/UserActions';
import { filterDataForVMwareSearch } from '../../store/actions/VMwareActions';
import { addMessage } from '../../store/actions/MessageActions';
import { callAPI } from '../../utils/ApiUtils';
import { getValue } from '../../utils/InputUtils';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import TreeNode from './TreeNode';

function DMTree(props) {
  const [searchData, setSearchData] = useState([]);
  const [searchStr, setSearchStr] = useState('');
  const [apiData, setApiData] = useState([]);
  const { data, user, dispatch, field, disabled, fieldKey, hideLabel, border, search, searchURL, showSelectedvmdata } = props;
  const { getTreeData, dataKey } = field;
  const { values } = user;
  const showSelectedData = getValue('ui.selectedvm.value', values);
  let treeData = data;
  function renderLabel() {
    const { label } = field;
    if (hideLabel) return null;
    return (
      <Label for="horizontal-firstname-Input" className="col-sm-4 col-form-Label">
        {label}
      </Label>
    );
  }

  function onSearchChange(e) {
    const convertedData = [];
    if (searchURL && searchURL !== '' && apiData.length === 0) {
      if (searchStr === '') {
        callAPI(searchURL).then((json) => {
          if (json.hasError) {
            dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
          } else {
            // TODO
            json.forEach((d) => {
              const node = {};
              node.doneChildrenLoading = true;
              node.key = d.moref;
              node.type = 'VirtualMachine';
              node.value = d.moref;
              node.children = [];
              node.title = d.name;
              node.id = d.moref;
              convertedData.push(node);
            });
            setApiData(convertedData);
          }
        },
        (err) => {
          dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
        });
      }
    }
    setSearchStr(e.target.value);
    onFilter(e);
  }

  function onFilterKeyPress(e) {
    if (e.key === 'Enter') {
      onFilter(e);
    }
  }

  function onFilter(e = null) {
    const criteria = (e !== null && typeof e.target.value !== 'undefined' ? e.target.value : searchStr);
    if (criteria === '') {
      setSearchData([]);
    } else {
      const newData = filterDataForVMwareSearch(apiData, criteria);
      const searchFolderData = {
        children: newData,
        doneChildrenLoading: true,
        key: 'datacenter-3',
        title: 'Searched Results',
        type: 'Folder',
        value: 'datacenter-3',
      };
      setSearchData([searchFolderData]);
    }
  }

  function renderVMwareSearchBox() {
    if (search) {
      return (
        <Row>
          <Col sm={7} style={{ minWidth: 200, marginBottom: '15px' }}>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                id="datableSearch"
                placeholder="Search"
                onChange={onSearchChange}
                onKeyPress={onFilterKeyPress}
                autoComplete="off"
              />
              <span className="input-group-append">
                <div className="input-group-text bg-transparent">
                  <box-icon name="search" className="search__icon" size="15px" color="#FFF" />
                </div>
              </span>
            </div>
          </Col>
        </Row>
      );
    }
    return null;
  }

  function removeFromSelectedList(node) {
    const fieldVal = getValue(fieldKey, values);
    const getSelectedVmsValue = getValue('ui.selectedvm.value', values);
    const arr = fieldVal.filter((d) => {
      if (d !== node.key) {
        return d;
      }
    });
    const arr1 = getSelectedVmsValue.filter((d) => {
      if (d.key !== node.key) {
        return d;
      }
    });
    dispatch(valueChange(fieldKey, arr));
    dispatch(valueChange('ui.selectedvm.value', arr1));
  }
  function renderSelectedVMNode() {
    if (showSelectedData.length > 0 && showSelectedvmdata) {
      return (
        <Col sm={5}>
          <div>
            <div className="selectedvm-div">
              <p>
                Selected Vms
              </p>
              {border ? (
                <>
                  {showSelectedData.map((node) => (
                    <p>
                      {node.name}
                      <a href="#" onClick={() => removeFromSelectedList(node)} className="dm-caret ml-2">
                        <FontAwesomeIcon size="lg" icon={faCircleXmark} />
                      </a>
                    </p>
                  ))}
                </>
              ) : (
                <>
                  <SimpleBar style={{ maxHeight: '240px', minHeight: '240px' }}>
                    {showSelectedData.map((node) => (
                      <p>
                        {node.name}
                        <a href="#" onClick={() => removeFromSelectedList(node)} className="dm-caret ml-2">
                          <FontAwesomeIcon size="lg" icon={faCircleXmark} />
                        </a>
                      </p>
                    ))}
                  </SimpleBar>
                </>
              )}
            </div>
          </div>
        </Col>
      );
    }
  }

  function render() {
    return (
      <div className="tree-parent">
        <div className={border ? 'tree' : 'treestart'}>
          {renderLabel() }
          <Row>
            <Col sm={12}>
              {searchData.map((node) => (
                <TreeNode node={node} key={`dm-tree-parent-${node.key}`} dispatch={dispatch} fieldKey={fieldKey} field={field} user={user} disabled={disabled} showChildren />
              ))}
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              {treeData.map((node) => (
                <TreeNode node={node} key={`dm-tree-parent-${node.key}`} dispatch={dispatch} fieldKey={fieldKey} field={field} user={user} disabled={disabled} />
              ))}
            </Col>
          </Row>
        </div>
      </div>
    );
  }

  function withScrollBar() {
    return (
      <Row>
        <Col sm={12}>
          <Row>
            {/* border and search both the condition is for rendering scrollbar */}
            {border || !search ? (
              <Col sm={showSelectedvmdata && showSelectedData.length > 0 ? 7 : 12}>
                {render()}
              </Col>
            ) : (
              <Col sm={showSelectedvmdata && showSelectedData.length > 0 ? 7 : 12}>
                <SimpleBar style={{ maxHeight: '300px', minHeight: '300px', background: '#2e3548' }}>
                  {render()}
                </SimpleBar>
              </Col>
            )}
            {renderSelectedVMNode()}
          </Row>
        </Col>
      </Row>
    );
  }

  if (typeof data === 'undefined') {
    // get data
    treeData = getTreeData({ dataKey, values, fieldKey });
  }
  if (typeof treeData === 'undefined' || treeData.length === 0) {
    return null;
  }
  return (
    <>
      {renderVMwareSearchBox()}
      {withScrollBar()}
    </>
  );
}

function mapStateToProps(state) {
  const { dispatch, user } = state;
  return { dispatch, user };
}
export default connect(mapStateToProps)(withTranslation()(DMTree));
