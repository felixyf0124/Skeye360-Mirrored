import React from 'react';
import { STATE as countState } from '../contexts/countTime';

const DisplayCount = (count: countState): JSX.Element => {
    console.log(count);
    console.log("Test");
    return(
        <div style={{width:'100px', backgroundColor:'red'}}>
            <p>{count}</p>
        </div>
    )
}

export default DisplayCount; 