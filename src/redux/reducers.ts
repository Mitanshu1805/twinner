import { combineReducers } from 'redux';

import Auth from './auth/reducers';
import Layout from './layout/reducers';
import PageTitle from './pageTitle/reducers';
import interestReducer from './interestAndHobbies/reducers';
import adminUserReducer from './subAdminUser/reducers';
import reportReducer from './report/reducers';
import userReducer from './userManagement/reducers';

const rootReducer = combineReducers({
    Auth,
    Layout,
    PageTitle,
    interest: interestReducer,
    adminUser: adminUserReducer,
    report: reportReducer,
    userManagement: userReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
