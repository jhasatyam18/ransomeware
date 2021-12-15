import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import { Popover, PopoverBody } from 'reactstrap';
import { getStorageWithUnit } from '../../../utils/AppUtils';

function VMDisksItemRenderer(props) {
  const { data, t } = props;
  const { virtualDisks = [] } = data;
  const [popoverOpen, setPopoverOpen] = useState(false);
  const key = `key-${data.moref}`;

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
