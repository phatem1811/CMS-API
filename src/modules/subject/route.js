import SubjectListPage from ".";
import apiConfig from '@constants/apiConfig';
import SubjectSaveBase from "./SubjectSaveBase";
import LectureListPage from "./lecture";
import LectureSaveBase from "./lecture/LectureSaveBase";
export default {
    SubjectListPage: {
        path: '/subject',
        title: 'Subject',
        auth: true,
        component: SubjectListPage,
        permissions: [apiConfig.subject.getList.baseURL],
    },
    SubjectSaveBase: {
        path: '/subject/:id',
        title: 'Subject',
        auth: true,
        component: SubjectSaveBase,
        permissions: [apiConfig.subject.create.baseURL, apiConfig.subject.update.baseURL],
    },
    LectureListPage: {
        path: '/subject/lecture/:id',
        title: 'Lecture Page',
        auth: true,
        component: LectureListPage,
        permissions: [apiConfig.lecture.getList.baseURL],
    },
    LectureSaveBase: {
        path: '/subject/lecture/:subjectId/:id',
        title: 'Lecture Save Page',
        auth: true,
        component: LectureSaveBase,
        permissions: [apiConfig.lecture.create.baseURL, apiConfig.lecture.update.baseURL],
    },
};