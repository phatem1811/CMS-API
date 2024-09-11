import PageWrapper from '@components/common/layout/PageWrapper';
import { categoryKind } from '@constants';
import apiConfig from '@constants/apiConfig';
import useFetch from '@hooks/useFetch';
import useSaveBase from '@hooks/useSaveBase';
import React, { useEffect } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import routes from '../route';
import useTranslate from '@hooks/useTranslate';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import LectureForm from './LectureForm';
import { generatePath, useParams } from 'react-router-dom';

const message = defineMessages({
    objectName: 'Bài Giảng',
});

const LectureSaveBase = () => {
    const translate = useTranslate();
    const location = useLocation();
    const { subjectId: subjectId } = useParams();
    const { detail, mixinFuncs, loading, setIsChangedFormValues, isEditing, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.lecture.getById,
            create: apiConfig.lecture.create,
            update: apiConfig.lecture.update,
        },
        options: {
            getListUrl: generatePath(routes.LectureListPage.path, { id: subjectId }),
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
                { breadcrumbName: <FormattedMessage defaultMessage="Môn học" />, path: routes.SubjectListPage.path },
                {
                    breadcrumbName: <FormattedMessage defaultMessage="Bài Giảng" />,
                    path: generatePath(routes.LectureListPage.path, { id: subjectId }),
                },
                { breadcrumbName: title },
            ]}
            title={title}
        >
            <LectureForm
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

export default LectureSaveBase;
