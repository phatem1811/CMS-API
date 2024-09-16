

import { Badge, Dropdown, Space, Table } from 'antd';
import { defineMessages, FormattedMessage } from 'react-intl';
import BaseTable from '@components/common/table/BaseTable';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import { Modal, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import ListPage from '@components/common/layout/ListPage';
import { AppConstants, categoryKind, DEFAULT_FORMAT, DATE_FORMAT_DISPLAY, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import { FieldTypes } from '@constants/formConfig';
import useFetch from '@hooks/useFetch';
import useTranslate from '@hooks/useTranslate';
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useForm } from 'antd/es/form/Form';
import useDisclosure from '@hooks/useDisclosure';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { CheckCircleOutlined, LoadingOutlined, BugOutlined } from '@ant-design/icons';
import PageWrapper from '@components/common/layout/PageWrapper';
import route from '@modules/project/route';


const message = defineMessages({
    objectName: 'Tổng hợp bug',
});

dayjs.extend(customParseFormat);
const SummaryBug = () => {
    const translate = useTranslate();
    const [isOpen, { open, close }] = useDisclosure();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const projectId = queryParams.get('projectId');
    const storyId = queryParams.get('storyId');
    const projectName = queryParams.get('projectName');
    const storyName = queryParams.get('storyName');
    const [form] = useForm();

    const { data, mixinFuncs, queryFilter, loading, pagination } = useListBase({
        apiConfig: apiConfig.testPlan,
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(message.objectName),
        },

    });



    const { data: dataSummaryBug } = useFetch(apiConfig.testPlan.summaryBug, {
        params: { projectId, storyId, storyName, active: true, projectName },
        immediate: true,
        mappingData: (response) => {
            const mappedData = response.data.content.map((item, index) => ({
                key: index.toString(),
                testCaseId: item.testCaseId, // Add this to group by testCaseId
                segmentTestPlan: item.segmentTestPlan,
                testPlanName: item.testPlanName,
                testCaseName: item.testCaseName,
                developerName: item.developerName,
                shortDescriptionTestHistory: item.shortDescriptionTestHistory,
                noteTestHistory: item.noteTestHistory,
                total: item.total,
            }));
            return mappedData;
        },
    });

    // Filter unique testCaseId for main table rows
    const uniqueTestCaseData = Array.from(
        new Map((dataSummaryBug || []).map((item) => [item.testCaseId, item])).values(),
    );

    const expandedRowRender = (record) => {
        // Filter rows with the same testCaseId for the expanded content
        const groupedRows = (dataSummaryBug || []).filter((item) => item.testCaseId === record.testCaseId);

        const columns = [
            {
                key: 'icon',
                render: (text, record) => {
                    const iconStyle = { fontSize: '20px' }; // Adjust font size as needed

                    return record.shortDescriptionTestHistory
                        ? <CheckCircleOutlined style={{ ...iconStyle, color: 'green' }} /> // Green color for CheckCircleOutlined
                        : <LoadingOutlined style={{ ...iconStyle, color: 'orange' }} />; // Orange color for LoadingOutlined
                },
            },
            {
                title: 'Tên lập trình viên',
                dataIndex: 'developerName',
                key: 'developerName',
            },
            {
                title: 'Tóm tắt lỗi',
                dataIndex: 'shortDescriptionTestHistory',
                key: 'shortDescriptionTestHistory',

            },
        ];

        return <Table columns={columns} dataSource={groupedRows} pagination={false} />;
    };

    const columns = [
        {
            title: <FormattedMessage defaultMessage="STT" />,
            dataIndex: 'index',
            key: 'index',
            width: 50,
            render: (text, record, index) => {
                return index + 1;
            },
        },
        {
            title: <FormattedMessage defaultMessage="Phiên bản" />,
            dataIndex: 'segmentTestPlan',
            width: '50px',
        },
        {
            title: <FormattedMessage defaultMessage="Test Plan" />,
            dataIndex: 'testPlanName',
            width: 150,
        },
        {
            title: <FormattedMessage defaultMessage="Test case" />,
            dataIndex: 'testCaseName',
            width: 150,
        },
        mixinFuncs.renderActionColumn(
            {
                edit: true,
                delete: true,
            },
            { width: '130px' },
        ),
    ];

    return (
        <PageWrapper

            routes={[
                { breadcrumbName: 'Dự án', path: route.ProjectListPage.path },
                {
                    breadcrumbName: projectName,
                    path: `/project/project-tab?projectId=${projectId}&projectName=${projectName}&active=true`,
                },
                {
                    breadcrumbName: `Story (${storyName})`,
                    path: `/project/task?projectId=${projectId}&storyId=${storyId}&storyName=${storyName}&active=true&projectName=${projectName}`,
                },
                { breadcrumbName: translate.formatMessage(message.objectName) },
            ]}

        >
            <Table
                columns={columns}
                expandable={{
                    expandedRowRender,
                    defaultExpandedRowKeys: ['0'],
                }}
                dataSource={uniqueTestCaseData} // Use unique rows
                pagination={false}
            />
        </PageWrapper>
    );
};

export default SummaryBug;

