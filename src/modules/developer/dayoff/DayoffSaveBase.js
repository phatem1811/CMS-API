
import PageWrapper from '@components/common/layout/PageWrapper';
import apiConfig from '@constants/apiConfig';
import useSaveBase from '@hooks/useSaveBase';
import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import routes from '../route';
import useTranslate from '@hooks/useTranslate';
import DayOffForm from './DayoffForm';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
const message = defineMessages({
    objectName: 'Ngày nghỉ',
});

const DayOffSavePage = () => {
    const translate = useTranslate();

    const location = useLocation();
    const queryString = location.search;
    const params = new URLSearchParams(location.search);
    const developerId = params.get('developerId');
    const developerName = params.get('developerName');


    const { detail, mixinFuncs, loading, setIsChangedFormValues, isEditing, title } = useSaveBase({
        apiConfig: {
            getById: apiConfig.dayOff.getById,
            create: apiConfig.dayOff.create,
            update: apiConfig.dayOff.update,
        },
        options: {
            getListUrl: routes.DayoffListPage.path,
            objectName: translate.formatMessage(message.objectName),
            initialData: { developerId, developerName },
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
            loading={loading}
            routes={[
                {
                    breadcrumbName: <FormattedMessage defaultMessage="Lập trình viên" />,
                    path: routes.DeveloperListPage.path,
                },
                {
                    breadcrumbName: 'Ngày nghỉ',
                    path: routes.DayoffListPage.path,
                },
                { breadcrumbName: title },
            ]}
            title={title}
        >
            <DayOffForm
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

export default DayOffSavePage;