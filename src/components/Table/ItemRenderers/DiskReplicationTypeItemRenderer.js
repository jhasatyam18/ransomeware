import { withTranslation } from 'react-i18next';

function DiskReplicationTypeItemRenderer(props) {
  const { t, data, field } = props;
  let type = data[field];
  if (type === '') {
    type = 'incremental';
  }
  return t(`disk.repl.type.${type}`);
}

export default (withTranslation()(DiskReplicationTypeItemRenderer));
