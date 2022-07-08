import React from 'react';
// import { screen } from '@testing-library/react';
import renderWitRedux from '../../tetsUtils/RenderWithRedux';
import MigrationStat from '../../../components/Dashboard/MigrationStat';

describe('Getting started component : getting started tests', () => {
  it('should display response messages on the screen', async () => {
    renderWitRedux(<MigrationStat />);
    const divWithClass = await document.getElementsByClassName('font-weight-medium color-white');
    // const text = screen.findByText('Replication Statistics');
    expect(divWithClass.length).toBe(1);
    // expect(text).toBeInTheDocument();
  });
});
