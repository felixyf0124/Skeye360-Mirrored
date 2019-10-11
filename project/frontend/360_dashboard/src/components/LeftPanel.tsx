import React from 'react';
import { Button } from 'react-bootstrap'; 

const LeftPanel = (props: any) => {
    return(
     <div className = "left-panel-container">
         <Button>Button 1</Button>
         <Button>Button 2</Button>
         <Button>Button 3</Button>
     </div>   
    )
}

export default LeftPanel;