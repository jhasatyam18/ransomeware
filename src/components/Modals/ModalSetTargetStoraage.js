import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Col, Row } from 'reactstrap';
import SimpleBar from 'simplebar-react';
import { withTranslation } from 'react-i18next';
import { AWS_TARGET_STORAGE } from '../../constants/TableConstants';
import { valueChange } from '../../store/actions';
import { closeModal } from '../../store/actions/ModalActions';
import { getValue } from '../../utils/InputUtils';
import { STATIC_KEYS } from '../../constants/InputConstants';
import DMTable from '../Table/DMTable';

const ModalSetTargetStoraage = (props) => {
  const { dispatch, user, t } = props;
  const { values } = user;
  const selectedVMs = getValue(STATIC_KEYS.UI_SITE_SELECTED_VMS, values);
  const vm = Object.values(selectedVMs);
  const [searchStr, setSearchStr] = useState('');
  const [data, setData] = useState(vm);
  const vms = getValue(STATIC_KEYS.UI_SITE_SELECTED_VMS, values);
  const initialConfig = [];
  Object.keys(vms).map((key) => {
    const valKey = `${vms[key].moref}${STATIC_KEYS.AWS_TARGET_STORAGE_KEY}`;
    const val = getValue(valKey, values) || 'Snapshot';
    initialConfig.push({ key: valKey, targetStorageType: val });
  });

  if (!selectedVMs) {
    return null;
  }
  const onClose = () => {
    dispatch(closeModal());
  };

  const resetAndClose = () => {
    initialConfig.forEach((c) => {
      dispatch(valueChange(c.key, c.targetStorageType));
    });
    dispatch(closeModal());
  };

  const renderFooter = () => (
    <div className="modal-footer">
      <button type="button" className="btn btn-secondary" onClick={resetAndClose}>
        {t('cancel')}
      </button>
      <button type="button" className="btn btn-success" onClick={onClose}>
        {t('Save')}
      </button>
    </div>
  );

  const render = () => (
    <DMTable
      dispatch={dispatch}
      columns={AWS_TARGET_STORAGE}
      data={data}
      selectedData={data}
      user={user}
    />
  );

  const onFilter = (val) => {
    if (val.length !== 0) {
      const newvm = [];
      vm.forEach((d) => {
        if (d.name.indexOf(val) !== -1) {
          newvm.push(d);
        }
      });
      setData(newvm);
    } else {
      setData(vm);
    }
  };

  const handleSearchChange = (e) => {
    setSearchStr(e.target.value);
    onFilter(e.target.value);
  };

  const onKeyPress = (e) => {
    if (e.key === 'Enter') {
      onFilter(searchStr);
    }
  };

  const renderSearchBox = () => (
    <div className="input-group">
      <input
        type="text"
        className="form-control"
        id="datableSearch"
        placeholder="Search"
        autoComplete="off"
        value={searchStr}
        onChange={handleSearchChange}
        onKeyPress={onKeyPress}
      />
      <span className="input-group-append">
        <div className="input-group-text bg-transparent">
          <FontAwesomeIcon size="sm" icon={faSearch} onClick={() => onFilter(searchStr)} />
        </div>
      </span>
    </div>
  );
  return (
    <>
      <Row className="margin-10">
        <Col sm={3} />
        <Col sm={3} />
        <Col sm={6}>
          {renderSearchBox()}
        </Col>
      </Row>
      <SimpleBar className="max-h-400">
        {render()}
      </SimpleBar>
      {renderFooter()}
    </>
  );
};

export default (withTranslation()(ModalSetTargetStoraage));
