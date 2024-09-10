import PageWrapper from '@components/common/layout/PageWrapper';
import { categoryKind } from '@constants';
import apiConfig from '@constants/apiConfig';
import useFetch from '@hooks/useFetch';
import useSaveBase from '@hooks/useSaveBase';
import React, { useEffect } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import MemberForm from "./MemberForm";
import routes from '../route';
import useTranslate from '@hooks/useTranslate';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

const message = defineMessages({
    objectName: 'Thành viên',
});

const MemberSaveBase = () => {
    const translate = useTranslate();
    const location = useLocation();
    const queryString = location.search;
    const { detail, mixinFuncs, loading, setIsChangedFormValues, isEditing, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.memberProject.getById,
            create: apiConfig.memberProject.create,
            update: apiConfig.memberProject.update,
        },
        options: {
            getListUrl: routes.ProjectDetailListPage.path,
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
                { breadcrumbName: 'Dự án', path: routes.ProjectListPage.path },
                { breadcrumbName: 'Conference and Event Management System', path: `/project/project-tab${queryString}` },
                { breadcrumbName: title },
            ]}
            title={title}
        >
            <MemberForm
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

export default MemberSaveBase;
