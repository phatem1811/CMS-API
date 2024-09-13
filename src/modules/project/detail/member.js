import BaseTable from '@components/common/table/BaseTable';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import { Button, Modal, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { UserOutlined } from '@ant-design/icons';
import AvatarField from '@components/common/form/AvatarField';
import ListPage from '@components/common/layout/ListPage';
import { AppConstants, categoryKind, DEFAULT_FORMAT, DATE_FORMAT_DISPLAY, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import useTranslate from '@hooks/useTranslate';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useIntl } from 'react-intl';
import { useForm } from 'antd/es/form/Form';
import useFetch from '@hooks/useFetch';
import useDisclosure from '@hooks/useDisclosure';
import moment from 'moment';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useSearchParams } from 'react-router-dom';
import { Tooltip } from 'antd';
// import routes from './route';

import { DatePicker } from 'antd';
dayjs.extend(customParseFormat);
import {
    STATE_PROJECT_CREATE, STATE_PROJECT_RUNNING, STATE_PROJECT_DONE, statusOptions,
    STATE_PROJECT_CANCEL, STATE_PROJECT_FAILED, projectStateMessage } from '@constants/masterData';
import { size } from 'lodash';
const message = defineMessages({
    objectName: 'Dự Án',

});

const MemberListPage = () => {
    const translate = useTranslate();
    const statusValues = translate.formatKeys(statusOptions, ['label']);
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



    console.log("check projectId", datadeveloper);

    const [form] = useForm();
    const navigate = useNavigate();
    const { formatMessage } = useIntl();
    const stateOptionValues = [
        { value: STATE_PROJECT_CREATE, label: formatMessage(projectStateMessage.create) },
        { value: STATE_PROJECT_RUNNING, label: formatMessage(projectStateMessage.running) },
        { value: STATE_PROJECT_DONE, label: formatMessage(projectStateMessage.done) },
        { value: STATE_PROJECT_CANCEL, label: formatMessage(projectStateMessage.cancel) },

    ];

    const { data, mixinFuncs, queryFilter, loading, pagination } = useListBase({
        apiConfig: apiConfig.memberProject,
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

                return `/project/member/${id}${queryString}`;
            };

            funcs.getCreateLink = () => {

                const searchParams = new URLSearchParams(window.location.search);
                return `/project/member/create${queryString}`;
            };



        },


    });


    const columns = [

        {
            title: '#',
            dataIndex: ['developer','accountDto','avatar'],
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

        {
            title: <FormattedMessage defaultMessage="Họ và tên" />,
            dataIndex: ['developer', 'accountDto', 'fullName'],
            width: 250,
        },
        {
            title: <FormattedMessage defaultMessage="Vai trò" />,
            dataIndex: ['projectRole', 'projectRoleName'],
            width: 200,
        },
        {
            title: <FormattedMessage defaultMessage="Trả lương" />,
            width: 100,
            dataIndex: 'isPaid',
            align: 'center',
            render: (isPaid) => {
                return isPaid ? (
                    <Tag color="green">
                        <FormattedMessage defaultMessage="Có trả lương" />
                    </Tag>
                ) : (
                    <Tag color="yellow">
                        <FormattedMessage defaultMessage="Không trả lương" />
                    </Tag>
                );
            },
        },
        {
            title: 'Lịch trình',
            dataIndex: 'schedule',
            render: (scheduleData) => {
                let parsedSchedule = {};
                try {
                    parsedSchedule = JSON.parse(scheduleData);
                } catch (e) {
                    console.error('Error parsing schedule data:', e);
                    return null;
                }

                const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
                const dayMap = {
                    t2: 0,
                    t3: 1,
                    t4: 2,
                    t5: 3,
                    t6: 4,
                    t7: 5,
                    cn: 6,
                };

                return (
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        {daysOfWeek.map((day, index) => {
                            const isToday = index === (new Date().getDay() + 6) % 7;
                            const dayKey = Object.keys(dayMap).find((key) => dayMap[key] === index);
                            const hasSchedule = dayKey && parsedSchedule[dayKey];
                            const scheduleTime = hasSchedule ? parsedSchedule[dayKey] : null;
                            const borderColor = isToday ? (hasSchedule ? 'blue' : 'red') : 'black';

                            return (
                                <Tooltip key={index} title={scheduleTime || 'No schedule'} placement="top">
                                    <div
                                        key={index}
                                        style={{
                                            width: '20px',
                                            height: '20px',
                                            border: `1px solid ${borderColor}`,
                                            color: borderColor,                     
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxSizing: 'border-box',
                                            cursor: 'pointer',
                                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                        }}
                                    >
                                        {hasSchedule ? daysOfWeek[index] : ''}
                                    </div>
                                </Tooltip>
                            );
                        })}
                    </div>
                );
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

    return (
        <  >
            <ListPage title={'Conference and Event Management System'}
             
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

export default MemberListPage;
