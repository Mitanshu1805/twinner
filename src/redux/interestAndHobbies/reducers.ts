import { interestList, interestListSuccess } from './actions';
import { APICore } from '../../helpers/api/apiCore';
import { IntAndHobActionTypes } from './constants';

const api = new APICore();

interface InterestListSuccessPayload {
    message: string;
}

interface InterestListErrorPayload {
    error: string;
}

interface InterestState {
    interests: any[];
    loading: boolean;
    error: string | null;
    message: string | null;
}

const initialState: InterestState = {
    interests: [],
    loading: false,
    error: null,
    message: null,
};

// Corrected union type definition
type IntAndHobActionType =
    | { type: typeof IntAndHobActionTypes.INTERESTS_LIST }
    | { type: typeof IntAndHobActionTypes.INTERESTS_LIST_SUCCESS; payload: InterestListSuccessPayload }
    | { type: typeof IntAndHobActionTypes.INTERESTS_LIST_ERROR; payload: InterestListErrorPayload }
    | { type: typeof IntAndHobActionTypes.INTERESTS_ADD }
    | { type: typeof IntAndHobActionTypes.INTERESTS_ADD_SUCCESS; payload: InterestListSuccessPayload }
    | { type: typeof IntAndHobActionTypes.INTERESTS_ADD_ERROR; payload: InterestListErrorPayload }
    | { type: typeof IntAndHobActionTypes.INTERESTS_DELETE }
    | { type: typeof IntAndHobActionTypes.INTERESTS_DELETE_SUCCESS; payload: InterestListSuccessPayload }
    | { type: typeof IntAndHobActionTypes.INTERESTS_DELETE_ERROR; payload: InterestListErrorPayload }
    | { type: typeof IntAndHobActionTypes.INTERESTS_UPDATE }
    | { type: typeof IntAndHobActionTypes.INTERESTS_UPDATE_SUCCESS; payload: InterestListSuccessPayload }
    | { type: typeof IntAndHobActionTypes.INTERESTS_UPDATE_ERROR; payload: InterestListErrorPayload };

const interestReducer = (state = initialState, action: IntAndHobActionType): InterestState => {
    switch (action.type) {
        case IntAndHobActionTypes.INTERESTS_LIST:
        case IntAndHobActionTypes.INTERESTS_ADD:
        case IntAndHobActionTypes.INTERESTS_DELETE:
        case IntAndHobActionTypes.INTERESTS_UPDATE:
            return { ...state, loading: true, error: null, message: null };

        case IntAndHobActionTypes.INTERESTS_LIST_SUCCESS:
            return { ...state, loading: false, interests: action.payload.message, message: 'Fetched successfully' };

        case IntAndHobActionTypes.INTERESTS_ADD_SUCCESS:
        case IntAndHobActionTypes.INTERESTS_DELETE_SUCCESS:
        case IntAndHobActionTypes.INTERESTS_UPDATE_SUCCESS:
            return { ...state, loading: false, message: action.payload.message, error: null };

        case IntAndHobActionTypes.INTERESTS_LIST_ERROR:
        case IntAndHobActionTypes.INTERESTS_ADD_ERROR:
        case IntAndHobActionTypes.INTERESTS_DELETE_ERROR:
        case IntAndHobActionTypes.INTERESTS_UPDATE_ERROR:
            return { ...state, loading: false, error: action.payload.error, message: null };

        default:
            return state;
    }
};

export default interestReducer;
