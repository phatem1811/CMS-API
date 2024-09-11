import { Button, Card, Checkbox, Col, Flex, Form, Row, Space, Table, TimePicker } from 'antd';
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
import { useNavigate, useLocation, useParams } from "react-router-dom";
import DatePickerField from '@components/common/form/DatePickerField';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { DATE_FORMAT_DISPLAY, DATE_FORMAT_VALUE, DEFAULT_FORMAT } from '@constants/index';
import { formatDateString } from '@utils/index';
import { useIntl } from 'react-intl';



dayjs.extend(customParseFormat);

const MemberForm = ({ formId, actions, dataDetail, onSubmit, setIsChangedFormValues, isEditing }) => {
    const { execute: executeUpFile } = useFetch(apiConfig.file.upload);


    const translate = useTranslate();
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const projectId = queryParams.get('projectId');

    const format = 'HH:mm';
    const DAYS_OF_WEEK = [
        { key: 't2', label: 'Thứ 2' },
        { key: 't3', label: 'Thứ 3' },
        { key: 't4', label: 'Thứ 4' },
        { key: 't5', label: 'Thứ 5' },
        { key: 't6', label: 'Thứ 6' },
        { key: 't7', label: 'Thứ 7' },
        { key: 'cn', label: 'Chủ Nhật' },
    ];
    const [scheduleData, setScheduleData] = useState(DAYS_OF_WEEK.map((day) => ({
        key: day.key,
        label: day.label,
        times: [
            { startTime: null, endTime: null },
            { startTime: null, endTime: null },
            { startTime: null, endTime: null },
        ],
    })),
    );

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
    const handleRefresh = (record) => {
        const updatedData = scheduleData.map((item) => {
            if (item.key === record.key) {
                const clearedTimes = item.times.map(() => ({ startTime: null, endTime: null }));
                return { ...item, times: clearedTimes };
            }
            return item;
        });
        setScheduleData(updatedData);
    };

    const handleSubmit = (values) => {

        console.log("check values", values.schedule);
        const scheduleJson = scheduleData.reduce((acc, day) => {
            const timeRanges = day.times
                .filter(time => time.startTime && time.endTime)
                .map(time => `${dayjs(time.startTime, format).format(format)}-${dayjs(time.endTime, format).format(format)}`)
                .join('|');
            return { ...acc, [day.key]: timeRanges };
        }, {});
        const scheduleJsonString = JSON.stringify(scheduleJson);
        console.log("check data schedule", scheduleJsonString);
        const dataupdate = {
            ...values,
            schedule: scheduleJsonString,
            status: 1,
            projectId: projectId,
            isPaid: values.isPaid,
        };
        console.log("check data update", dataupdate);
        return mixinFuncs.handleSubmit(dataupdate);
    };

    useEffect(() => {
        if (!isEditing > 0) {
            form.setFieldsValue({
                status: statusValues[1].value,
            });
        }
    }, [isEditing]);

    useEffect(() => {

        form.setFieldsValue({
            ...dataDetail,

            developerId: dataDetail?.developer?.id,
            projectRoleId: dataDetail?.projectRole?.id,
        });

        const schedule = dataDetail.schedule ? JSON.parse(dataDetail.schedule) : {};
        const updatedScheduleData = DAYS_OF_WEEK.map((day) => {
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

        setScheduleData(updatedScheduleData);

    }, [dataDetail]);

    const handleTimeChange = (time, timeString, record, index, type) => {
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
                        onChange={(time, timeString) => handleTimeChange(time, timeString, record, 0, 'startTime')}
                        placeholder="Start Time"
                    />
                    <TimePicker
                        format={format}
                        value={record.times[0].endTime ? dayjs(record.times[0].endTime, format) : null}
                        onChange={(time, timeString) => handleTimeChange(time, timeString, record, 0, 'endTime')}
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
                        onChange={(time, timeString) => handleTimeChange(time, timeString, record, 1, 'startTime')}
                        placeholder="Start Time"
                    />
                    <TimePicker
                        format={format}
                        value={record.times[1].endTime ? dayjs(record.times[1].endTime, format) : null}
                        onChange={(time, timeString) => handleTimeChange(time, timeString, record, 1, 'endTime')}
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
                        onChange={(time, timeString) => handleTimeChange(time, timeString, record, 2, 'startTime')}
                        placeholder="Start Time"
                    />
                    <TimePicker
                        format={format}
                        value={record.times[2].endTime ? dayjs(record.times[2].endTime, format) : null}
                        onChange={(time, timeString) => handleTimeChange(time, timeString, record, 2, 'endTime')}
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
    const handleCheckboxChange = (e) => {
        form.setFieldsValue({ isPaid: e.target.checked });
    };


    return (

        <BaseForm id={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange}>
            <Card className="card-form" bordered={false}>
                <Row gutter={10}>

                    <Col span={12}>
                        <AutoCompleteField
                            label={<FormattedMessage defaultMessage="Lập trình viên" />}
                            name={['developerId']}
                            apiConfig={apiConfig.developer.autocomplete}
                            mappingOptions={(item) => ({ value: item.id, label: item.account?.fullName })}
                            initialSearchParams={{ ignoreMemberProject: 'true', projectId: projectId }}
                            searchParams={(text) => ({ name: text })}
                            required
                            disabled={isEditing}
                        />
                    </Col>

                    <Col span={12}>
                        <AutoCompleteField
                            label={<FormattedMessage defaultMessage="Vai trò" />}
                            name={['projectRoleId']}
                            apiConfig={apiConfig.projectRole.autocomplete}
                            mappingOptions={(item) => ({ value: item.id, label: item.projectRoleName })}
                            searchParams={(text) => ({ name: text })}
                            required
                            disabled={isEditing}
                        />
                    </Col>

                </Row>
                <Row gutter={10}>

                    <Form.Item
                        label={<FormattedMessage defaultMessage="Được trả lương" />}
                        name="isPaid"
                        valuePropName="checked"

                    >
                        <Checkbox onChange={handleCheckboxChange} />
                    </Form.Item>
                </Row>

                <Table
                    columns={columns}
                    dataSource={scheduleData}
                    pagination={false}

                />
                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};

export default MemberForm;