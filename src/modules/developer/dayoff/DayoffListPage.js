import BaseTable from '@components/common/table/BaseTable';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import { Button, Modal, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import { AppConstants, categoryKind, DEFAULT_FORMAT, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import { statusOptions } from '@constants/masterData';
import useTranslate from '@hooks/useTranslate';
import { convertUtcToLocalTime } from '@utils';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import DatePickerField from '@components/common/form/DatePickerField';
import routes from '../route';
const message = defineMessages({
    objectName: 'course',
});

const DayoffListPage = () => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const location = useLocation();
    const { pathname: pagePath } = useLocation();
    const queryString = location.search;

    const { data, mixinFuncs, queryFilter, loading, pagination } = useListBase({
        apiConfig: apiConfig.dayOff,
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(message.objectName),
        },
        override: (funcs) => {
            funcs.mappingData = (response) => {
                if (response.result === true) {
                    return {
                        data: response.data.content,
                    };
                }
            };
         
        },
    });
    const columns = [
        {
            title: <FormattedMessage defaultMessage="Ngày bắt đầu" />,
            width: 200,
            dataIndex: 'startDate',
            align: 'left',
            render: (createdDate) => {
                const createdDateLocal = convertUtcToLocalTime(createdDate, DEFAULT_FORMAT, DEFAULT_FORMAT);
                return <div>{createdDateLocal}</div>;
            },
        },
        {
            title: <FormattedMessage defaultMessage="Ngày kết thúc" />,
            width: 200,
            dataIndex: 'endDate',
            align: 'left',
            render: (createdDate) => {
                const createdDateLocal = convertUtcToLocalTime(createdDate, DEFAULT_FORMAT, DEFAULT_FORMAT);
                return <div>{createdDateLocal}</div>;
            },
        },
        {
            title: <FormattedMessage defaultMessage="Tổng thời gian" />,
            dataIndex: 'totalHour',
            align: 'center',
        },
        {
            title: <FormattedMessage defaultMessage="Lý do" />,
            dataIndex: 'note',
            align: 'center',
        },

        {
            title: <FormattedMessage defaultMessage="Loại" />,
            dataIndex: 'isCharged',
            align: 'center',
            render: (isCharged) => {
                if (isCharged) {
                    return <Tag color="red">Trừ tiền</Tag>;
                } else {
                    return <Tag color="green">Không trừ tiền</Tag>;
                }
            },
        },
        mixinFuncs.renderActionColumn(
            {
                edit: true,
                delete: true,
            },
            { width: '180px' },
        ),
    ];

    const searchFields = [
        {
            key: 'startDate',
            placeholder: 'Từ ngày',
            component: DatePickerField,
            componentProps: {
                format: DEFAULT_FORMAT,
                showTime: true,

            },
        },
        {
            key: 'endDate',
            placeholder: 'Tới ngày',
            component: DatePickerField,
            componentProps: {
                format: DEFAULT_FORMAT,
                showTime: true,
            },
        },
    ];

    return (
        <PageWrapper routes={[{ breadcrumbName: 'Lập trình viên', path: routes.DeveloperListPage.path }, { breadcrumbName: 'Đăng ký ngày nghỉ' }]}>
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

export default DayoffListPage;