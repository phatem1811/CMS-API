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
import { useNavigate, useLocation, useParams } from "react-router-dom";
import DatePickerField from '@components/common/form/DatePickerField';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { DATE_FORMAT_DISPLAY, DATE_FORMAT_VALUE, DEFAULT_FORMAT } from '@constants/index';
import { formatDateString } from '@utils/index';
import { useIntl } from 'react-intl';
import {
    STATE_PROJECT_CREATE, STATE_PROJECT_RUNNING, STATE_PROJECT_DONE,
    STATE_PROJECT_CANCEL, STATE_PROJECT_FAILED, projectStateMessage } from '@constants/masterData';
import RichTextField from '@components/common/form/RichTextField';

dayjs.extend(customParseFormat);

const StoryForm = ({ formId, actions, dataDetail, onSubmit, setIsChangedFormValues, isEditing }) => {
    const { execute: executeUpFile } = useFetch(apiConfig.file.upload);


    const translate = useTranslate();
    const statusValues = translate.formatKeys(statusOptions, ['label']);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const projectId = queryParams.get('projectId');
    console.log("checck project id", projectId);
    const { execute: fetchAutoCompleteData, data: datadeveloper,
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
    const defaultStatus = 1;

    const { formatMessage } = useIntl();
    const stateOptionValues = [
        { value: STATE_PROJECT_CREATE, label: formatMessage(projectStateMessage.create) },
        { value: STATE_PROJECT_RUNNING, label: formatMessage(projectStateMessage.running) },
        { value: STATE_PROJECT_DONE, label: formatMessage(projectStateMessage.done) },
        { value: STATE_PROJECT_CANCEL, label: formatMessage(projectStateMessage.cancel) },


    ];

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


        if (values.dateComplete != null) values.dateComplete = formatDateString(values.dateComplete, DEFAULT_FORMAT);

        values.projectId = projectId;
        values.status = 1;
        console.log("check data", values);
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
        dataDetail.dateComplete = dataDetail.dateComplete && dayjs(dataDetail.dateComplete, DEFAULT_FORMAT);
        form.setFieldsValue({
            ...dataDetail,
            developerId: dataDetail?.developerInfo?.account?.id,
        });
    }, [dataDetail]);

    return (


        <BaseForm id={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange}>
            <Card className="card-form" bordered={false}>
                <Row gutter={10}>
                    <Col span={12}>
                        <TextField required label={<FormattedMessage defaultMessage="Tên story" />} name="storyName" />
                    </Col>
                    <Col span={12}>
                        <AutoCompleteField
                            label={<FormattedMessage defaultMessage="Người thực hiện" />}
                            name={['developerId']}
                            apiConfig={apiConfig.memberProject.autocomplete}
                            mappingOptions={(item) => ({ value: item.developer?.id, label: item.developer?.account?.fullName })}
                            initialSearchParams={{ projectId: projectId }}
                            searchParams={(text) => ({ name: text })}

                            required
                            disabled={isEditing}
                        />
                    </Col>

                </Row>

                <Row gutter={10}>

                    <Col span={12}>
                        <SelectField
                            required
                            label={<FormattedMessage defaultMessage="Tình trạng" />}
                            name="state"
                            options={stateOptionValues}
                        />
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label={<FormattedMessage defaultMessage="Thời gian hoàn thành" />}
                            name="timeEstimate"
                            required
                        >
                            <InputNumber
                                addonAfter="phút"
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                max={10000000000}
                                min={0}
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                    </Col>

                </Row>

                <Row gutter={10}>
                    <Col span={12}>
                        <DatePickerField
                            name="dateComplete"
                            label={<FormattedMessage defaultMessage="Ngày hoàn thành" />}
                            placeholder="Ngày hoàn thành"
                            format={DATE_FORMAT_DISPLAY}
                            style={{ width: '100%' }}

                        />
                    </Col>

                </Row>

                <Row gutter={10}>
                    <Col span={24}>
                        <RichTextField
                            required
                            label={<FormattedMessage defaultMessage="Description" />}
                            name="description"
                            type="textarea"
                            style= {{ height: '200px' }}
                        />
                    </Col>
                </Row>
                <Form.Item name="status" initialValue={defaultStatus} hidden>

                </Form.Item>



                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};

export default StoryForm;