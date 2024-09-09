import ProjectListPage from ".";
import apiConfig from '@constants/apiConfig';
import ProjectSaveBase from "./projectSaveBase";
import ProjectDetailListPage from "./detail/index";
import StorySaveBase from "./detail/StorySaveBase";
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
    ProjectDetailListPage: {
        path: '/project/project-tab',
        title: 'ProjectDetail List Page',
        auth: true,
        component: ProjectDetailListPage,
        permission: [apiConfig.project.create.baseURL, apiConfig.project.update.baseURL],
    },
    StorySaveBase: {
        path: '/story/task/:id',
        title: 'Project List Page',
        auth: true,
        component: StorySaveBase,
        permission: [apiConfig.story.create.baseURL, apiConfig.story.update.baseURL],
    },
};
