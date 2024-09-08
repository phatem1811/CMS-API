import BaseTable from '@components/common/table/BaseTable';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import { Button, Modal, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { UserOutlined } from '@ant-design/icons';
import AvatarField from '@components/common/form/AvatarField';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import { AppConstants, categoryKind, DEFAULT_FORMAT,DATE_FORMAT_DISPLAY, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
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
import useFetch from '@hooks/useFetch';
import useNotification from '@hooks/useNotification';
import useDisclosure from '@hooks/useDisclosure';
import moment from 'moment';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import routes from './route';

import { DatePicker } from 'antd';
dayjs.extend(customParseFormat);
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
    const notification = useNotification();
    const stateOptionValues = [
        { value: STATE_PROJECT_CREATE, label: formatMessage(projectStateMessage.create) },
        { value: STATE_PROJECT_RUNNING, label: formatMessage(projectStateMessage.running) },
        { value: STATE_PROJECT_DONE, label: formatMessage(projectStateMessage.done) },
        { value: STATE_PROJECT_CANCEL, label: formatMessage(projectStateMessage.cancel) },
        { value: STATE_PROJECT_FAILED, label: formatMessage(projectStateMessage.failed) },

    ];
    const [form] = useForm();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [salaryResisterId, setSalaryResisterId] = useState(null);
    const [projectId, setProjectId] = useState();
   
    const [selectedDate, setSelectedDate] = useState(null);

    const { loading: fetchingDate, execute: fetchSalaryPeriodDate } = useFetch(apiConfig.registerSalary.registerSalaryPeriodById,
        {
            immediate: false,
            mappingData: ({ data }) => data.dueDate,
        },
    );

    const { execute: registerSalary  } = useFetch(apiConfig.registerSalary.create,
        {
            immediate: false,
        },
    );
    const { execute: updateRegisterSalary  } = useFetch(apiConfig.registerSalary.update,
        {
            immediate: false,
        },
    );
    const handleSubmit = async (values) => {
        values.dueDate = formatDateString(values.dueDate, DEFAULT_FORMAT);
        if(!isEditing)
        {
            const dataCreate = {
                ...values, projectId,            
            };
            try {
                await registerSalary({
                    method: 'POST',
                    data: dataCreate,
                    onCompleted: (response) => {      
                              
                        navigate( `/project`);
                        // navigate(  routes.ProjectListPage.path);
                    },
                    onError: (error) => {
                        console.error('Error creating task:', error);
                    },
                });
            } catch (error) {
                console.error('Error saving task:', error);
            }
        }
        else
        {
            const dataUpdate = {
                ...values,  
                id: salaryResisterId ,        
            };
            try {
                await updateRegisterSalary({
                    method: 'PUT',
                    data: dataUpdate,
                    onCompleted: (response) => {

                        return  `/project`;

                        // navigate(  routes.ProjectListPage.path);
    
                    },
                    onError: (error) => {
                        console.error('Error creating task:', error);
                    },
                });
            } catch (error) {
                console.error('Error saving task:', error);
            }
        }

    };

    const handleIconClick = async (id,duedate, registerSalaryId) => {
        duedate != null ? setIsEditing(true) : setIsEditing(false);
        registerSalaryId != null ? setSalaryResisterId(registerSalaryId) : null;
        
        setProjectId(id);
        try {
            const result = await fetchSalaryPeriodDate({
                pathParams: { projectId: id },
                onCompleted: (data) => {
                    if (data.data ) {
                     
                        setSelectedDate(dayjs(data.data, DATE_FORMAT_DISPLAY));

                    } else {

                        setSelectedDate(null);
                    }
                    open();
                },
                onError: (error) => {
                    notification({
                        type: 'error',
                        title: 'Error',
                        message: error.message || 'Failed to fetch salary period date.',
                    });
                },
            });
            if (duedate) {
                form.setFieldsValue({
                    dueDate : dayjs(duedate, DATE_FORMAT_DISPLAY),
    
                });
            } else {
                form.resetFields(); 
            }
        } catch (error) {
            console.error('Failed to fetch salary period date:', error.message);
        }
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
                    salary: ({ id, isRegisteredSalaryPeriod, registerSalaryPeriod }) => {
                   
                        const duedate = isRegisteredSalaryPeriod ? registerSalaryPeriod.dueDate : null;
                        const registerSalaryId = isRegisteredSalaryPeriod ? registerSalaryPeriod.id : null;
                        
                        return (
                            <BaseTooltip title={isRegisteredSalaryPeriod ? "Cập nhật kì lương" : "Đăng kí kì lương"}>
                                <Button
                                    type="link"
                                    style={{ padding: 0 }}
                                    onClick={() => handleIconClick(id,duedate, registerSalaryId)}
                                >
                                    <DollarTwoTone
                                        twoToneColor={isRegisteredSalaryPeriod ? "gray" : "blue"}
                                    />
                                </Button>
                            </BaseTooltip>
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
                title={isEditing ? "Cập nhật tính lương dự án" : "Đăng ký tính lương dự án"}
                open={isOpen}
                onCancel={close}
                footer={null}
            >
                <BaseForm
                    onFinish={handleSubmit}
                    form={form}
                    style={{ margin: 0 }}
                >
                    <DatePickerField
                        name="dueDate"
                        label={<FormattedMessage defaultMessage="Ngày kết thúc" />}

                        format={DATE_FORMAT_DISPLAY}
                        
                        disabledDate={(current) => current && current <= selectedDate.startOf('day')}
                        // disabledDate={(current) => current && current < selectedDate.startOf('day')}
                        style={{ width: '100%' }}
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng chọn kết thúc',
                            },
                        ]}


                    />
                    <Button type="primary" htmlType="submit">
                        {isEditing ? "Cập nhật" : "Đăng ký"} {/* Nút thay đổi nội dung dựa trên selectedDueDate */}
                    </Button>

                </BaseForm>


            </Modal>



         

        </PageWrapper>
    );
};

export default ProjectListPage;
