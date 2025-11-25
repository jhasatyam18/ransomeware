import { faCircleXmark, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useRef, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Col, Label, Row } from 'reactstrap';
import SimpleBar from 'simplebar-react';
import { STATIC_KEYS } from '../../constants/InputConstants';
import { hideApplicationLoader, showApplicationLoader, valueChange } from '../../store/actions/UserActions';
import { filterDataForVMwareSearch } from '../../store/actions/VMwareActions';
import { callAPI } from '../../utils/ApiUtils';
import { getValue } from '../../utils/InputUtils';
import TreeNode from './TreeNode';

function DMTree(props) {
  const [searchData, setSearchData] = useState([]);
  const [searchStr, setSearchStr] = useState('');
  const [apiData, setApiData] = useState([]);
  const ref = useRef(null);
  const { data, user, dispatch, field, disabled, fieldKey, hideLabel, child, search, searchURL, showSelectedvmdata, selectedVMkey, vmCss, selectedVmCss } = props;
  const { getTreeData, dataKey } = field;
  const { values } = user;
  const showSelectedData = getValue(selectedVMkey, values);
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

  function onSearchChange(e, onSearchClick = false) {
    if (!onSearchClick) {
      setSearchStr(e.target.value);
    }
    if (searchURL && searchURL !== '' && apiData.length === 0) {
      if ((e?.charCode === 13 || onSearchClick) && (searchStr !== '' || e?.target.value !== '')) {
        fetchVMwareFolderData();
        return;
      }
    }
    onFilter(e);
  }

  async function fetchVMwareFolderData() {
    const convertedData = [];
    dispatch(showApplicationLoader('VMWARE_FOLDER_API', 'Loading....'));
    ref.current.blur();
    const json = await callAPI(searchURL);
    dispatch(hideApplicationLoader('VMWARE_FOLDER_API'));
    ref.current.focus();
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
    const newData = filterDataForVMwareSearch(convertedData, searchStr);
    const searchFolderData = {
      children: newData,
      doneChildrenLoading: true,
      key: STATIC_KEYS.DMTREE_SEARCH_FOLDER_KEY,
      type: 'Folder',
    };
    setSearchData([searchFolderData]);
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
        key: STATIC_KEYS.DMTREE_SEARCH_FOLDER_KEY,
        type: 'Folder',
      };
      setSearchData([searchFolderData]);
    }
  }

  function renderVMwareSearchBox() {
    if (search) {
      return (
        <Row>
          <Col sm={7} className="margin-bottom-15 vmware-search-box">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                id="planvmstep"
                placeholder="Search"
                onChange={onSearchChange}
                onKeyPress={onSearchChange}
                autoComplete="off"
                ref={ref}
              />
              <span className="input-group-append input-group-text bg-transparent" aria-hidden onClick={() => onSearchChange(null, true)}>
                <div>
                  <FontAwesomeIcon size="sm" className="search__icon" icon={faSearch} />
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
    const getSelectedVmsValue = getValue(selectedVMkey, values);
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
    dispatch(valueChange(selectedVMkey, arr1));
  }

  function renderSelectedVMNode() {
    if (showSelectedData.length > 0 && showSelectedvmdata) {
      return (
        <Col sm={4}>
          <div>
            <div className="selectedvm-div">
              <p>
                Selected Vms
              </p>
              {child ? (
                <>
                  {showSelectedData.map((node) => (
                    <p>
                      {node.name}
                      <a href="#" onClick={() => removeFromSelectedList(node)} className="dm-caret ms-2">
                        <FontAwesomeIcon size="lg" icon={faCircleXmark} className="tree_folder_color" />
                      </a>
                    </p>
                  ))}
                </>
              ) : (
                <>
                  <SimpleBar className={selectedVmCss || 'dmtree-selectedvm-scrollbar'}>
                    {showSelectedData.map((node) => (
                      <p>
                        {node.name}
                        <a href="#" onClick={() => removeFromSelectedList(node)} className="dm-caret ms-2">
                          <FontAwesomeIcon size="lg" icon={faCircleXmark} className="tree_folder_color" />
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
        <div className={child ? 'tree' : 'treestart'}>
          {renderLabel() }
          <Row>
            <Col sm={12}>
              {searchData.map((node) => (
                <TreeNode selectedVMkey={selectedVMkey} node={node} key={`dm-tree-parent-${node.key}`} dispatch={dispatch} fieldKey={fieldKey} field={field} user={user} disabled={disabled} showChildren />
              ))}
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              {treeData.map((node) => (
                <TreeNode selectedVMkey={selectedVMkey} node={node} key={`dm-tree-parent-${node.key}`} dispatch={dispatch} fieldKey={fieldKey} field={field} user={user} disabled={disabled} />
              ))}
            </Col>
          </Row>
        </div>
      </div>
    );
  }

  function withScrollBar() {
    return (
    /* child and search both the condition is for rendering scrollbar */
      <Row>
        <Col sm={12}>
          <Row>
            <Col sm={showSelectedvmdata && showSelectedData.length > 0 ? 8 : 12}>
              {child || !search ? render() : (
                <SimpleBar className={vmCss || 'dmtree_scrollbar'}>
                  {render()}
                </SimpleBar>
              )}
            </Col>
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
