import { Link } from 'react-router-dom';
import { Badge } from 'reactstrap';
import { UserInterface } from '../../../interfaces/interfaces';
import { getValue } from '../../../utils/AppUtils';

interface StatusItemRendererProps {
  data: any;
  field: string;
  noPopOver?: boolean;
  showDate?: boolean;
  user: UserInterface;
}

const AlertAckItemRenderer: React.FC<StatusItemRendererProps> = ({ data, field, user }) => {
    if (!data) return null;
    let status = data[field];
    status = status ? 'yes' : 'no';
    const { values } = user;
    const selectedSite = getValue({key:'GLOBAL_SITE_KEY', values});
    let siteDATA = getValue({key:'GLOBAL_OPT_SITE_DATA', values})
    siteDATA = siteDATA.filter((el:any) => el.value === selectedSite);
    status = status.toLowerCase();
    const resp = status.charAt(0).toUpperCase() + status.slice(1);

    const successStatus = ['yes'];
    const errorStatus = ['no'];

    const statusRenderer = ({ name }: { name: string }) => {
        return <>
            <Badge
                id={`status-${field}-${data.name}-${data.id}`}
                className={`pl-2 pr-2 pt-1 pb-1 dashboard_rec_heading_size fw-normal badge-soft-${name}`}
                color={name}
                pill
            >
                {resp}
            </Badge>
            {resp === 'Yes' ? null : <Link target="_blank"
                rel="noopener noreferrer" to={`https://${siteDATA[0].hostName}:5000/mgmt/monitor/alerts/${data.id}`} className='ms-2'>Click here</Link>}
        </>
    }

    if (successStatus.includes(status)) {
        return statusRenderer({ name: 'success' });
    }

  if (errorStatus.includes(status)) {
    return statusRenderer({ name: 'danger' });
  }

  return statusRenderer({ name: 'secondary' });
};

export default AlertAckItemRenderer;
