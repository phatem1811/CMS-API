import ProjectListPage from ".";
import apiConfig from '@constants/apiConfig';
import ProjectSaveBase from "./projectSaveBase";
import ProjectDetailListPage from "./detail/index";
import StorySaveBase from "./detail/StorySaveBase";
import MemberSaveBase from "./detail/MemberSaveBase";
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
        keyActiveTab: 'activeTab',
    },
    StorySaveBase: {
        path: '/story/task/:id',
        title: 'Project Story SavePage',
        auth: true,
        component: StorySaveBase,
        permission: [apiConfig.story.create.baseURL, apiConfig.story.update.baseURL],
    },
    MemberSaveBase: {
        path: '/project/member/:id',
        title: 'Project Member SavePage',
        auth: true,
        component: MemberSaveBase,
        permission: [apiConfig.memberProject.create.baseURL, apiConfig.memberProject.update.baseURL],
    },
};
