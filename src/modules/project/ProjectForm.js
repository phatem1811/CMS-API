import { Card, Col, Form, Row, Space, InputNumber } from 'antd';
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
import { useIntl } from 'react-intl';
import {
    STATE_PROJECT_CREATE, STATE_PROJECT_RUNNING, STATE_PROJECT_DONE,
    STATE_PROJECT_CANCEL, STATE_PROJECT_FAILED, projectStateMessage } from '@constants/masterData';

dayjs.extend(customParseFormat);

const ProjectForm = ({ formId, actions, dataDetail, onSubmit, setIsChangedFormValues, isEditing }) => {
    const { execute: executeUpFile } = useFetch(apiConfig.file.upload, {
        immediate: false,
    });
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [bannerUrl, setBannerUrl] = useState(null);

    const translate = useTranslate();
    const statusValues = translate.formatKeys(statusOptions, ['label']);

    const { formatMessage } = useIntl();
    const stateOptionValues = [
        { value: STATE_PROJECT_CREATE, label: formatMessage(projectStateMessage.create) },
        { value: STATE_PROJECT_RUNNING, label: formatMessage(projectStateMessage.running) },
        { value: STATE_PROJECT_DONE, label: formatMessage(projectStateMessage.done) },
        { value: STATE_PROJECT_CANCEL, label: formatMessage(projectStateMessage.cancel) },
        { value: STATE_PROJECT_FAILED, label: formatMessage(projectStateMessage.failed) },

    ];
    const [startDate, setStartDate] = useState(null);

    // Hàm xử lý khi thay đổi ngày
    const handleDateChange = (date, dateString) => {
        setStartDate(date);
        date = formatDateString(date, DEFAULT_FORMAT);

    };
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

    const handleSubmit = (values) => {

        values.startDate = dayjs().format(DEFAULT_FORMAT);
        values.endDate = formatDateString(values.endDate, DEFAULT_FORMAT);
        return mixinFuncs.handleSubmit({ ...values });
    };

    useEffect(() => {
        if (!isEditing > 0) {
            form.setFieldsValue({
                status: statusValues[1].value,
            });
        }
    }, [isEditing]);

    useEffect(() => {
        dataDetail.startDate = dataDetail.startDate && dayjs(dataDetail.startDate, DEFAULT_FORMAT);
        dataDetail.endDate = dataDetail.endDate && dayjs(dataDetail.endDate, DEFAULT_FORMAT);
        form.setFieldsValue({
            ...dataDetail,

        });
        setAvatarUrl(dataDetail?.avatar);
    }, [dataDetail]);

    return (
        <BaseForm id={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange}>
            <Card className="card-form" bordered={false}>
                <Row gutter={10}>
                    <CropImageField
                        label={<FormattedMessage defaultMessage="Avatar" />}
                        name="avatar"
                        imageUrl={avatarUrl && `${AppConstants.contentRootUrl}${avatarUrl}`}
                        aspect={1 / 1}
                        uploadFile={(...args) => uploadFile(...args, setAvatarUrl)}
                    />

                </Row>
                <Row gutter={10}>
                    <Col span={12}>
                        <TextField required label={<FormattedMessage defaultMessage="Tên dự án" />} name="name" />
                    </Col>

                </Row>
                <Row gutter={10}>
                    <Col span={12}>
                        <DatePickerField
                            name="startDate"
                            label={<FormattedMessage defaultMessage="Ngày bắt đầu" />}
                            placeholder="Ngày bắt đầu"
                            format={DATE_FORMAT_DISPLAY}
                            onChange={handleDateChange}
                            style={{ width: '100%' }}
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn ngày bắt đầu',
                                },
                            ]}
                        />
                    </Col>
                    <Col span={12}>
                        <DatePickerField
                            label={<FormattedMessage defaultMessage="Ngày kết thúc" />}
                            name="endDate"
                            placeholder="Ngày kết thúc"
                            format={DATE_FORMAT_DISPLAY}
                            style={{ width: '100%' }}
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn ngày kết thúc',
                                },
                            ]}
                            disabledDate={(current) => 
                                startDate ? current && current <= startDate.startOf('day') : false
                            }
                        />
                    </Col>
                </Row>

                <Row gutter={10}>
                    <Col span={24}>
                        <TextField
                            required
                            label={<FormattedMessage defaultMessage="Description" />}
                            name="description"
                            type="textarea"
                        />
                    </Col>
                </Row>
                <Row gutter={24}>


                    <Col span={12}>
                        <SelectField
                            required
                            label={<FormattedMessage defaultMessage="Tình trạng" />}
                            name="status"
                            options={stateOptionValues}
                        />
                    </Col>

                    <Col span={12}>
                        <SelectField
                            required
                            label={<FormattedMessage defaultMessage="Trạng thái" />}
                            name="state"
                            options={statusValues}
                        />
                    </Col>
                </Row>



                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};

export default ProjectForm;