
import apiConfig from '@constants/apiConfig';
import DeveloperListPage from './DeveloperListPage';
import DeveloperSaveBase from './DeveloperSaveBase';
import DayoffListPage from './dayoff/DayoffListPage';
import DayOffSavePage from './dayoff/DayoffSaveBase';
export default {
    DeveloperListPage: {
        path: '/developer',
        title: 'developer',
        auth: true,
        component: DeveloperListPage,
        permission: [apiConfig.developer.getList.baseURL],
    },

    DeveloperSaveBase: {
        path: '/developer/:id',
        title: 'student save base',
        auth: true,
        component: DeveloperSaveBase,
        permission: [apiConfig.developer.create.baseURL, apiConfig.developer.update.baseURL],
    },
    DayoffListPage: {
        path: '/developer/day-off-log',
        title: 'Developer Day Off Page',
        auth: true,
        component: DayoffListPage,
        permissions: [apiConfig.dayOff.getList.baseURL],
    },
    DayOffSavePage: {
        path: '/developer/day-off-log/:id',
        title: 'Developer Day Off Save Page',
        auth: true,
        component: DayOffSavePage,
        permissions: [apiConfig.dayOff.create.baseURL, apiConfig.dayOff.update.baseURL],
    },
};