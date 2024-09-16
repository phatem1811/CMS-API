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
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { convertUtcToLocalTime } from '@utils';
import { defineMessages, FormattedMessage } from 'react-intl';
import { UserOutl, ContainerOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
const message = defineMessages({
    objectName: 'Học sinh',
});

const StudentListPage = () => {
    const translate = useTranslate();
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const navigate = useNavigate();

    const { data, mixinFuncs, queryFilter, loading, pagination } = useListBase({
        apiConfig: apiConfig.student,
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
                    registration: (record) => {
                        const { id, account } = record;
                        const fullName = account?.fullName;
                        
                        return (
                            <Button
                                type="link"
                                style={{ padding: 0 }}
                                onClick={() => {
                                    navigate(`/student/course?studentId=${id}&studentName=${encodeURIComponent(fullName)}` );
                                }}
                            >
                                <ContainerOutlined />
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
            dataIndex: 'index',
            align: 'center',
            width: 40,
            render: (text, record, index) => {
                const { current, pageSize } = pagination;
                return (current - 1) * pageSize + index + 1;
            },
        },
        {
            title: '#',
            dataIndex: ['account', 'avatar'],
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
        { title: <FormattedMessage defaultMessage="Họ và Tên" />, dataIndex: ['account', 'fullName'] },
        {
            title: <FormattedMessage defaultMessage="Ngày sinh" />,
            width: 180,
            dataIndex: ['account', 'birthday'],
            align: 'right',
            render: (birthday) => {
                const createdDateLocal = convertUtcToLocalTime(birthday, DEFAULT_FORMAT, DEFAULT_FORMAT);
                return <div>{createdDateLocal}</div>;
            },
        },
        { title: <FormattedMessage defaultMessage="Số điện thoại" />, dataIndex: ['account', 'phone'] },
        { title: <FormattedMessage defaultMessage="Email" />, dataIndex: ['account', 'email'] },
        { title: <FormattedMessage defaultMessage="Trường" />, dataIndex: ['university', 'categoryName'] },
        { title: <FormattedMessage defaultMessage="Hệ" />, dataIndex: ['studyClass', 'categoryName'] },

        mixinFuncs.renderStatusColumn({ width: '90px' }),
        mixinFuncs.renderActionColumn(
            {
                registration: mixinFuncs.hasPermission([apiConfig.registration.getById.baseURL]),
                edit: true,
                delete: true,
            },
            { width: '130px', fixed: 'right' },
        ),
    ];

    const searchFields = [
        {
            key: 'fullName',
            placeholder: 'Họ và Tên',
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
                        scroll={{ x: 'max-content' }}
                    />
                }
            />

        </PageWrapper>
    );
};

export default StudentListPage;
