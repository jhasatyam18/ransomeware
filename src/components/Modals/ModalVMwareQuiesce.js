import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { Col, Row } from 'reactstrap';
import SimpleBar from 'simplebar-react';
import { STATIC_KEYS } from '../../constants/InputConstants';
import { VMWARE_QUIESCE_SNAPSHOT } from '../../constants/TableConstants';
import { valueChange } from '../../store/actions';
import { closeModal } from '../../store/actions/ModalActions';
import { getValue } from '../../utils/InputUtils';
import DMTable from '../Table/DMTable';

function ModalVMwareQuiesce(props) {
  const { dispatch, user, t } = props;
  const { values } = user;
  const selectedVMs = getValue(STATIC_KEYS.UI_SITE_SELECTED_VMS, values);
  const vm = Object.values(selectedVMs);
  const [quiesceAll, setQuiesceAll] = useState(false);
  const [searchStr, setSearchStr] = useState('');
  const [data, setData] = useState(vm);
  const vms = getValue(STATIC_KEYS.UI_SITE_SELECTED_VMS, values);
  const initialConfig = [];
  let isAllSelected = true;
  Object.keys(vms).map((key) => {
    const valKey = `${vms[key].moref}${STATIC_KEYS.VMWARE_QUIESCE_KEY}`;
    const val = getValue(valKey, values);
    if (val) {
      initialConfig.push({ key: valKey, isQuiesced: true });
    } else {
      initialConfig.push({ key: valKey, isQuiesced: false });
    }
    if (val !== true) {
      isAllSelected = false;
    }
  });
  useEffect(() => {
    let isUnmounting = false;
    if (!isUnmounting) {
      if (isAllSelected) {
        setQuiesceAll(true);
      } else {
        setQuiesceAll(false);
      }
    }
    return () => {
      isUnmounting = true;
    };
  }, [isAllSelected]);

  if (!selectedVMs) {
    return null;
  }
  const onClose = () => {
    dispatch(closeModal());
  };

  const resetAndClose = () => {
    initialConfig.forEach((c) => {
      dispatch(valueChange(c.key, c.isQuiesced));
    });
    dispatch(closeModal());
  };

  const handleQuiesceAllChange = (e) => {
    if (e.target.checked) {
      Object.keys(selectedVMs).map((key) => {
        dispatch(valueChange(`${key}${STATIC_KEYS.VMWARE_QUIESCE_KEY}`, true));
      });
      setQuiesceAll(true);
    } else {
      Object.keys(selectedVMs).map((key) => {
        dispatch(valueChange(`${key}${STATIC_KEYS.VMWARE_QUIESCE_KEY}`, false));
      });
      setQuiesceAll(false);
    }
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
      columns={VMWARE_QUIESCE_SNAPSHOT}
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
      <span className="input-group-text bg-transparent">
        <FontAwesomeIcon size="sm" icon={faSearch} onClick={() => onFilter(searchStr)} />
      </span>
    </div>
  );
  return (
    <>
      <Row className="margin-10">
        <Col sm={3}>
          <div className="form-check margin-top-5">
            <input type="checkbox" className="form-check-input" id="quiesceAllChk" name="quiesceAllChk" checked={quiesceAll} onChange={handleQuiesceAllChange} />
            <label className="form-check-label" htmlFor="quiesceAllChk">All</label>
          </div>
        </Col>
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
}

export default (withTranslation()(ModalVMwareQuiesce));
