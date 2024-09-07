import { Card, Col, Form, Row, Space, InputNumber } from 'antd';
import React, { useEffect, useState } from 'react';
import useBasicForm from '@hooks/useBasicForm';
import TextField from '@components/common/form/TextField';
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
import { STATE_TASK_ASIGN, STATE_TASK_DONE, taskStateMessage } from '@constants/masterData';
import { useIntl } from 'react-intl';

dayjs.extend(customParseFormat);

const TaskForm = ({ formId, actions, dataDetail, onSubmit, setIsChangedFormValues, isEditing }) => {

    const translate = useTranslate();
    const statusValues = translate.formatKeys(statusOptions, ['label']);


    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });
    const defaultStatus = 1;
    const { formatMessage } = useIntl();
    const stateValues = [
        { value: STATE_TASK_ASIGN, label: formatMessage(taskStateMessage.asign) },
        { value: STATE_TASK_DONE, label: formatMessage(taskStateMessage.done) },
    ];
    const handleSubmit = (values) => {

        values.startDate = formatDateString(values.startDate, DEFAULT_FORMAT);
        values.dueDate = formatDateString(values.dueDate, DEFAULT_FORMAT);
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
        dataDetail.dueDate = dataDetail.dueDate && dayjs(dataDetail.dueDate, DEFAULT_FORMAT);
        form.setFieldsValue({
            ...dataDetail,

            state: dataDetail?.state,
            studentId: dataDetail?.student?.account?.id,


        });

    }, [dataDetail]);

    return (
        <BaseForm id={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange}  >
            <Card className="card-form" bordered={false}>

                <Row gutter={24}>

                    <Col span={12}>
                        <AutoCompleteField
                            label={<FormattedMessage defaultMessage="Sinh Viên" />}
                            name={['studentId']}
                            apiConfig={apiConfig.student.autocomplete}
                            mappingOptions={(item) => ({ value: item.id, label: item.account.fullName })}
                            searchParams={(text) => ({ name: text })}
                            required={isEditing ? false : true}
                        />
                    </Col>
                    <Col span={12}>
                        <SelectField
                            required
                            label={<FormattedMessage defaultMessage="Trạng thái" />}
                            name="state"
                            options={stateValues}
                        />
                    </Col>


                </Row>
                <Row gutter={10}>
                    <Col span={12}>
                        <DatePickerField
                            name="startDate"
                            label={<FormattedMessage defaultMessage="Ngày bắt đầu" />}
                            placeholder="Ngày bắt đầu"
                            format={DATE_FORMAT_DISPLAY}
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
                            name="dueDate"
                            placeholder="Ngày kết thúc"
                            format={DATE_FORMAT_DISPLAY}
                            style={{ width: '100%' }}
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn ngày kết thúc',
                                },
                            ]}
                        />
                    </Col>
                </Row>

                <Row gutter={10}>
                    <Col span={24}>
                        <TextField
                            required
                            label={<FormattedMessage defaultMessage="Chú ý" />}
                            name="note"
                            type="textarea"
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

export default TaskForm;