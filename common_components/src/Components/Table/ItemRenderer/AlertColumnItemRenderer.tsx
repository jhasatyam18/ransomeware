import React from 'react';
import { Link } from 'react-router-dom';
import { Badge, Row, Col } from 'reactstrap';
import { UserInterface } from '../../../interfaces/interfaces';
import { getValue } from '../../../utils/AppUtils';

interface AlertsItemRendererProps {
  data: {
    alerts?: string;
    [key: string]: any;
  };
  user: UserInterface,
  options: any
}

const colorMap: Record<string, string> = {
  Error: 'danger',
  Warning: 'warning',
  Major: 'info',
  Critical: 'danger',
};

const AlertsItemRenderer: React.FC<AlertsItemRendererProps> = ({ data, user, options }) => {
  const { values } = user;
  const selectedSite = getValue({ key: 'GLOBAL_SITE_KEY', values }) || [];
  let siteDATA = getValue({ key: 'GLOBAL_OPT_SITE_DATA', values })
  if (!data || !data.alerts) return <span>-</span>;
  const alertsArray = data.alerts.split(',').map((part: string) => {
    const [key, value] = part.split('=').map((s) => s.trim());
    return { type: key.charAt(0).toUpperCase() + key.slice(1).toLowerCase(), count: Number(value) };
  });
  let { hostName } = siteDATA?.filter((el: any) => el.value === selectedSite);
  const { objectUrnFileds, nestedField } = options;
  let objectUrns: string[] = objectUrnFileds[0]!== '' ? [objectUrnFileds[0]] : [];
  objectUrnFileds.map((el: any,ind:number) => {
    if (data[el] && ind !==0) {
      objectUrns.push(data[el]);
    }
  })
  const objurn: string = objectUrns.join(":")
  if(nestedField){
    hostName = nestedField.split('.').reduce((acc: any, key: string) => acc?.[key], data);
  }
  return (
    <div>
      <Row>
        {alertsArray.map(({ type, count }) => (
          <Col key={type} xs="6" className="mb-1">
            <Link target="_blank"
              rel="noopener noreferrer" style={{ fontWeight: '410' }} className={`text-${colorMap[type]}`} to={`https://${hostName}:5000/mgmt/monitor/alerts/${objurn}/${type}`}>{type}: {count}</Link>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default AlertsItemRenderer;
