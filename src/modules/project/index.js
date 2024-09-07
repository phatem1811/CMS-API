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
import DatePickerField from '@components/common/form/DatePickerField';
import { BaseForm } from '@components/common/form/BaseForm';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { convertUtcToLocalTime } from '@utils';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useNavigate, useLocation } from "react-router-dom";
import { DollarTwoTone } from '@ant-design/icons';
import { formatDateString } from '@utils/index';
import { useIntl } from 'react-intl';
import { useForm } from 'antd/es/form/Form';
import useDisclosure from '@hooks/useDisclosure';
import {
    STATE_PROJECT_CREATE, STATE_PROJECT_RUNNING, STATE_PROJECT_DONE, statusOptions,
    STATE_PROJECT_CANCEL, STATE_PROJECT_FAILED, projectStateMessage } from '@constants/masterData';
const message = defineMessages({
    objectName: 'Dự Án',

});

const ProjectListPage = () => {
    const translate = useTranslate();
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const [isOpen, { open, close }] = useDisclosure();
    const { formatMessage } = useIntl();
    const stateOptionValues = [
        { value: STATE_PROJECT_CREATE, label: formatMessage(projectStateMessage.create) },
        { value: STATE_PROJECT_RUNNING, label: formatMessage(projectStateMessage.running) },
        { value: STATE_PROJECT_DONE, label: formatMessage(projectStateMessage.done) },
        { value: STATE_PROJECT_CANCEL, label: formatMessage(projectStateMessage.cancel) },
        { value: STATE_PROJECT_FAILED, label: formatMessage(projectStateMessage.failed) },

    ];
    const [form] = useForm();
    const handleOpenModal = (project) => {

        open();
    };


    const { data, mixinFuncs, queryFilter, loading, pagination } = useListBase({
        apiConfig: apiConfig.project,
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

                    salary: () => {
                        return (
                            <Button
                                type="link"
                                style={{ padding: 0 }}
                                onClick={ handleOpenModal }
                            >
                                < DollarTwoTone />
                            </Button>
                        );
                    },
                };
            };

        },


    });

    const handleFinish = (project) => {

        open();
    };

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
        { title: <FormattedMessage defaultMessage="Tên dự án" />, dataIndex: 'name', width: 400 },
        {
            title: <FormattedMessage defaultMessage="Ngày bắt đầu" />,
            width: 180,
            dataIndex: 'startDate',
            align: 'right',
            render: (startDate) => {
                const createdDateLocal = convertUtcToLocalTime(startDate, DEFAULT_FORMAT, DEFAULT_FORMAT);
                return <div>{createdDateLocal}</div>;
            },
        },

        {
            title: <FormattedMessage defaultMessage="Ngày Kết Thúc" />,
            width: 180,
            dataIndex: 'endDate',
            align: 'right',
            render: (endDate) => {
                const createdDateLocal = convertUtcToLocalTime(endDate, DEFAULT_FORMAT, DEFAULT_FORMAT);
                return <div>{createdDateLocal}</div>;
            },
        },
        {
            title: <FormattedMessage defaultMessage="Tình trạng" />,
            width: 180,
            dataIndex: 'state',
            render: (state) => {

                const stateOption = stateOptionValues.find(option => option.value === state);
                // 
                return stateOption ? stateOption.label : <FormattedMessage defaultMessage="Không xác định" />;
            },
        },


        mixinFuncs.renderStatusColumn({ width: '90px' }),
        mixinFuncs.renderActionColumn(
            {
                salary: mixinFuncs.hasPermission([apiConfig.task.getList.baseURL]),
                edit: true,
                delete: true,
            },
            { width: '130px' },
        ),
    ];

    const searchFields = [
        {
            key: 'Tên dự án',
            placeholder: translate.formatMessage(commonMessage.Name),
        },

        {
            key: 'state',
            placeholder: 'Tình trạng',
            type: FieldTypes.SELECT,
            options: stateOptionValues,
        },
        {
            key: 'status',
            placeholder: 'Trạng thái',
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
            <Modal
                title="Đăng ký tính lương dự án"
                open={isOpen}
                onCancel={close} // Close modal using the hook
                footer={null}
            >
                <BaseForm form={form} onFinish={handleFinish}>
                    <BaseForm.Item
                        label="Ngày kết thúc"
                        name="endDate"
                        rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc' }]}
                    >
                        <DatePickerField
                            format={DEFAULT_FORMAT}
                            style={{ width: '100%' }}
                        />
                    </BaseForm.Item>
                    <BaseForm.Item>
                        <Button type="primary" htmlType="submit">
                            Lưu
                        </Button>
                    </BaseForm.Item>
                </BaseForm>
            </Modal>

        </PageWrapper>
    );
};

export default ProjectListPage;
