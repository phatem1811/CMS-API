import BaseTable from '@components/common/table/BaseTable';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import { Modal, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import ListPage from '@components/common/layout/ListPage';
import { AppConstants, categoryKind, DEFAULT_FORMAT, DATE_FORMAT_DISPLAY, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import { FieldTypes } from '@constants/formConfig';

import useTranslate from '@hooks/useTranslate';

import { convertUtcToLocalTime } from '@utils';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useForm } from 'antd/es/form/Form';
import useDisclosure from '@hooks/useDisclosure';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';



dayjs.extend(customParseFormat);

const message = defineMessages({
    objectName: 'TestPlan',

});

const TestPlanTab = () => {
    const translate = useTranslate();
    const [isOpen, { open, close }] = useDisclosure();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const projectId = queryParams.get('projectId');

    const [form] = useForm();
    const navigate = useNavigate();

    const { data, mixinFuncs, queryFilter, loading, pagination } = useListBase({
        apiConfig: apiConfig.testPlan,
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
            funcs.getItemDetailLink = (dataRow) => {
                const searchParams = new URLSearchParams(window.location.search);
                return `/project/test-plan/${dataRow.id}?${searchParams.toString()}`;
            };

            funcs.getCreateLink = () => {
                const searchParams = new URLSearchParams(window.location.search);
                return `/project/test-plan/create?${searchParams.toString()}`;
            };
        },
    });
    const handleSumaryBug = () => {
        const searchParams = new URLSearchParams(window.location.search);

        navigate(`summary-bug?${searchParams.toString()}`);
    };
    const columns = [
        {
            title: <FormattedMessage defaultMessage="STT" />,
            dataIndex: 'index',
            key: 'index',
            width: 50,
            render: (text, record, index) => {

                return (pagination.current - 1) * pagination.pageSize + index + 1;
            },
        },
        {
            title: <FormattedMessage defaultMessage="Test Plan" />,
            dataIndex: 'name',
            width: 400,
        },
        {
            title: <FormattedMessage defaultMessage="Ngày tạo" />,
            width: 300,
            dataIndex: 'createdDate',
            align: 'right',
            render: (createdDate) => {
                const createdDateLocal = convertUtcToLocalTime(createdDate, DEFAULT_FORMAT, DEFAULT_FORMAT);
                return <div>{createdDateLocal}</div>;
            },
        },
        {
            title: <FormattedMessage defaultMessage="Đạt" />,
            dataIndex: 'totalTestCasePassed',
            width: 200,
            align: 'center',
            render: (value) => value || 0,
        },
        {
            title: <FormattedMessage defaultMessage="Không đạt" />,
            dataIndex: 'totalTestCaseFailed',
            width: 200,
            align: 'center',
            render: (value) => (
                <span style={{ color: 'red' }}>
                    {value || 0}
                </span>
            ),
        },
        {
            title: <FormattedMessage defaultMessage="Tổng" />,
            dataIndex: 'totalTestCase',
            width: 200,
            align: 'center',
            render: (value) => value || 0,
        },
        {
            title: <FormattedMessage defaultMessage="Kết quả" />,
            dataIndex: 'totalTestCase',
            width: 200,
            align: 'center',
            render: (text, record) => {
                if (record.totalTestCaseFailed) {
                    return <span style={{ color: 'red' }}>X</span>;
                } else {
                    return <span style={{ color: 'grey' }}>__</span>;
                }
            },
        },
        mixinFuncs.renderStatusColumn(),
        mixinFuncs.renderActionColumn(
            {
                edit: true,
                delete: true,
            },
            { width: '130px' },
        ),
    ];
    const handleReset = (values) => {
        const params = new URLSearchParams(location.search);
      
        if (params.has('name')) {
            params.delete('name');
        }

        navigate({ search: params.toString() });
    };
    const handleSearch = (values) => {
        const params = new URLSearchParams(location.search);
        params.set('name', values.developerId || '');
 
        navigate({ search: params.toString() });
    };


    const searchFields = [
        {
            key: 'name',
            placeholder: translate.formatMessage(message.objectName),
        },
    ];

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>

                <Button type="primary" onClick={handleSumaryBug}>
                    Tổng hợp bug
                </Button>

            </div>

            <ListPage

                searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFilter,onSearch: handleSearch, onReset: handleReset })}
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

        </>
    );
};

export default TestPlanTab;
