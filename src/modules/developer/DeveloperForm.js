import { Button, Card, Checkbox, Col, Flex, Form, Row, Space, Table, TimePicker, InputNumber } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import useBasicForm from '@hooks/useBasicForm';
import TextField from '@components/common/form/TextField';
import CropImageField from '@components/common/form/CropImageField';
import { AppConstants } from '@constants';
import useFetch from '@hooks/useFetch';
import apiConfig from '@constants/apiConfig';
import SelectField from '@components/common/form/SelectField';
import useTranslate from '@hooks/useTranslate';
import { statusOptions } from '@constants/masterData';

import { FormattedMessage } from 'react-intl';
import { BaseForm } from '@components/common/form/BaseForm';
import AutoCompleteField from '@components/common/form/AutoCompleteField';

import DatePickerField from '@components/common/form/DatePickerField';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { DATE_FORMAT_DISPLAY, DATE_FORMAT_VALUE, DEFAULT_FORMAT } from '@constants/index';
import { formatDateString } from '@utils/index';


dayjs.extend(customParseFormat);

const DAYS_OF_WEEK = [
    { key: 't2', label: 'Thứ 2' },
    { key: 't3', label: 'Thứ 3' },
    { key: 't4', label: 'Thứ 4' },
    { key: 't5', label: 'Thứ 5' },
    { key: 't6', label: 'Thứ 6' },
    { key: 't7', label: 'Thứ 7' },
    { key: 'cn', label: 'Chủ Nhật' },
];


