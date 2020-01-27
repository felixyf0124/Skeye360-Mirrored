import * as tsData from '../../../containers/simulator/TSLocalData';
import { isMainThread } from 'worker_threads';

const { expect } = require('chai');


describe(`TS data retrieve`, ()=>{
    
    it(`tlArimaDataAdapter`,()=>{
        const filtered = new Array();
        const d1 = {
            dir:"we",
            count:200,
        };
        const d2 = {
            dir:"wn",
            count:100,
        };
        const d3 = {
            dir:"sn",
            count:180,
        };
        filtered.push(d1,d2,d3);
        const out = tsData.tlArimaDataAdapter(filtered);
        expect(out[0].id).to.equal(0);
        expect(out[1].id).to.equal(1);
        expect(out[2].id).to.equal(3);

        expect(out[0].count).to.equal(200);
        expect(out[1].count).to.equal(100);
        expect(out[2].count).to.equal(180);

    });

    it(`tlArimaDataToTimeDistribution`,()=>{

        const test = new Array();
        const tl0 = { id: 0, count: 3 };
        const tl1 = { id: 1, count: 2 };
        const tl3 = { id: 3, count: 4 };
        test.push(tl0);
        test.push(tl1);
        test.push(tl3);

        const out = tsData.tlArimaDataToTimeDistribution(test);
        expect(out.tl0).to.equal(30);
        expect(out.tl1).to.equal(20);
        expect(out.tl2).not.to.equal(40);
        expect(out.tl3).to.equal(40);

    });
    // it(``,()=>{});
});