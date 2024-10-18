import { withTranslation } from 'react-i18next';

function DiskReplicationTypeItemRenderer(props) {
  const { t, data, field } = props;
  const type = data[field];
  if (type === '') {
    return '-';
  }
  return t(`disk.repl.type.${type}`);
}

export default (withTranslation()(DiskReplicationTypeItemRenderer));
