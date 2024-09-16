import apiConfig from '@constants/apiConfig';
import StoryTabs from '.';
import TaskStorySaveBase from './task/TaskStorySaveBase';
import TestPlanSaveBase from './testplan/TestPlanSaveBase';
import SummaryBug from './SummaryBug';

export default {
    StoryTabs: {
        path: '/project/task',
        title: 'Task in story',
        auth: true,
        component: StoryTabs,
        permission: [apiConfig.projectTask.getList.baseURL],
        keyActiveTab: 'activeTab',
    },

    TaskStorySaveBase: {
        path: '/project/task/:id',
        title: 'Task Save Base in story',
        auth: true,
        component: TaskStorySaveBase,
        permission: [apiConfig.projectTask.create.baseURL, apiConfig.projectTask.update.baseURL],
    },
    
    TestPlanSaveBase: {
        path: '/project/test-plan/:id',
        title: 'Task Save Base in story',
        auth: true,
        component: TestPlanSaveBase,
        permission: [apiConfig.testPlan.create.baseURL, apiConfig.testPlan.update.baseURL],
    },
    SummaryBug: {
        path: '/project/task/summary-bug',
        title: 'summary-bug',
        auth: true,
        component: SummaryBug,
        permission: [apiConfig.testPlan.summaryBug.baseURL],
        keyActiveTab: 'activeTab',
    },
};