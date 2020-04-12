
import Vehicle from '../../../containers/simulator/simulator_management/Vehicle';

import Vec2 from '../../../containers/simulator/simulator_management/vec2';
import ts from '../../../containers/simulator/TSGeometry';

const { expect } = require('chai');


describe('New case test for Vehicle waiting time', () =>{
    const maxSpeed = 6;
    const largeLoop = 9999999;
    const vehicle = new Vehicle(0,0,0,maxSpeed,new Vec2(0,0))
    let timeStamp = Date.now();

    const p0 = new Vec2(0,0);
    const p1 = new Vec2(1000,0);
    const p2 = new Vec2(2000,0);
    const p3 = new Vec2(3000,0);

    vehicle.path.push([p0,p1]); // in coming lane path
    vehicle.path.push([p1,p2]); // in coming lane to leaving lane transition path
    vehicle.path.push([p2,p3]); // leaving lane path

    vehicle.accel = maxSpeed;

    
    it('Test getDeltaT',()=>{
        // try some delay
        for(let i =0; i<largeLoop;i+=1);
        const deltaT = vehicle.getDeltaT();
        const delay = Date.now()- timeStamp;
        timeStamp = Date.now();
        expect(deltaT>0).to.equal(true);

        // error msg if error occurs
        const eMsg = 'given delay = '+ delay 
        + ' ms, actual deltaT = ' + deltaT + " ms";
        expect(delay).to.equal(deltaT,eMsg);

    });

    it('cumulative wating time test 1: speed = 0 for initial update',()=>{

        //expected pre-condition speed now at 0
        expect(vehicle.getSpeed()).to.equal(0);
        vehicle.stop();
        let deltaT = Date.now()- timeStamp;
        timeStamp = Date.now();
        // initial update shall ignore delta time for cumulative waiting time 
        // even the speed is 0
        // update
        vehicle.update(10);

        let cumulativeWaitingT = vehicle.getCumulativeWaitingTime();
        let eMsg = "actual deltaT = " + deltaT 
        + " ms, cumulative waiting time = " + cumulativeWaitingT + " ms";
        expect(cumulativeWaitingT).to.equal(0,eMsg);

        // try some delay
        for(let i =0; i<largeLoop;i+=1);
        deltaT = Date.now()- timeStamp;
        timeStamp = Date.now();
        vehicle.stop();
        vehicle.update(10);

        expect(deltaT>0).to.equal(true,"deltaT = " + deltaT);

        cumulativeWaitingT = vehicle.getCumulativeWaitingTime();
        eMsg = "actual deltaT = " + deltaT 
        + " ms, cumulative waiting time = " + cumulativeWaitingT + " ms";
        expect(cumulativeWaitingT).to.equal(0,eMsg);
        
    });

    it('cumulative wating time test 2: speed != 0 will not count',()=>{
        
        expect(vehicle.getSpeed()).to.equal(0);

        let deltaT = Date.now()- timeStamp;
        timeStamp = Date.now();
        // start move
        vehicle.move();
        vehicle.update(10);
        expect(vehicle.getSpeed()>0).to.equal(true,"vehicle speed = " + vehicle.getSpeed());

        let cumulativeWaitingT = vehicle.getCumulativeWaitingTime();
        let eMsg = "actual deltaT = " + deltaT 
        + " ms, cumulative waiting time = " + cumulativeWaitingT + " ms";
        expect(cumulativeWaitingT).to.equal(0,eMsg);

        // try some delay
        for(let i =0; i<largeLoop;i+=1);
        // update

        deltaT = Date.now()- timeStamp;
        timeStamp = Date.now();
        vehicle.update(10);

        expect(vehicle.getSpeed()).not.to.equal(0);

        expect(deltaT>0).to.equal(true);

        cumulativeWaitingT = vehicle.getCumulativeWaitingTime();
        eMsg = "actual deltaT = " + deltaT 
        + " +1 ms, cumulative waiting time = " + cumulativeWaitingT + " ms";

        expect(cumulativeWaitingT).not.to.equal(deltaT,eMsg);
        expect(cumulativeWaitingT).to.equal(0,eMsg);

    });


    it('cumulative wating time test 3: after speed (> 0) slow down to 0, shall count for cumulative waiting time once the speed > 0 again',()=>{

        expect(vehicle.getSpeed()>0).to.equal(true);
        vehicle.stop();

        let deltaT = Date.now()- timeStamp;      
        timeStamp = Date.now();
        // start counting
        // notice that the deltaTime in update(deltaTime) is for speed update
        // not for cumulative waiting time
        // therefore, to ensure the speed is successfully updated as "> 0" for cumulative time 
        // we put some deltaTime that is greater than 0
        vehicle.update(10); 
        expect(vehicle.getSpeed()).to.equal(0);

        let cumulativeWaitingT = vehicle.getCumulativeWaitingTime();
        let eMsg = "actual deltaT = " + deltaT 
        + " ms, cumulative waiting time = " + cumulativeWaitingT + " ms";

        expect(cumulativeWaitingT).to.equal(0, eMsg);
        
        // try some delay
        for(let i =0; i<largeLoop;i+=1);

        deltaT = Date.now()- timeStamp;
        timeStamp = Date.now();
        vehicle.update(10);

        expect(deltaT>0).to.equal(true,"deltaT = " + deltaT);
        
        cumulativeWaitingT = vehicle.getCumulativeWaitingTime();
        eMsg = "actual deltaT = " + deltaT 
        + " ms, cumulative waiting time =v " + cumulativeWaitingT + " ms";

        // update won't count when speed is still at 0 since the vehicle is still waiting
        expect(cumulativeWaitingT).to.equal(0, eMsg);

        // update shall count the waiting period only once the speed is not 0 again
        expect(vehicle.getSpeed()).to.equal(0);
      
        vehicle.move();
        
        deltaT += Date.now()- timeStamp;
        timeStamp = Date.now();
        vehicle.update(10);

        expect(vehicle.getSpeed())
        .not.to.equal(0, "speed should not = 0, current speed = " + vehicle.getSpeed());

        expect(deltaT>0).to.equal(true,"deltaT = " + deltaT);

        expect(vehicle.getAtPathSection()).to.equal(0, "at path sec " + vehicle.getAtPathSection());

        cumulativeWaitingT = vehicle.getCumulativeWaitingTime();
        eMsg = "actual deltaT = " + deltaT 
        + " ms, cumulative waiting time = " + cumulativeWaitingT + " ms";
        expect(cumulativeWaitingT).not.to.equal(0, eMsg);
        expect(cumulativeWaitingT).to.equal(deltaT, eMsg);
    });

});