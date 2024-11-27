import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import { Popover, PopoverBody } from 'reactstrap';
import { getAppKey, getStorageWithUnit } from '../../../utils/AppUtils';

function VMDisksItemRenderer(props) {
  const { data, t } = props;
  const { id } = data;
  let { virtualDisks = [] } = data;
  const [popoverOpen, setPopoverOpen] = useState(false);
  let name = data.name.replace(/\s/g, '');
  name = name.replace(/[^a-zA-Z0-9 ]/g, '');
  let key = '';
  if (name) {
    key = `disk-${name}-${id}`;
  } else {
    key = getAppKey();
  }

  virtualDisks = virtualDisks.filter((el) => {
    if (!el.isDeleted) {
      return el;
    } if (data.isDeleted) {
      return el;
    }
  });

  function renderDiskSize(disk, index) {
    return (
      <tr key={`${disk.devicekey}-${index}`}>
        <td>{`${t('disk')}-${index}:`}</td>
        <td>
          &nbsp;
          &nbsp;
          {getStorageWithUnit(disk.size)}
        </td>
      </tr>
    );
  }
  return (
    <div>
      <button type="button" id={key} onMouseEnter={() => setPopoverOpen(true)} onMouseLeave={() => setPopoverOpen(false)} className="btn noPadding">
        &nbsp;
        {virtualDisks.length}
      </button>
      <Popover placement="bottom" isOpen={popoverOpen} target={key} style={{ backgroundColor: 'black' }}>
        <PopoverBody>
          <table>
            <tbody>
              {
                virtualDisks.map((disk, index) => renderDiskSize(disk, index))
              }
            </tbody>
          </table>
        </PopoverBody>
      </Popover>
    </div>
  );
}

export default (withTranslation()(VMDisksItemRenderer));
