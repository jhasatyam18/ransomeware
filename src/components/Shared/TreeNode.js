import { faFolderOpen, faFolder } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import { getValue } from '../../utils/InputUtils';
import { valueChange, loadTreeChildData } from '../../store/actions/UserActions';
import DMTree from './DMTree';

function TreeNode(props) {
  const { node, dispatch, user, fieldKey, field, disabled, showChildren } = props;
  const [showChild, setChildVisibility] = useState(showChildren || false);
  const { isMultiSelect, enableSelection, dataKey } = field;
  const { values } = user;
  const { doneChildrenLoading, type } = node;

  const getFieldValue = () => {
    const val = getValue(fieldKey, values) || [];
    for (let i = 0; i < val.length; i += 1) {
      if (val[i] === node.value || val[i] === node.title) {
        return true;
      }
    }
    if (isMultiSelect === false) {
      if (val === node.value) return true;
      return false;
    }

    if (val === node.value) return true;

    if (typeof val === 'object' && val.length > 0) {
      const hasChecked = val.some((v) => v === node.value);
      return hasChecked;
    }
  };

  const handleChange = (e) => {
    const obj = {
      key: node.key,
      name: node.title,
    };
    if (e.target.checked) {
      if (isMultiSelect) {
        const fieldVal = getValue(fieldKey, values);
        const getSelectedVmsValue = getValue('ui.selectedvm.value', values);
        const set = new Set([node.value, ...fieldVal]);
        const array = Array.from(set);
        if (getSelectedVmsValue.length > 0) {
          const arr1 = getSelectedVmsValue.filter((d) => {
            if (d.key !== node.key) {
              return d;
            }
          });
          dispatch(valueChange('ui.selectedvm.value', [obj, ...arr1]));
          dispatch(valueChange(fieldKey, array));
        } else {
          dispatch(valueChange('ui.selectedvm.value', [obj]));
          dispatch(valueChange(fieldKey, [node.value]));
        }
      } else {
        dispatch(valueChange(fieldKey, [node.value]));
        dispatch(valueChange('ui.selectedvm.value', [obj]));
      }
    } else if (isMultiSelect && !e.target.checked) {
      const fieldVal = getValue(fieldKey, values);
      const getSelectedVmsValue = getValue('ui.selectedvm.value', values);
      const arr = fieldVal.filter((d) => {
        if (d !== node.value) {
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
    } else {
      dispatch(valueChange(fieldKey, ''));
      dispatch(valueChange('ui.selectedvm.value', ''));
    }
  };

  const handleCaretChenge = () => {
    if (doneChildrenLoading === false) {
      dispatch(loadTreeChildData(dataKey, node, field));
    }
    setChildVisibility(!showChild);
  };

  const renderCaret = () => {
    if (type === 'VirtualMachine') return null;
    if (showChild === false) {
      return (
        <a href="#" onClick={() => handleCaretChenge()} className="dm-caret mr-2 ml-1">
          <FontAwesomeIcon size="lg" icon={faFolder} />
        </a>
      );
    }
    return (
      <a href="#" onClick={() => handleCaretChenge()} className="dm-caret mr-2 ml-1">
        <FontAwesomeIcon size="lg" icon={faFolderOpen} />
      </a>
    );
  };

  const renderInput = () => {
    if (typeof enableSelection !== 'undefined') {
      const showInput = enableSelection(node);
      if (showInput) {
        const v = getFieldValue();
        return (
          <div className="custom-control ml-2 custom-checkbox">
            <input type="checkbox" className="custom-control-input" disabled={disabled} id={`${fieldKey}-${node.value}`} name={`${fieldKey}-${node.value}`} checked={v} onChange={(e) => handleChange(e)} />
            <label className="custom-control-label" htmlFor={`${fieldKey}-${node.value}`} />
          </div>
        );
      }
    }
  };

  const renderNodeInfo = () => (
    <>
      <div className="treeDiv">
        {renderInput()}
        {renderCaret()}
        <p className="tree_node_p">{node.title}</p>
      </div>
    </>
  );

  const renderChild = () => {
    if (showChild === false) {
      return null;
    }
    return (
      <DMTree data={node.children} field={field} fieldKey={fieldKey} hideLabel border search={false} />
    );
  };
  return (
    <ul>
      <li>
        {renderNodeInfo()}
        {renderChild()}
      </li>
    </ul>
  );
}

export default (withTranslation()(TreeNode));
