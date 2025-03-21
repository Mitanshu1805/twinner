import { combineReducers } from 'redux';

import Auth from './auth/reducers';
import Layout from './layout/reducers';
import PageTitle from './pageTitle/reducers';
import interestReducer from './interestAndHobbies/reducers';

const rootReducer = combineReducers({
    Auth,
    Layout,
    PageTitle,
    interest: interestReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;