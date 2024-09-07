import BaseTable from '@components/common/table/BaseTable';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import { Button, Modal, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { UserOutlined } from '@ant-design/icons';
import AvatarField from '@components/common/form/AvatarField';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import { AppConstants, categoryKind, DEFAULT_FORMAT, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import { FieldTypes } from '@constants/formConfig';
import { statusOptions } from '@constants/masterData';
import useFetch from '@hooks/useFetch';
import useNotification from '@hooks/useNotification';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { convertUtcToLocalTime } from '@utils';
import { defineMessages, FormattedMessage } from 'react-intl';
import { formatMoney } from '@utils/formatMoney';
import { useNavigate, useLocation } from "react-router-dom";
import { BookOutlined } from '@ant-design/icons';
const message = defineMessages({
    objectName: 'Khóa học',
    fee: 'Học phí',
    dateEnd: 'Ngày kêt thúc',
    subject: "Tên Môn học",
});

const CourseListPage = () => {
    const translate = useTranslate();
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    

    const location = useLocation();
    
    const navigate = useNavigate();

    console.log("checklocation", location.pathname);
    const { data, mixinFuncs, queryFilter, loading, pagination } = useListBase({
        apiConfig: apiConfig.courses,
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.mappingData = (response) => {
                if (response.result === true) {
                    return {
                        data: response.data.content,
                        total: response.data.totalElements,
                    };
                }
            };
            funcs.additionalActionColumnButtons = () => {
                
                return {
                    task: ({ id, name, state, status, subject }) => {
                        const subjectId = subject?.id || null; 
                     
                        return (
                            <Button
                                type="link"
                                style={{ padding: 0 }}
                                onClick={() => {
                                    navigate(
                                        `/course/task?courseId=${id}&courseName=${encodeURIComponent(
                                            name,
                                        )}&subjectId=${subjectId}&state=${state}&courseStatus=${status}`, { state: { courseName: message.objectName, path: location.pathname } },
                                    );
                                }}
                            >
                                < BookOutlined />
                            </Button>
                        );
                    },
                };
            };

        },


    });
   


    const columns = [
        {
            title: '#',
            dataIndex: 'avatar',
            align: 'center',
            width: 100,
            render: (avatar) => (
                <AvatarField
                    size="large"
                    icon={<UserOutlined />}
                    src={avatar ? `${AppConstants.contentRootUrl}${avatar}` : null}
                />
            ),
        },
        { title: <FormattedMessage defaultMessage="Tên khóa học" />, dataIndex: 'name' },
        {
            title: <FormattedMessage defaultMessage="Tên Môn Học" />, dataIndex: ['subject', 'subjectName'],
        },
        {
            title: <FormattedMessage defaultMessage="Học phí" />,
            dataIndex: 'fee',
            render: (fee) => formatMoney(fee),
        },
        {
            title: <FormattedMessage defaultMessage="Ngày Kết Thúc" />,
            width: 180,
            dataIndex: 'dateEnd',
            render: (dateEnd) => {
                const createdDateLocal = convertUtcToLocalTime(dateEnd, DEFAULT_FORMAT, DEFAULT_FORMAT);
                return <div>{createdDateLocal}</div>;
            },
        },

        mixinFuncs.renderStatusColumn({ width: '90px' }),
        mixinFuncs.renderActionColumn(
            {
                task: mixinFuncs.hasPermission([apiConfig.task.getList.baseURL]),
                edit: true,
                delete: true,
            },
            { width: '130px' },
        ),
    ];

    const searchFields = [
        {
            key: 'Tên khóa học',
            placeholder: translate.formatMessage(commonMessage.Name),
        },

        {
            key: 'status',
            placeholder: translate.formatMessage(commonMessage.status),
            type: FieldTypes.SELECT,
            options: statusValues,
        },
    ];


    return (
        <PageWrapper routes={[{ breadcrumbName: translate.formatMessage(message.objectName) }]}   >
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFilter })}
                actionBar={mixinFuncs.renderActionBar()}
                baseTable={
                    <BaseTable
                        onChange={mixinFuncs.changePagination}
                        columns={columns}
                        dataSource={data}
                        pagination={pagination}
                    />
                }
            />

        </PageWrapper>
    );
};

export default CourseListPage;
