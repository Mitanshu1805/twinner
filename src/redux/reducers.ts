import { combineReducers } from 'redux';

import Auth from './auth/reducers';
import Layout from './layout/reducers';
import PageTitle from './pageTitle/reducers';
import interestReducer from './interestAndHobbies/reducers';

export default combineReducers({
    Auth,
    Layout,
    PageTitle,
    interestReducer,
});
