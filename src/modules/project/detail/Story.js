import BaseTable from '@components/common/table/BaseTable';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import { Button, Modal, Tag } from 'antd';
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
import useNotification from '@hooks/useNotification';
import useDisclosure from '@hooks/useDisclosure';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useSearchParams } from 'react-router-dom';
// import routes from './route';

import { DatePicker } from 'antd';
dayjs.extend(customParseFormat);
import {
    STATE_PROJECT_CREATE, STATE_PROJECT_RUNNING, STATE_PROJECT_DONE, statusOptions, stateProjectOptions,
    STATE_PROJECT_CANCEL, STATE_PROJECT_FAILED, projectStateMessage } from '@constants/masterData';
import { size } from 'lodash';
const message = defineMessages({
    objectName: 'Dự Án',

});

const StoryListPage = () => {
    const translate = useTranslate();
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const stateValues = translate.formatKeys(stateProjectOptions, ['label']);
    const [isOpen, { open, close }] = useDisclosure();
    const location = useLocation();
    const { pathname: pagePath } = useLocation();
    const queryString = location.search;



    const queryParams = new URLSearchParams(location.search);
    const projectId = queryParams.get('projectId');

    const [searchParams, setSearchParams] = useSearchParams();
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


    const [form] = useForm();
    const navigate = useNavigate();
    const { formatMessage } = useIntl();
    const stateOptionValues = [
        { value: STATE_PROJECT_CREATE, label: formatMessage(projectStateMessage.create), color:'yellow' },
        { value: STATE_PROJECT_RUNNING, label: formatMessage(projectStateMessage.running) ,  color: 'blue' },
        { value: STATE_PROJECT_DONE, label: formatMessage(projectStateMessage.done), color: '#CC0000' },
        { value: STATE_PROJECT_CANCEL, label: formatMessage(projectStateMessage.cancel),  color: '#CC0000' },

    ];

    const { data, mixinFuncs, queryFilter, loading, pagination } = useListBase({
        apiConfig: apiConfig.story,
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
                const searchParams = new URLSearchParams(window.location.search);

                return `/story/task/${id}${queryString}`;
            };

            funcs.getCreateLink = () => {

                const searchParams = new URLSearchParams(window.location.search);
                return `/story/task/create${queryString}`;
            };



        },


    });


    const columns = [

        { title: <FormattedMessage defaultMessage="Tên story" />, dataIndex: 'storyName', width: 300 },
        { title: <FormattedMessage defaultMessage="Người thực hiện" />, dataIndex: ['developerInfo', 'account', 'fullName'] },

        {
            title: <FormattedMessage defaultMessage="Ngày tạo" />,
            width: 180,
            dataIndex: 'createdDate',
            align: 'right',
            render: (createdDate) => {
                const createdDateLocal = convertUtcToLocalTime(createdDate, DEFAULT_FORMAT, DEFAULT_FORMAT);
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
                if (stateOption) {
                    // Sử dụng Tag để hiển thị trạng thái
                    return (
                        <Tag color={stateOption.color || 'default'}>
                            {stateOption.label}
                        </Tag>
                    );
                }
    
                return <FormattedMessage defaultMessage="Không xác định" />;
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
    const handleSearch = (values) => {
        const params = new URLSearchParams(location.search);
        params.set('developerId', values.developerId || '');
        params.set('status', values.status || '');
        navigate({ search: params.toString() });
    };

    const handleReset = (values) => {
        const params = new URLSearchParams(location.search);
      
        if (params.has('developerId')) {
            params.delete('developerId');
        }
        if (params.has('status')) {
            params.delete('status');
        }
        navigate({ search: params.toString() });
    };




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
        },
    ];


    return (
        <  >
            <ListPage title={'Conference and Event Management System'}
                searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFilter, onSearch: handleSearch, onReset: handleReset })}
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

export default StoryListPage;
