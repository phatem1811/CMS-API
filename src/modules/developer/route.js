
import apiConfig from '@constants/apiConfig';
import DeveloperListPage from './DeveloperListPage';
import DeveloperSaveBase from './DeveloperSaveBase';

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
};