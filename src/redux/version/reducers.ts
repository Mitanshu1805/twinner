import { VersionActionTypes } from './constants';

interface VersionList {
    app_version_id: string;
    os: string;
    version: string;
    is_force_update: boolean;
    updated_at: string;
}

interface VersionUpdate {
    app_version_id: string;
    version: string;
    is_force_update: boolean;
}

interface VersionState {
    loading: boolean;
    versionList: VersionList[];
    updateMessage: string | null;
    error: string | null;
}

const initialState: VersionState = {
    loading: false,
    versionList: [],
    updateMessage: null,
    error: null,
};

type VersionActionType =
    | {
          type: VersionActionTypes.VERSION_LIST;
      }
    | {
          type: VersionActionTypes.VERSION_LIST_SUCCESS;
          payload: { data: VersionList[] };
      }
    | {
          type: VersionActionTypes.VERSION_LIST_ERROR;
          payload: { error: string };
      }
    | {
          type: VersionActionTypes.VERSION_UPDATE;
          payload: { data: VersionUpdate };
      }
    | {
          type: VersionActionTypes.VERSION_UPDATE_SUCCESS;
          payload: { message: string };
      }
    | {
          type: VersionActionTypes.VERSION_UPDATE_ERROR;
          payload: { error: string };
      };

export const versionReducer = (state = initialState, action: VersionActionType): VersionState => {
    switch (action.type) {
        case VersionActionTypes.VERSION_LIST:
        case VersionActionTypes.VERSION_UPDATE:
            return {
                ...state,
                loading: true,
                error: null,
                updateMessage: null,
            };

        case VersionActionTypes.VERSION_LIST_SUCCESS:
            return {
                ...state,
                loading: false,
                versionList: action.payload.data,
                error: null,
            };

        case VersionActionTypes.VERSION_LIST_ERROR:
        case VersionActionTypes.VERSION_UPDATE_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload.error,
            };

        case VersionActionTypes.VERSION_UPDATE_SUCCESS:
            return {
                ...state,
                loading: false,
                updateMessage: action.payload.message,
                error: null,
            };

        default:
            return state;
    }
};
