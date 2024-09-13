import PageWrapper from '@components/common/layout/PageWrapper';
import { categoryKind } from '@constants';
import apiConfig from '@constants/apiConfig';
import useFetch from '@hooks/useFetch';
import useSaveBase from '@hooks/useSaveBase';
import React, { useEffect } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import TestPlanForm from './TestPlanForm';
import routes from '../route';
import useTranslate from '@hooks/useTranslate';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import route from '@modules/project/route';
const message = defineMessages({
    objectName: 'Test plan',
});

const TestPlanSaveBase = () => {
    const translate = useTranslate();
    const location = useLocation();
    const queryString = location.search;
    const queryParams = new URLSearchParams(location.search);
    const projectName = queryParams.get('projectName');
    const projectId = queryParams.get('projectId');
    const storyName = queryParams.get('storyName');
    const storyId = queryParams.get('storyId');
    const { detail, mixinFuncs, loading, setIsChangedFormValues, isEditing, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.testPlan.getById,
            create: apiConfig.testPlan.create,
            update: apiConfig.testPlan.update,
        },
        options: {
            getListUrl: routes.StoryTabs.path,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => {
                return {
                    ...data,
                    id: detail.id,
                };
            };

        },
    });

    return (
        <PageWrapper

            routes={[
                { breadcrumbName: 'Dự án', path : route.ProjectListPage.path },
                {
                    breadcrumbName: projectName,
                    path: `/project/project-tab?projectId=${projectId}&projectName=${projectName}&active=true`,
                },
                {
                    breadcrumbName: `Story (${storyName})`,
                    path: `/project/task?projectId=${projectId}&storyId=${storyId}&storyName=${storyName}&active=true&projectName=${projectName}`,
                },
                { breadcrumbName: title },
            ]}
            title={title}
        >
            <TestPlanForm
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

export default TestPlanSaveBase;
