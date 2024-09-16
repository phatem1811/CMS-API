import StudentListPage from "./StudentListPage";
import apiConfig from '@constants/apiConfig';
import StudentSaveBase from "./StudentSaveBase";
import CourseStudent from './course/CourseStudent';

export default {
    StudentListPage: {
        path: '/student',
        title: 'student',
        auth: true,
        component: StudentListPage,
        permission: [apiConfig.student.getList.baseURL],
    },

    StudentSaveBase: {
        path: '/student/:id',
        title: 'student save base',
        auth: true,
        component: StudentSaveBase,
        permission: [apiConfig.student.create.baseURL, apiConfig.student.update.baseURL],
    },
    CourseStudent: {
        path: '/student/course',
        title: 'Student Course Register Page',
        auth: true,
        component: CourseStudent,
        permission: [apiConfig.registration.getList.baseURL],
    },
};