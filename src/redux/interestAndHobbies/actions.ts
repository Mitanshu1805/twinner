import { PageTitleState } from './../pageTitle/constants';
// import { IntAndHobActionType } from './actions';
import { IntAndHobActionTypes } from './constants';

type Interest = {
    interest_id: string;
    interest_name: string;
    interest_image: string;
};

export type IntAndHobActionType =
    | {
          type: typeof IntAndHobActionTypes.INTERESTS_LIST;
          payload: {
              page: number;
              limit: number;
          };
      }
    | { type: typeof IntAndHobActionTypes.INTERESTS_LIST_SUCCESS; payload: { data: Interest } }
    | { type: typeof IntAndHobActionTypes.INTERESTS_LIST_ERROR; payload: { error: string } }
    | { type: typeof IntAndHobActionTypes.INTERESTS_ADD; payload: FormData }
    | { type: typeof IntAndHobActionTypes.INTERESTS_ADD_SUCCESS; payload: { message: string } }
    | { type: typeof IntAndHobActionTypes.INTERESTS_ADD_ERROR; payload: { error: string } }
    | { type: typeof IntAndHobActionTypes.INTERESTS_UPDATE; payload: FormData }
    | { type: typeof IntAndHobActionTypes.INTERESTS_UPDATE_SUCCESS; payload: { message: string } }
    | { type: typeof IntAndHobActionTypes.INTERESTS_UPDATE_ERROR; payload: { error: string } }
    | { type: typeof IntAndHobActionTypes.INTERESTS_DELETE; payload: { interest_id: string } }
    | { type: typeof IntAndHobActionTypes.INTERESTS_DELETE_SUCCESS; payload: { message: string } }
    | { type: typeof IntAndHobActionTypes.INTERESTS_DELETE_ERROR; payload: { error: string } };

export const interestList = (page: number = 1, limit: number = 3): IntAndHobActionType => ({
    type: IntAndHobActionTypes.INTERESTS_LIST,
    payload: { page, limit },
});

export const interestListSuccess = (data: Interest): IntAndHobActionType => ({
    type: IntAndHobActionTypes.INTERESTS_LIST_SUCCESS,
    payload: { data },
});

export const interestListError = (error: string): IntAndHobActionType => ({
    type: IntAndHobActionTypes.INTERESTS_LIST_ERROR,
    payload: { error },
});

export const interestAdd = (data: FormData): IntAndHobActionType => ({
    type: IntAndHobActionTypes.INTERESTS_ADD,
    payload: data,
});

export const interestAddSuccess = (message: string): IntAndHobActionType => ({
    type: IntAndHobActionTypes.INTERESTS_ADD_SUCCESS,
    payload: { message },
});

export const interestAddError = (error: string): IntAndHobActionType => ({
    type: IntAndHobActionTypes.INTERESTS_ADD_ERROR,
    payload: { error },
});

export const interestUpdate = (data: FormData): IntAndHobActionType => ({
    type: IntAndHobActionTypes.INTERESTS_UPDATE,
    payload: data,
});

export const interestUpdateSuccess = (message: string): IntAndHobActionType => ({
    type: IntAndHobActionTypes.INTERESTS_UPDATE_SUCCESS,
    payload: { message },
});

export const interestUpdateError = (error: string): IntAndHobActionType => ({
    type: IntAndHobActionTypes.INTERESTS_UPDATE_ERROR,
    payload: { error },
});

export const interestDelete = (interest_id: string): IntAndHobActionType => ({
    type: IntAndHobActionTypes.INTERESTS_DELETE,
    payload: { interest_id },
});

export const interestDeleteSuccess = (message: string): IntAndHobActionType => ({
    type: IntAndHobActionTypes.INTERESTS_DELETE_SUCCESS,
    payload: { message },
});

export const interestDeleteError = (error: string): IntAndHobActionType => ({
    type: IntAndHobActionTypes.INTERESTS_DELETE_ERROR,
    payload: { error },
});
