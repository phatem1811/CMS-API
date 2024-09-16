import StudentListPage from "./StudentListPage";
import apiConfig from '@constants/apiConfig';
import StudentSaveBase from "./StudentSaveBase";
import CourseStudent from './course/CourseStudent';
import RegistrationProject from "./course/registrationProject";
import ProjectRegistrationSavePage from "./course/registerSaveBase";
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
    RegistrationProject: {
        path: '/student/registration-project',
        title: 'RegistrationProject Project Register Page',
        auth: true,
        component: RegistrationProject,
        permission: [apiConfig.registrationProject.getList.baseURL],
    },
    ProjectRegisterSavePage: {
        path: '/student/registration-project/:id',
        title: 'Student Project Register Page',
        auth: true,
        component: ProjectRegistrationSavePage,
        permission: [apiConfig.registrationProject.create.baseURL, apiConfig.registrationProject.update.baseURL],
    },
};