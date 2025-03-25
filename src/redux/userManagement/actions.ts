import { UserManagementActionTypes } from './constants';

type UserManagement = {};

export type UserManagementActionType =
    | {
          type: typeof UserManagementActionTypes.USER_LIST_WITH_FILTER;
          payload: {
              min_age: number;
              max_age: number;
              education: string;
              country: string;
              city: string;
              birthdate: string;
              interested_in: string;
          };
      }
    | { type: typeof UserManagementActionTypes.USER_LIST_WITH_FILTER_SUCCESS };
