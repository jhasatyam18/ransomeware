import React, { useEffect } from 'react';
import { Form, Label } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import { getVMwareAdapterType } from '../../store/actions/VMwareActions';
import { removeNicConfig, valueChange } from '../../store/actions/UserActions';
import { MODAL_NETWORK_CONFIG } from '../../constants/Modalconstant';
import { getValue } from '../../utils/InputUtils';
import { openModal } from '../../store/actions/ModalActions';

function VMwareNetworkConfig(props) {
  const { networkKey, user, dispatch, field, t } = props;
  const { data } = field;
  const { values } = user;
  useEffect(() => {
    let isUnmounting = false;
    const eths = getValue(`${networkKey}`, values) || [];
    if (!eths || eths.length === 0) {
      const { virtualNics = [] } = data;
      if (!isUnmounting) {
        for (let index = 0; index < virtualNics.length; index += 1) {
          dispatch(valueChange(`${networkKey}-eth-${index}-network`, ''));
          dispatch(valueChange(`${networkKey}-eth-${index}-adapterType`, ''));
          dispatch(valueChange(`${networkKey}-eth-${index}-macAddress`, ''));
          eths.push({ key: `${networkKey}-eth-${index}`, isPublicIP: false, network: '', adapterType: '', macAddress: '' });
        }
        dispatch(valueChange(networkKey, eths));
      }
    }
    return () => {
      isUnmounting = true;
    };
  }, []);

  function removeNic(netKey, index) {
    dispatch(removeNicConfig(netKey, index));
  }

  function configureNic(netkey, index) {
    const options = { title: `Nic-${index}`, networkKey: netkey, index };
    dispatch(getVMwareAdapterType());
    dispatch(openModal(MODAL_NETWORK_CONFIG, options));
  }
  function renderRows() {
    const getNetworks = getValue(networkKey, values) || [];
    return getNetworks.map((nic, index) => {
      const key = `${nic.key}-${index}`;
      return (
        <tr key={key}>
          <td>
            <Label>
              {`Nic - ${index}`}
            </Label>
          </td>
          <td>
            <Label className="padding-left-20">
              <a href="#" onClick={() => configureNic(nic.key, index)}>
                {t('title.network')}
              </a>
            </Label>
          </td>
          <td>
            {index !== 0 ? (
              <Label className="padding-left-20">
                <a href="#" onClick={() => removeNic(networkKey, index)}>
                  {t('title.remove')}
                </a>
              </Label>
            ) : null}
          </td>
        </tr>
      );
    });
  }

  function renderIPField() {
    return (
      <div>
        <table className="render-ipfield-table">
          <tbody>
            {renderRows()}
          </tbody>
        </table>
      </div>
    );
  }
  return (
    <>
      <div>
        <Form className="padding-left-10">
          {renderIPField()}
        </Form>
      </div>

    </>
  );
}
export default (withTranslation()(VMwareNetworkConfig));
