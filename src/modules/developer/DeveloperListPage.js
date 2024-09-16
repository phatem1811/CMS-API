import BaseTable from '@components/common/table/BaseTable';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import { Tooltip  } from 'antd';
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
import DatePickerField from '@components/common/form/DatePickerField';
import { convertUtcToLocalTime } from '@utils';
import { defineMessages, FormattedMessage } from 'react-intl';
import { FieldTimeOutlined , BulbOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';

const message = defineMessages({
    objectName: 'Lập trình viên',

});

const DeveloperListPage = () => {
    const translate = useTranslate();
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const navigate = useNavigate();

    const { data, mixinFuncs, queryFilter, loading, pagination } = useListBase({
        apiConfig: apiConfig.developer,
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
                    dayOff: (record) => {
                        const { id, accountDto } = record;
                        const fullName = accountDto?.fullName;
                        console.log("check name", fullName);
                        return (
                            <Button
                                type="link"
                                style={{ padding: 0 }}
                                onClick={() => {
                                    navigate(
                                        `/developer/day-off-log?developerId=${id}&developerName=${encodeURIComponent(fullName)}`,
                                    );
                                }}
                            >
                                <FieldTimeOutlined />
                            </Button>
                        );
                    },

                    project: (record) => {
                       
                        const { id, name } = record;
                        return (
                            <Button
                                type="link"
                                style={{ padding: 0 }}
                                onClick={() => {
                                    navigate(
                                        `/developer/project?developerId=${id}&developerName=${encodeURIComponent(name)}`,
                                    );
                                }}
                            >
                                <BulbOutlined />
                            </Button>
                        );
                    },
                };
            };
        },
        
    });

    const formatMoney = (amount) => {
        return `${amount.toFixed(0)} $`;
    };

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
            dataIndex: ['accountDto', 'avatar'],
            align: 'center',
            width: 70,
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
            dataIndex: ['accountDto', 'fullName'], 
        },
        {
            title: <FormattedMessage defaultMessage="Vai trò" />,
            dataIndex: ['developerRole', 'categoryName'],
        },
        {
            title: <FormattedMessage defaultMessage="Lương cứng" />,
            dataIndex: 'salary',
            align: 'right',
            render: (fee) => formatMoney(fee),
        },
        {
            title: <FormattedMessage defaultMessage="Lương theo giờ	" />,
            dataIndex: 'hourlySalary',
            align: 'right',
            render: (fee) => formatMoney(fee),
        },
        {
            title: <FormattedMessage defaultMessage="Số điện thoại" />,
            dataIndex: ['accountDto', 'phone'],
            width: 200,
            align: 'center',
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

        mixinFuncs.renderStatusColumn({ width: '90px' }),
        mixinFuncs.renderActionColumn(
            {
                project : mixinFuncs.hasPermission([apiConfig.project.getList.baseURL]),
                dayOff : mixinFuncs.hasPermission([apiConfig.dayOff.getList.baseURL]),
                edit: true,
                delete: true,
            },
            { width: '150px', fixed: 'right' },
        ),
    ];

    const searchFields = [
        {
            key: 'name',
            placeholder: translate.formatMessage(message.objectName),
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

export default DeveloperListPage;
