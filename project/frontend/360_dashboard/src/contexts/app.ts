// Application settings on Redux

export interface STATE {
  currentDistrict: string;
  districtLat: number;
  districtLng: number;
  defaultLat: number;
  defaultLng: number;
  zoom: number;
}

// initState
const initState: STATE = {
  currentDistrict: 'Montreal',
  districtLat: 45.5017,
  districtLng: -73.5673,
  defaultLat: 45.5017,
  defaultLng: -73.5673,
  zoom: 11,
};

// actions
export const GET_SELECTED_DISTRICT = 'GET_SELECTED_DISTRICT';
export const SET_SELECTED_DISTRICT = 'SET_SELECTED_DISTRICT';
export const GET_DISTRICT_COORD = 'GET_DISTRICT_COORD';
export const SET_DISTRICT_COORD = 'SET_DISTRICT_COORD';

export interface SetSelectedDistrictAction {
  type: string;
  data: { districtName: string; lat: number; lng: number; zoom: number };
}

// set selected district
export const setSelectedDistrict = (
  districtName: string,
  lat: number,
  lng: number,
  zoom: number,
): SetSelectedDistrictAction => ({
  type: SET_SELECTED_DISTRICT,
  data: {
    districtName,
    lat,
    lng,
    zoom,
  },
});

export interface SetCoordAction {
  type: string;
  data: { lat: number; lng: number; zoom: number };
}

// set district coord
export const setDistrictCoord = (lat: number, lng: number, zoom: number): SetCoordAction => ({
  type: SET_DISTRICT_COORD,
  data: { lat, lng, zoom },
});

// REDUCER
export default function reducer(state: STATE = initState, action: any): STATE {
  switch (action.type) {
    case SET_SELECTED_DISTRICT: {
      const { data } = action as SetSelectedDistrictAction;
      return {
        ...state,
        currentDistrict: data.districtName,
        districtLat: data.lat,
        districtLng: data.lng,
        defaultLat: data.lat,
        defaultLng: data.lng,
        zoom: data.zoom,
      };
    }
    case SET_DISTRICT_COORD: {
      const { data } = action as SetCoordAction;
      return {
        ...state,
        districtLat: data.lat,
        districtLng: data.lng,
        zoom: data.zoom,
      };
    }
    default:
      return state;
  }
}
