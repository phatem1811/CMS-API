import ProjectListPage from ".";
import apiConfig from '@constants/apiConfig';
import ProjectSaveBase from "./projectSaveBase";

export default {
    ProjectListPage: {
        path: '/project',
        title: 'Project List Page',
        auth: true,
        component: ProjectListPage,
        permission: [apiConfig.project.getList.baseURL],
    },

    ProjectSaveBase: {
        path: '/project/:id',
        title: 'Project List Page',
        auth: true,
        component: ProjectSaveBase,
        permission: [apiConfig.project.create.baseURL, apiConfig.project.update.baseURL],
    },
};