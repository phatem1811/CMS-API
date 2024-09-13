import { Card, Col, Form, Row, Space, InputNumber, Input, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import useBasicForm from '@hooks/useBasicForm';

import useFetch from '@hooks/useFetch';
import apiConfig from '@constants/apiConfig';
import SelectField from '@components/common/form/SelectField';
import useTranslate from '@hooks/useTranslate';


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
    STATE_PROJECT_CREATE, STATE_PROJECT_RUNNING, STATE_PROJECT_DONE, kindTaskOptions,
    STATE_PROJECT_CANCEL, STATE_PROJECT_FAILED, projectStateMessage } from '@constants/masterData';
import RichTextField from '@components/common/form/RichTextField';

dayjs.extend(customParseFormat);

const TaskStoryForm = ({ formId, actions, dataDetail, onSubmit, setIsChangedFormValues, isEditing }) => {
    const { execute: executeUpFile } = useFetch(apiConfig.file.upload);

    const translate = useTranslate();
    const taskOptions = translate.formatKeys(kindTaskOptions, ['label']);
    const { formatMessage } = useIntl();
    const { Option } = Select;
    const stateOptionValues = [
        { value: STATE_PROJECT_CREATE, label: formatMessage(projectStateMessage.create), color: 'yellow' },
        { value: STATE_PROJECT_RUNNING, label: formatMessage(projectStateMessage.running), color: 'blue' },

        { value: STATE_PROJECT_CANCEL, label: formatMessage(projectStateMessage.cancel), color: '#CC0000' },
        { value: STATE_PROJECT_FAILED, label: 'Đang test', color: '#CC0000' },

    ];

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const projectId = queryParams.get('projectId');
    const storyId = queryParams.get('storyId');
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
    const [selectedContent, setSelectedContent] = useState('');
    const { data: templateData } = useFetch(apiConfig.documentTemplate.getList, {
        immediate: true,
        mappingData: (response) => {
            return response.data.content;
        },
    });

    const [startDate, setStartDate] = useState(null);

    const handleDateChange = (date, dateString) => {
        setStartDate(date);
        date = formatDateString(date, DEFAULT_FORMAT);

    };
    const [kind, setKind] = useState(null);
    const handleSeclectKind = (id) => {
        setKind(id);
    };

    const handleTemplateChange = (value) => {
        const selectedTemplate = templateData.find((item) => item.id === value);
        console.log('selected', selectedTemplate);
        if (selectedTemplate) {

            form.setFieldsValue({ description: selectedTemplate.content });
            setSelectedContent(selectedTemplate.name);
        }
    };


    const handleSubmit = (values) => {
        values.startDate = formatDateString(values.startDate, DEFAULT_FORMAT);
        values.dueDate = formatDateString(values.dueDate, DEFAULT_FORMAT);
        values.status = 1;
        values.kind = kind;
        const formData = {
            ...values,
            projectId,
            storyId,

        };
        console.log("check formdata", formData);

        return mixinFuncs.handleSubmit(formData);

    };

    useEffect(() => {
        if (!isEditing > 0) {
            form.setFieldsValue({
                status: taskOptions[1].value,
            });
        }
    }, [isEditing]);

    useEffect(() => {
        dataDetail.startDate = dataDetail.startDate && dayjs(dataDetail.startDate, DEFAULT_FORMAT);
        dataDetail.dueDate = dataDetail.dueDate && dayjs(dataDetail.dueDate, DEFAULT_FORMAT);
        setKind(dataDetail.kind);
        form.setFieldsValue({
            ...dataDetail,
            developerId: dataDetail?.developer?.account?.id,
            projectCategoryId: dataDetail?.projectCategoryInfo?.id,
            testPlanId: dataDetail?.testPlan?.id,
        });
    }, [dataDetail]);


    return (
        <BaseForm id={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange}>
            <Card className="card-form" bordered={false}>
                <Row gutter={10}>

                    <Col span={12}>
                        <Form.Item
                            label={<FormattedMessage defaultMessage="Tên Task" />}
                            name="taskName"
                            rules={[{ required: true, message: <FormattedMessage defaultMessage="Tên Task không được để trống" /> }]}
                        >
                            <Input
                                addonBefore={
                                    isEditing ? (

                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <img src={kindTaskOptions.find(option => option.value === kind)?.imageUrl} alt="Task kind" style={{ width: '25px', height: '20px', marginRight: '10px' }} />
                                        </div>
                                    ) : (

                                        <Select
                                            style={{ width: '60px' }}
                                            onChange={handleSeclectKind}
                                            value={kind}
                                        // disabled={isEditing}
                                        >
                                            {kindTaskOptions.map(option => (
                                                <Option key={option.value} value={option.value}>
                                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                        <img src={option.imageUrl} alt="Task kind" style={{ width: '50px', height: '20px' }} />
                                                    </div>
                                                </Option>
                                            ))}
                                        </Select>
                                    )
                                }
                                placeholder="Nhập tên Task"
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <AutoCompleteField
                            label={<FormattedMessage defaultMessage="Danh mục" />}
                            name={['projectCategoryId']}
                            apiConfig={apiConfig.projectCategory.autocomplete}
                            mappingOptions={(item) => ({ value: item?.id, label: item?.projectCategoryName })}
                            initialSearchParams={{ projectId: projectId }}
                            searchParams={(text) => ({ name: text })}

                            required

                        />
                    </Col>

                </Row>

                <Row gutter={10}>

                    <Col span={12}>
                        <AutoCompleteField
                            label={<FormattedMessage defaultMessage="Người thực hiện" />}
                            name={['developerId']}
                            apiConfig={apiConfig.memberProject.autocomplete}
                            mappingOptions={(item) => ({ value: item.developer?.id, label: item.developer?.account?.fullName })}
                            initialSearchParams={{ projectId: projectId }}
                            searchParams={(text) => ({ name: text })}
                            disabled={isEditing}


                        />
                    </Col>
                    <Col span={12}>
                        <SelectField
                            required
                            label={<FormattedMessage defaultMessage="Tình trạng" />}
                            name="state"
                            options={stateOptionValues}
                        />
                    </Col>

                </Row>

                <Row gutter={10}>
                    <Col span={12}>
                        <AutoCompleteField
                            label={<FormattedMessage defaultMessage="Test plan" />}
                            name={['testPlanId']}
                            apiConfig={apiConfig.testPlan.autocomplete}
                            mappingOptions={(item) => ({
                                value: item.id,
                                label: item.name,
                            })}
                            initialSearchParams={{ projectId: projectId, storyId: storyId }}
                            searchParams={(text) => ({ name: text })}

                        />
                    </Col>
                    <Col span={12}>
                        <DatePickerField
                            name="startDate"
                            label={<FormattedMessage defaultMessage="Ngày bắt đầu" />}
                            placeholder="Ngày bắt đầu"
                            format={DATE_FORMAT_DISPLAY}
                            onChange={handleDateChange}
                            style={{ width: '100%' }}
                            required
                        />
                    </Col>
                </Row>

                <Row gutter={20}>
                    <Col span={12}>
                        <DatePickerField
                            name="dueDate"
                            label={<FormattedMessage defaultMessage="Ngày kết thúc" />}
                            placeholder="Ngày kết thúc"
                            format={DATE_FORMAT_DISPLAY}
                            style={{ width: '100%' }}
                            disabledDate={(current) =>
                                startDate ? current && current <= startDate.startOf('day') : false
                            }
                            required
                        />
                    </Col>

                </Row>
                <Row gutter={20}>
                    <Col span={6}>
                        <div style={{ marginTop: '4px', fontSize: '15px' }}>Mô tả</div>
                    </Col>
                    <Col span={12}>
                        <div style={{ marginTop: '4px', marginLeft: '200px', fontSize: '15px' }}>Chọn biểu mẫu :</div>
                    </Col>

                    <Col span={6}>
                        <AutoCompleteField
                            name={['templateId']}
                            apiConfig={apiConfig.documentTemplate.getList}
                            mappingOptions={(item) => ({ value: item.id, label: item.name })}
                            searchParams={(text) => ({ name: text })}
                            onChange={handleTemplateChange}

                            allowClear={true}
                        />
                    </Col>
                </Row>
                <Row gutter={20}>
                    <Col span={24}>
                        <RichTextField
                            required
                            name="description"
                            type="textarea"
                            style={{ height: '300px', marginBottom: '50px' }}


                        />
                    </Col>
                </Row>
                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm >
    );
};

export default TaskStoryForm;