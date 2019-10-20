export interface STATE {
    streaming_map: boolean;
}

const initState: STATE = {
    streaming_map: false,
}

export const VIEW_STREET = 'VIEW_STREET';
export const EXIT_VIEW_STREET = 'EXIT_VIEW_STREET';

export interface ViewStreetAction {
    type: string;
}

export const viewStreet = (): ViewStreetAction => ({
    type: VIEW_STREET,
});

export interface ExitViewStreetAction {
    type: string;
}

export const exitStreetView = (): ExitViewStreetAction => ({
    type: EXIT_VIEW_STREET,
});

// SAGA

export function* saga(): Iterator<any> {
}

export default function reducer(state: STATE = initState, action: any): STATE {
    switch (action.type) {
        case VIEW_STREET: {
            return {
                ...state,
                streaming_map: true,
            }
        }
        case EXIT_VIEW_STREET: {
            return {
                ...state,
                streaming_map: false,
            }
        }
        default:
            return state;
    }
}