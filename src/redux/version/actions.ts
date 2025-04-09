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

export type VersionActionType =
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

export const versionList = (): VersionActionType => ({
    type: VersionActionTypes.VERSION_LIST,
});

export const versionListSuccess = (data: VersionList[]): VersionActionType => ({
    type: VersionActionTypes.VERSION_LIST_SUCCESS,
    payload: { data },
});

export const versionListError = (error: string): VersionActionType => ({
    type: VersionActionTypes.VERSION_LIST_ERROR,
    payload: { error },
});

export const versionUpdate = (data: VersionUpdate): VersionActionType => ({
    type: VersionActionTypes.VERSION_UPDATE,
    payload: { data },
});

export const versionUpdateSuccess = (message: string): VersionActionType => ({
    type: VersionActionTypes.VERSION_UPDATE_SUCCESS,
    payload: { message },
});

export const versionUpdateError = (error: string): VersionActionType => ({
    type: VersionActionTypes.VERSION_UPDATE_ERROR,
    payload: { error },
});
