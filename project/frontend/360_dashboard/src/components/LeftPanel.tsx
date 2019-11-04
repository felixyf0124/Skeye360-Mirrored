import React from 'react';
import { Button } from 'react-bootstrap';

const LeftPanel = (props: any) => (
  <div className="left-panel-container">
    <Button className="panel-btn">Button 1</Button>
    <Button className="panel-btn">Button 2</Button>
    <Button className="panel-btn">Button 3</Button>
  </div>
);

export default LeftPanel;