const DeveloperForm = ({ formId, actions, dataDetail, onSubmit, setIsChangedFormValues, categories, isEditing }) => {
    const { execute: executeUpFile } = useFetch(apiConfig.file.upload);
    const [avatarUrl, setAvatarUrl] = useState(null);
    const translate = useTranslate();
    const format = 'HH:mm';
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });
    const uploadFile = (file, onSuccess, onError, setImageUrl) => {
        executeUpFile({
            data: {
                type: 'AVATAR',
                file: file,
            },
            onCompleted: (response) => {
                if (response.result === true) {
                    onSuccess();
                    setImageUrl(response.data.filePath);
                    setIsChangedFormValues(true);
                }
            },
            onError: (error) => {
                onError();
            },
        });
    };

    const [scheduleData, setScheduleData] = useState(
        DAYS_OF_WEEK.map((day) => ({
            key: day.key,
            label: day.label,
            times: [
                { startTime: null, endTime: null },
                { startTime: null, endTime: null },
                { startTime: null, endTime: null },
            ],
        })),
    );

    const handleRefresh = (record) => {
        const updatedData = scheduleData.map((item) => {
            if (item.key === record.key) {
                const clearedTimes = item.times.map(() => ({ startTime: null, endTime: null }));
                return { ...item, times: clearedTimes };
            }
            return item;
        });
        setIsChangedFormValues(true);
        setScheduleData(updatedData);
    };
    const handleApplyAll = () => {
        const setTimes = scheduleData.find((day) => day.key === 't2')?.times || [];
        const newScheduleData = scheduleData.map((item) => {
            if (['t3', 't4', 't5', 't6', 't7', 'cn'].includes(item.key)) {
                return {
                    ...item,
                    times: setTimes,
                };
            }
            return item;
        });
        setScheduleData(newScheduleData);
        setIsChangedFormValues(true);
        form.setFieldsValue({ schedule: JSON.stringify(newScheduleData) });
    };

    const handleSetTimes = (time, timeString, record, index, type) => {
        const updatedData = scheduleData.map((item) => {
            if (item.key === record.key) {
                const updatedTimes = [...item.times];
                updatedTimes[index][type] = timeString;
                return { ...item, times: updatedTimes };
            }
            setIsChangedFormValues(true);
            return item;
        });
        setScheduleData(updatedData);
    };

    const handleSubmit = (values) => {
        
        const scheduleJson = scheduleData.reduce((acc, day) => {
            const timeRanges = day.times
                .filter(time => time.startTime && time.endTime)
                .map(time => `${dayjs(time.startTime, format).format(format)}-${dayjs(time.endTime, format).format(format)}`)
                .join('|');
            return { ...acc, [day.key]: timeRanges };
        }, {});
        const scheduleJsonString = JSON.stringify(scheduleJson);
        values.birthday = formatDateString(values.birthday, DEFAULT_FORMAT);
        const formvalue = {
            ...values,
            avatar: avatarUrl,
            schedule: scheduleJsonString,
            status: 1,
            salaryKind: 0,
            level: 1,
        };
        console.log('Form Values:', formvalue);
        return mixinFuncs.handleSubmit(formvalue);
    };

    useEffect(() => {
        if (!isEditing > 0) {
            form.setFieldsValue({
                status: statusValues[1].value,
            });
        }
    }, [isEditing]);
    useEffect(() => {
        dataDetail.birthday = dataDetail?.accountDto?.birthday && dayjs(dataDetail?.accountDto?.birthday, DEFAULT_FORMAT);

        const formattedDataDetail = {
            ...dataDetail,
            fullName: dataDetail?.accountDto?.fullName,
            phone: dataDetail?.accountDto?.phone,
            email: dataDetail?.accountDto?.email,
            hourlySalary: dataDetail?.hourlySalary,
            salary: dataDetail?.salary,
            developerId: dataDetail?.leader?.accountDto?.id,
            developerRoleId: dataDetail?.developerRole?.id,
            studentId: dataDetail?.student?.id,
        };

        form.setFieldsValue({
            ...formattedDataDetail,
         
        });
        setAvatarUrl(dataDetail?.accountDto?.avatar);

        const schedule = dataDetail.schedule ? JSON.parse(dataDetail.schedule) : {};
        const getSchedule = DAYS_OF_WEEK.map((day) => {
            if (schedule[day.key]) {
                const timeFrames = schedule[day.key].split('|').map((range) => {
                    const [startTime, endTime] = range.split('-').map((time) => dayjs(time, format));
                    return { startTime, endTime };
                });

                const times = [
                    ...timeFrames,
                    ...Array(3 - timeFrames.length).fill({ startTime: null, endTime: null }),
                ];

                return {
                    key: day.key,
                    label: day.label,
                    times,
                };
            }
            return {
                key: day.key,
                label: day.label,
                times: [
                    { startTime: null, endTime: null },
                    { startTime: null, endTime: null },
                    { startTime: null, endTime: null },
                ],
            };
        });

        setScheduleData(getSchedule);


    }, [dataDetail]);
    const columns = [
        {
            title: 'Thứ',
            dataIndex: 'label',
            width: '5%',
        },
        {
            title: 'Khung 1',
            dataIndex: 'times',
            width: '10%',
            render: (text, record) => (
                <>
                    <TimePicker
                        format={format}
                        value={record.times[0].startTime ? dayjs(record.times[0].startTime, format) : null}
                        onChange={(time, timeString) => handleSetTimes(time, timeString, record, 0, 'startTime')}
                        placeholder="Start Time"
                    />
                    <TimePicker
                        format={format}
                        value={record.times[0].endTime ? dayjs(record.times[0].endTime, format) : null}
                        onChange={(time, timeString) => handleSetTimes(time, timeString, record, 0, 'endTime')}
                        placeholder="End Time"
                    />
                </>
            ),
        },
        {
            title: 'Khung 2',
            dataIndex: 'times',
            width: '10%',
            render: (text, record) => (
                <>
                    <TimePicker
                        format={format}
                        value={record.times[1].startTime ? dayjs(record.times[1].startTime, format) : null}
                        onChange={(time, timeString) => handleSetTimes(time, timeString, record, 1, 'startTime')}
                        placeholder="Start Time"
                    />
                    <TimePicker
                        format={format}
                        value={record.times[1].endTime ? dayjs(record.times[1].endTime, format) : null}
                        onChange={(time, timeString) => handleSetTimes(time, timeString, record, 1, 'endTime')}
                        placeholder="End Time"
                    />
                </>
            ),
        },
        {
            title: 'Khung 3',
            dataIndex: 'times',
            width: '10%',
            render: (text, record) => (
                <>
                    <TimePicker
                        format={format}
                        value={record.times[2].startTime ? dayjs(record.times[2].startTime, format) : null}
                        onChange={(time, timeString) => handleSetTimes(time, timeString, record, 2, 'startTime')}
                        placeholder="Start Time"
                    />
                    <TimePicker
                        format={format}
                        value={record.times[2].endTime ? dayjs(record.times[2].endTime, format) : null}
                        onChange={(time, timeString) => handleSetTimes(time, timeString, record, 2, 'endTime')}
                        placeholder="End Time"
                    />
                </>
            ),
        },
        {
            title: 'Refresh',
            width: '10%',
            render: (text, record) => (
                <Button onClick={() => handleRefresh(record)}  >
                    <ReloadOutlined />
                </Button>
            ),
        },
    ];

    return (
        <BaseForm id={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange}>
            <Card className="card-form" bordered={false}>
                <Row gutter={10}>
                    <Col span={12}>
                        <CropImageField
                            label={<FormattedMessage defaultMessage="Avatar" />}
                            name="avatar"
                            imageUrl={avatarUrl && `${AppConstants.contentRootUrl}${avatarUrl}`}
                            aspect={1 / 1}
                            uploadFile={(...args) => uploadFile(...args, setAvatarUrl)}
                        />
                    </Col>

                </Row>
                <Row gutter={10}>
                    <Col span={12}>
                        <TextField required label={<FormattedMessage defaultMessage="Họ và tên" />} name="fullName" />
                    </Col>
                    <Col span={12}>
                        <DatePickerField
                            name="birthday"
                            label={<FormattedMessage defaultMessage="Ngày sinh" />}
                            placeholder="Ngày sinh"
                            format={DATE_FORMAT_DISPLAY}
                            style={{ width: '100%' }}
                            required
                        />
                    </Col>
                </Row>
                <Row gutter={10}>
                    <Col span={12}>
                        <TextField required label={<FormattedMessage defaultMessage="Số Điện Thoại" />} name="phone" />
                    </Col>
                    <Col span={12}>
                        <TextField required label={<FormattedMessage defaultMessage="Email" />} name="email" />
                    </Col>

                </Row>
                <Row gutter={10}>
                    <Col span={12}>
                        <Form.Item
                            label={<FormattedMessage defaultMessage="Lương theo giờ" />}
                            name="hourlySalary"
                            required
                        >
                            <InputNumber
                                addonAfter="$"
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                min={0}
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label={<FormattedMessage defaultMessage="Lương" />} name="salary" required>
                            <InputNumber
                                addonAfter="$"
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                min={0}
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={10}>
                    <Col span={12}>
                        <AutoCompleteField
                            label={<FormattedMessage defaultMessage="Leader" />}
                            name={['developerId']}
                            apiConfig={apiConfig.developer.autocomplete}
                            mappingOptions={(item) => ({ value: item.account.id, label: item.account.fullName })}
                            searchParams={(text) => ({ name: text })}
                            required
                        />
                    </Col>
                    <Col span={12}>
                        <AutoCompleteField
                            label={<FormattedMessage defaultMessage="Vai trò dự án" />}
                            name={['developerRoleId']}
                            apiConfig={apiConfig.category.autocomplete}
                            mappingOptions={(item) => ({ value: item.id, label: item.categoryName })}
                            initialSearchParams={{ kind: 4 }}
                            searchParams={(text) => ({ name: text })}
                            required
                        />
                    </Col>

                </Row>

                <Row gutter={10}>
                    <Col span={12}>
                        <AutoCompleteField
                            label={<FormattedMessage defaultMessage="Sinh viên" />}
                            name={['studentId']}
                            apiConfig={apiConfig.student.autocomplete}
                            mappingOptions={(item) => ({ value: item.account.id, label: item.account.fullName })}
                            searchParams={(text) => ({ name: text })}
                        />
                    </Col>


                    <Col span={12}>
                        <TextField required label={<FormattedMessage defaultMessage="Mật khẩu" />} name="password" />
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={12}>
                        <SelectField
                            required
                            label={<FormattedMessage defaultMessage="Trạng thái" />}
                            name="status"
                            options={statusValues}
                        />
                    </Col>
                </Row>


                <Col span={6}>
                    <span style={{ marginTop: '4px', marginBottom: 10 }}>Lịch trình</span>
                    <Button onClick={handleApplyAll} type='primary' style={{ marginLeft: 620 }}>Áp dụng tất cả</Button>
                </Col>
                <Table
                    columns={columns}
                    dataSource={scheduleData}
                    pagination={false}
                    bordered
                    size="middle"
                    style={{ width: '100%' }}
                />
                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};

export default DeveloperForm;