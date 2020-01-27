import RoadIntersection from '../../../containers/simulator/simulator_management/RoadIntersection';
import Vec2 from '../../../containers/simulator/simulator_management/vec2';
import RoadSection from '../../../containers/simulator/simulator_management/RoadSection';
import TrafficLightManager from '../../../containers/simulator/simulator_management/TrafficLightManager';

const { expect } = require('chai');
const sinon = require('sinon');
// import obj from '../../../containers/simulator/simulator_management/Vehicle';
// import * as ts from '../../../containers/simulator/TSGeometry';

describe('road intersection', () => {
  let intersection = new RoadIntersection(1, new Vec2(123, 321));

  let section1 = new RoadSection(0, 1, new Vec2(120,0));
  let section2 = new RoadSection(1, 1, new Vec2(-120,0));
  let section3 = new RoadSection(2, 1, new Vec2(0,120));
  let section4 = new RoadSection(3, 1, new Vec2(0,-120));

  before(()=>{
     
  });

  it('get intersection id, getId', ()=>{
      expect(intersection.getId()).to.equal(1);
  });

  it('getMapCoordinate', ()=>{
      expect(intersection.getMapCoordinate().x).to.equal(123);
      expect(intersection.getMapCoordinate().y).to.equal(321);
  });

  it('addNewRoadSection', ()=>{
      expect(intersection.getRoadSections().length).to.equal(0);

      

      intersection.addNewRoadSection(new Vec2(120,0));
      expect(intersection.getRoadSection(0).getId()).to.equal(section1.getId());
      expect(intersection.getRoadSection(0).getRoadIntersectionId()).to.equal(section1.getRoadIntersectionId());
      expect(intersection.getRoadSection(0).getTail()).to.deep.equal(section1.getTail());
      
      intersection.addNewRoadSection(new Vec2(-120,0));
      expect(intersection.getRoadSection(1)).to.deep.equal(section2);

      intersection.addNewRoadSection(new Vec2(0, 120));
      expect(intersection.getRoadSection(2)).to.deep.equal(section3);

      intersection.addNewRoadSection(new Vec2(0, -120));
      expect(intersection.getRoadSection(3)).to.deep.equal(section4);

      expect(intersection.getRoadSections().length).to.equal(4);
  });

  it('resortRoadSections', ()=>{
      intersection.resortRoadSections();
      expect(intersection.getRoadSectionIndex(0)).to.equal(0);
      expect(intersection.getRoadSectionIndex(2)).to.equal(3);
      expect(intersection.getRoadSectionIndex(1)).to.equal(2);
      expect(intersection.getRoadSectionIndex(3)).to.equal(1);
  });

  // it('vehicles', ()=>{
  //     expect(intersection.getVehiclesNum()).to.equal(0);
  // });

  it('addNewSimpleVehicle', ()=>{
    expect(intersection.getSimpleVehicles().length).to.equal(0);
    intersection.addNewSimpleVehicle(12,new Vec2(33, 34));

    let simpleVehicleList = intersection.getSimpleVehicles();
    expect(simpleVehicleList.length).to.equal(1);
    expect(simpleVehicleList[0].getId()).to.equal(12);
    expect(simpleVehicleList[0].getPosition()).to.deep.equal(new Vec2(33, 34));

  });

  it('initSimpleVehicles', ()=>{
    expect(intersection.getSimpleVehicles().length).to.equal(1);
    intersection.initSimpleVehicles();
    expect(intersection.getSimpleVehicles().length).to.equal(0);
  });

  it('isSimpleVehicleExist', ()=>{
    expect(intersection.getSimpleVehicles().length).to.equal(0);
    intersection.addNewSimpleVehicle(12,new Vec2(33, 34));
    expect(intersection.isSimpleVehicleExist(12)).to.equal(true);
    expect(intersection.isSimpleVehicleExist(16)).to.equal(false);
  });

  it('SimpleVehiclePosUpdate', ()=>{
    let simpleVehicleList = intersection.getSimpleVehicles();
    expect(simpleVehicleList.length).to.equal(1);
    expect(simpleVehicleList[0].getId()).to.equal(12);
    expect(simpleVehicleList[0].getPosition()).to.deep.equal(new Vec2(33, 34));

    intersection.SimpleVehiclePosUpdate(12, new Vec2(66, 67));
    expect(simpleVehicleList[0].getPosition()).to.deep.equal(new Vec2(66, 67));

    intersection.SimpleVehiclePosUpdate(11, new Vec2(66, 67));
    expect(simpleVehicleList[0].getPosition()).to.deep.equal(new Vec2(66, 67));
  });

  it('tryAddSimpleVehicle', ()=>{
    
    expect(intersection.getSimpleVehicles().length).to.equal(1);
    let simpleVehicleList = intersection.getSimpleVehicles();
    expect(simpleVehicleList[0].getId()).to.equal(12);
    expect(simpleVehicleList[0].getPosition()).to.deep.equal(new Vec2(66, 67));

    intersection.tryAddSimpleVehicle(12, new Vec2(77, 77));
    expect(intersection.getSimpleVehicles().length).to.equal(1);
    expect(simpleVehicleList[0].getId()).to.equal(12);
    expect(simpleVehicleList[0].getPosition()).to.deep.equal(new Vec2(77, 77));

    intersection.tryAddSimpleVehicle(22, new Vec2(222, 233));
    simpleVehicleList = intersection.getSimpleVehicles();
    expect(simpleVehicleList.length).to.equal(2);
    expect(simpleVehicleList[0].getId()).to.equal(12);
    expect(simpleVehicleList[1].getId()).to.equal(22);
    expect(simpleVehicleList[1].getPosition()).to.deep.equal(new Vec2(222, 233));
    
  });


  it(`addNewTrafficLight, get traffic light`,()=>{
    expect(intersection.getTrafficLightQueue().length).to.equal(0);
    intersection.addNewTrafficLight({section:0,id:0},10);
    expect(intersection.getTrafficLightQueue().length).to.equal(1);
    expect(intersection.getTrafficLightQueue()[0].id).to.equal(0);
    expect(intersection.getTrafficLightQueue()[0].getTotalTime()).to.equal(10);

    intersection.addNewTrafficLight({section:1,id:0},16);
    expect(intersection.getTrafficLightQueue().length).to.equal(2);
    expect(intersection.getTrafficLightQueue()[1].id).to.equal(1);
    expect(intersection.getTrafficLightQueue()[1].getTotalTime()).to.equal(16);
  });


  it(`getTrafficLightIndex`,()=>{

    const id = intersection.getTrafficLightQueue()[0].getId();
    expect(intersection.getTrafficLightIndex(id)).to.equal(0);
  });

  it(`getTrafficLightSetting`,()=>{
    expect(intersection.getTrafficLightQueue().length).to.equal(2);
    intersection.addNewTrafficLight({section:2,id:0},17);
    expect(intersection.getTrafficLightQueue().length).to.equal(3);
    const last = intersection.getTrafficLightQueue().length;
    expect(intersection.getTrafficLightQueue()[last-1].id).to.equal(last-1);
    const setting = intersection.getTrafficLightSetting(last-1);
    expect(setting.green).to.equal(12);
  });

  
  it(`setTLOverlapOffset`,()=>{

    expect(intersection.getTrafficLight(0).getOverlapOffset()).to.equal(0);
    intersection.setTLOverlapOffset(0,30);
    expect(intersection.getTrafficLight(0).getOverlapOffset()).to.equal(30);

  });

  it(`setTLCounterOffset`,()=>{

    expect(intersection.getTLCounterOffset()).to.equal(0);
    intersection.setTLCounterOffset(33);
    expect(intersection.getTLCounterOffset()).to.equal(33);
    intersection.setTLCounterOffset(0);

  });

  it(`setTrafficLightTime`,()=>{

    intersection.setTrafficLightTime(0,30);
    expect(intersection.getTrafficLight(0).getTotalTime()).to.equal(30);
    expect(intersection.getTrafficLight(0).getGreenTime()).to.equal(25);

  });

});
