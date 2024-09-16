import PageWrapper from '@components/common/layout/PageWrapper';
import apiConfig from '@constants/apiConfig';
import useSaveBase from '@hooks/useSaveBase';
import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import routes from '../route';
import useTranslate from '@hooks/useTranslate';
import ProjectRegistrationForm from './registerForm';
import { commonMessage } from '@locales/intl';

const message = defineMessages({
    objectName: 'dự án',
});

const ProjectRegistrationSavePage = () => {
    const translate = useTranslate();
    const queryString = location.search;
    const queryParams = new URLSearchParams(location.search);
    const currentUrl = new URL(window.location.href);
    const searchParams = new URLSearchParams(currentUrl.search);
    const studentId = searchParams.get('studentId') || 'null';
    const studentName = searchParams.get('studentName') || 'null';
    const registrationId = searchParams.get('registrationId') || 'null';
    const courseId = searchParams.get('courseId') || 'null';
    const courseName = searchParams.get('courseName') || 'null';
    const courseState = searchParams.get('courseState') || 'null';
    const courseStatus = searchParams.get('courseStatus') || 'null';

    const { detail, mixinFuncs, loading, setIsChangedFormValues, isEditing, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.registrationProject.getById,
            create: apiConfig.registrationProject.create,
            update: apiConfig.registrationProject.update,
        },
        options: {
            getListUrl: routes.RegistrationProject.path,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => {
                return {
                    ...data,
                    id: detail.id,
                };
            };
            funcs.prepareCreateData = (data) => {
                return {
                    ...data,
                };
            };
        },
    });
    return (

        <PageWrapper
            
            routes={[
                { breadcrumbName: 'Học sinh', path: routes.StudentListPage.path },
                { breadcrumbName: 'Khóa học', path: `/student/course?studentId=${studentId}&studentName=${studentName}` },
                { breadcrumbName: 'Đăng kí dự án', path: `/student/registration-project${queryString}` },
                { breadcrumbName: title },
            ]}
            title={title}
        >
            <ProjectRegistrationForm
                setIsChangedFormValues={setIsChangedFormValues}
                dataDetail={detail ? detail : {}}
                formId={mixinFuncs.getFormId()}
                isEditing={isEditing}
                actions={mixinFuncs.renderActions()}
                onSubmit={mixinFuncs.onSave}
            />
        </PageWrapper>
    );
};

export default ProjectRegistrationSavePage;