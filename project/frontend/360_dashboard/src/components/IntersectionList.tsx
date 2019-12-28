/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import SideDrawer from './SideDrawer';
import IntersectionTable from './IntersectionTable';

// const headerTitle = "Intersection List";
const IntersectionList = (): any => (
  <div style={{ display: 'flex'}}>
    <SideDrawer />
    <IntersectionTable /> 
  </div>
);

export default IntersectionList;
