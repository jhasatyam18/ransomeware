import siteConnections from '../../../components';

describe('', () => {
  it('should render without error', async () => {
    renderWitRedux(<DashboardJob />);
    const div = await document.getElementsByClassName('font-weight-medium color-white');
    expect(div.length).toBe(1);
  });
});
