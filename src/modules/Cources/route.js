import apiConfig from '@constants/apiConfig';
import CourseListPage from './index';
import CoursesSaveBase from './CoursesSaveBase';
import TaskListPage from './task';
import TaskSaveBase from './task/TaskSaveBase';
import CreateTask from './task/CreateTask';
export default {
    CourseListPage: {
        path: '/course',
        title: 'courses',
        auth: true,
        component: CourseListPage,
        permission: [apiConfig.courses.getList.baseURL],
    },
    CoursesSaveBase: {
        path: '/course/:id',
        title: 'courses Save Page',
        auth: true,
        component: CoursesSaveBase,
        separateCheck: true,
        permission: [apiConfig.courses.create.baseURL, apiConfig.courses.update.baseURL],
    },
    TaskListPage: {
        path: '/course/task',
        title: 'Task List Page',
        auth: true,
        component: TaskListPage,
        separateCheck: true,
        permission: [apiConfig.task.getList.baseURL,apiConfig.task.update.baseURL, apiConfig.task.delete.baseURL],
    },

    TaskSaveBase: {
        path: '/course/task/:id',
        title: 'Task Save Page',
        auth: true,
        component: TaskSaveBase,
        separateCheck: true,
        permission: [apiConfig.task.update.baseURL, apiConfig.task.delete.baseURL],
    },

    CreateTask: {
        path: '/course/task/lecture',
        title: 'Create Task',
        auth: true,
        component: CreateTask,
        separateCheck: true,
        permission: [apiConfig.task.asignAll.baseURL, apiConfig.lecture.getBySubject.baseURL],
    },


};
