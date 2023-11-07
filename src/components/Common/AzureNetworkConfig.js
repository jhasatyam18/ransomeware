import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { Form, Label } from 'reactstrap';
import { MODAL_NETWORK_CONFIG } from '../../constants/Modalconstant';
import { valueChange } from '../../store/actions';
import { openModal } from '../../store/actions/ModalActions';
import { removeNicConfig } from '../../store/actions/UserActions';
import { getNetInfo, getValue } from '../../utils/InputUtils';

class AzureNetworkConfig extends Component {
  componentDidMount() {
    const { user, networkKey, dispatch, field } = this.props;
    const { data } = field;
    const { values } = user;
    const eths = getValue(`${networkKey}`, values) || [];
    if (!eths || eths.length === 0) {
      const { virtualNics = [] } = data;
      for (let index = 0; index < virtualNics.length; index += 1) {
        dispatch(valueChange(`${networkKey}-eth-${index}-subnet`, ''));
        dispatch(valueChange(`${networkKey}-eth-${index}-privateIP`, ''));
        dispatch(valueChange(`${networkKey}-eth-${index}-publicIP`, ''));
        dispatch(valueChange(`${networkKey}-eth-${index}-networkTier`, ''));
        dispatch(valueChange(`${networkKey}-eth-${index}-isPublic`, false));
        eths.push({ key: `${networkKey}-eth-${index}`, isPublicIP: false, publicIP: '', privateIP: '', subnet: '', securityGroup: '' });
      }
      dispatch(valueChange(`${networkKey}`, eths));
    }
  }

  removeNic(netKey, index) {
    const { dispatch } = this.props;
    dispatch(removeNicConfig(netKey, index));
  }

  configureNic(netKey, index) {
    const { dispatch } = this.props;
    const options = { title: `Nic-${index}`, networkKey: netKey, index };
    dispatch(openModal(MODAL_NETWORK_CONFIG, options));
  }

  renderRows() {
    const { user, networkKey, t } = this.props;
    const { values } = user;
    const getNetworks = getValue(networkKey, values) || [];
    return getNetworks.map((nic, index) => {
      const key = `${nic.key}-${index}`;
      const info = getNetInfo(networkKey, index, values);
      let network = info.network || '';
      if (typeof network === 'object') {
        network = network.value;
      }
      const title = `Network: ${network.split(/[\s/]+/).pop()}, Subnet: ${info.subnet}, Public IP : ${info.publicIP}, Private IP: ${info.privateIP}`;
      return (
        <tr key={key}>
          <td>
            <Label>
              {`Nic - ${index}`}
            </Label>
          </td>
          <td>
            <Label className="padding-left-20">
              <a href="#" onClick={() => this.configureNic(nic.key, index)} title={title}>
                {t('title.network')}
              </a>
            </Label>
          </td>
          <td>
            {index !== 0 ? (
              <Label className="padding-left-20">
                <a href="#" onClick={() => this.removeNic(networkKey, index)}>
                  {t('title.remove')}
                </a>
              </Label>
            ) : null}
          </td>
        </tr>
      );
    });
  }

  renderIPField() {
    return (
      <div>
        <table className="render-ipfield-table">
          <tbody>
            {this.renderRows()}
          </tbody>
        </table>
      </div>
    );
  }

  render() {
    return (
      <div>
        <Form className="padding-left-10">
          {this.renderIPField()}
        </Form>
      </div>
    );
  }
}

export default (withTranslation()(AzureNetworkConfig));
