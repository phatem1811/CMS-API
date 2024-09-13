import BaseTable from '@components/common/table/BaseTable';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import { Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import ListPage from '@components/common/layout/ListPage';
import { AppConstants, categoryKind, DEFAULT_FORMAT, DATE_FORMAT_DISPLAY, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import { FieldTypes } from '@constants/formConfig';


import useTranslate from '@hooks/useTranslate';

import { convertUtcToLocalTime } from '@utils';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useIntl } from 'react-intl';
import { useForm } from 'antd/es/form/Form';
import useFetch from '@hooks/useFetch';

import useDisclosure from '@hooks/useDisclosure';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useSearchParams } from 'react-router-dom';

import { DatePicker } from 'antd';
dayjs.extend(customParseFormat);
import {
    STATE_PROJECT_CREATE, STATE_PROJECT_RUNNING, STATE_PROJECT_DONE, statusOptions, stateProjectOptions, kindTaskOptions,
    STATE_PROJECT_CANCEL, STATE_PROJECT_FAILED, projectStateMessage } from '@constants/masterData';
import { size } from 'lodash';
const message = defineMessages({
    objectName: 'Dự Án',

});

const TaskTab = () => {
    const translate = useTranslate();
    const taskOptions = translate.formatKeys(kindTaskOptions, ['label'] );
    const [isOpen, { open, close }] = useDisclosure();
    const location = useLocation();
    const { pathname: pagePath } = useLocation();
    const queryString = location.search;
    const [selectedRow, setSselectedRow] = useState(null);

    const { formatMessage } = useIntl();
    const stateOptionValues = [
        { value: STATE_PROJECT_CREATE, label: formatMessage(projectStateMessage.create), color: 'yellow' },
        { value: STATE_PROJECT_RUNNING, label: formatMessage(projectStateMessage.running), color: 'blue' },
        { value: STATE_PROJECT_DONE, label: formatMessage(projectStateMessage.done), color: '#CC0000' },
        { value: STATE_PROJECT_CANCEL, label: formatMessage(projectStateMessage.cancel), color: '#CC0000' },
        { value: STATE_PROJECT_FAILED, label: 'Đang test', color: '#CC0000' },

    ];


    const queryParams = new URLSearchParams(location.search);
    const projectId = queryParams.get('projectId');

    const {
        execute: fetchAutoCompleteData,
        data: datadeveloper,
    } = useFetch(apiConfig.memberProject.autocomplete, {
        immediate: true,
        params: { projectId },
        mappingData: (response) => {

            return response.data.content.map((item) => ({
                label: item.developer.account.fullName,
                value: item.developer.id,
            }));
        },
    });

    const {
        data: category,
    } = useFetch(apiConfig.projectCategory.autocomplete, {
        immediate: true,
        params: { projectId },
        mappingData: (response) => {

            return response.data.content.map((item) => ({
                label: item.projectCategoryName,
                value: item.id,
            }));
        },
    });


    const [form] = useForm();
    const navigate = useNavigate();

    const { data, mixinFuncs, queryFilter, loading, pagination } = useListBase({
        apiConfig: apiConfig.projectTask,
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
            funcs.getItemDetailLink = (record) => {
                const id = record?.id;           
                return `/project/task/${id}${queryString}`;
            };

            funcs.getCreateLink = () => {
                return `/project/task/create${queryString}`;
            };
        },

    });

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
            title: '',
            dataIndex: 'kind',
            align: 'center',
            width: 10,
            render: (kind) => {
                const kindOption = kindTaskOptions.find(option => option.value === kind);
                return kindOption && kindOption.imageUrl ? (
                    <img src={kindOption.imageUrl} alt="Task kind" style={{ width: '20px', height: '20px' }} />
                ) : null;
            },
        },

        {
            title: <FormattedMessage defaultMessage="Task" />,
            dataIndex: 'taskName',
            width: 150,

        },
        { title: <FormattedMessage defaultMessage="Danh muc" />, dataIndex: ['projectCategoryInfo', 'projectCategoryName'] },
        { title: <FormattedMessage defaultMessage="Lập trình viên" />, dataIndex: ['developer', 'account', 'fullName'] },
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
            title: <FormattedMessage defaultMessage="Ngày kết thúc" />,
            width: 180,
            dataIndex: 'dueDate',
            align: 'right',
            render: (dueDate) => {
                const createdDateLocal = convertUtcToLocalTime(dueDate, DEFAULT_FORMAT, DEFAULT_FORMAT);
                return <div>{createdDateLocal}</div>;
            },
        },
        {
            title: <FormattedMessage defaultMessage="Thời gian" />,
            dataIndex: ['timeEstimate'],
            render: (timeEstimate) => {
                if (!timeEstimate) return null;
                
        
                const days = Math.floor(timeEstimate / (60 * 24)); 
                const hours = Math.floor((timeEstimate % (60 * 24)) / 60);
                
               
                return `${days} d${hours ? `, ${hours} h` : ''}`;
            },
        },

        mixinFuncs.renderActionColumn(
            {
                edit: true,
                delete: true,
            },
            { width: '130px' },
        ),
    ];

    const searchFields = [
        {
            key: 'developerId',
            type: FieldTypes.SELECT,
            placeholder: "Lập trình viên",
            options: datadeveloper,

        },

        {
            key: 'state',
            placeholder: 'Tình trạng',
            type: FieldTypes.SELECT,
            options: stateOptionValues,
            width: 100,
        },
        {
            key: 'categoryPeojectId',
            type: FieldTypes.SELECT,
            placeholder: "Danh mục",
            options: category,
        },
        {
            key: 'kind',
            placeholder: 'Loại',
            type: FieldTypes.SELECT,
            options: taskOptions,
        },


    ];
    const handleReset = (values) => {
        const params = new URLSearchParams(location.search);
      
        if (params.has('developerId')) {
            params.delete('developerId');
        }
        if (params.has('state')) {
            params.delete('state');
        }
        if (params.has('projectCategoryId')) {
            params.delete('projectCategoryId');
        }
        if (params.has('kind')) {
            params.delete('kind');
        }

        navigate({ search: params.toString() });
    };
    const handleSearch = (values) => {
        const params = new URLSearchParams(location.search);
        params.set('developerId', values.developerId || '');
        params.set('state', values.state || '');
        params.set('projectCategoryInfoId', values.projectCategoryInfoId || '');
        params.set('kind', values.kind || '');
        navigate({ search: params.toString() });
    };


    const handleRowClick = (record) => {
        setSselectedRow(record.description);
        open(); 
    };


    return (
        <  >
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFilter,onSearch: handleSearch, onReset: handleReset  })}
                actionBar={mixinFuncs.renderActionBar()}
                baseTable={
                    <BaseTable
                        onRow={(record) => ({
                            onClick: () => handleRowClick(record), 
                        })}
                        onChange={mixinFuncs.changePagination}
                        columns={columns}
                        dataSource={data}
                        pagination={pagination}
                    />
                }
            />
            <Modal
                title="Chi tiết task của dự án"
                open={isOpen}
                onCancel={close}
                onOk={close}
            >
                <p>Mô tả: {selectedRow}</p>
               
            </Modal>
        </>
    );
};

export default TaskTab;
