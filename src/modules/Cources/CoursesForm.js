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

dayjs.extend(customParseFormat);

const CourseForm = ({ formId, actions, dataDetail, onSubmit, setIsChangedFormValues, isEditing }) => {
    const { execute: executeUpFile } = useFetch(apiConfig.file.upload);
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [bannerUrl, setBannerUrl] = useState(null);

    const translate = useTranslate();
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

    const handleSubmit = (values) => {

        values.dateRegister = dayjs().format(DEFAULT_FORMAT);
        values.dateEnd = formatDateString(values.dateEnd, DEFAULT_FORMAT);
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
        dataDetail.dateRegister = dataDetail.dateRegister && dayjs(dataDetail.dateRegister, DEFAULT_FORMAT);
        dataDetail.dateEnd = dataDetail.dateEnd && dayjs(dataDetail.dateEnd, DEFAULT_FORMAT);
        form.setFieldsValue({
            ...dataDetail,
            subjectId: dataDetail?.subject?.id,
            state: dataDetail?.state,
            leaderId: dataDetail?.leader?.account?.id,

        });
        setAvatarUrl(dataDetail?.avatar);
    }, [dataDetail]);

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
                    <Col span={12}>
                        <CropImageField
                            label={<FormattedMessage defaultMessage="Banner" />}
                            name="banner"
                            imageUrl={bannerUrl && `${AppConstants.contentRootUrl}${bannerUrl}`}
                            aspect={16 / 9}
                            uploadFile={(...args) => uploadFile(...args, setBannerUrl)}
                        />
                    </Col>
                </Row>
                <Row gutter={10}>
                    <Col span={12}>
                        <TextField required label={<FormattedMessage defaultMessage="Tên khoá học" />} name="name" />
                    </Col>
                    <Col span={12}>

                        <AutoCompleteField
                            label={<FormattedMessage defaultMessage="Môn học" />}
                            name={['subjectId']}
                            apiConfig={apiConfig.subject.autocomplete}
                            mappingOptions={(item) => ({ value: item.id, label: item.subjectName })}
                            searchParams={(text) => ({ subjectName: text })}
                            required
                        />

                    </Col>
                </Row>
                <Row gutter={10}>
                    <Col span={12}>
                        <DatePickerField
                            name="dateRegister"
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
                            name="dateEnd"
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
                            label={<FormattedMessage defaultMessage="Description" />}
                            name="description"
                            type="textarea"
                        />
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={12}>

                        <AutoCompleteField
                            label={<FormattedMessage defaultMessage="Leader" />}
                            name={['leaderId']}
                            apiConfig={apiConfig.developer.autocomplete}
                            mappingOptions={(item) => ({ value: item.id, label: item.account.fullName })}
                            searchParams={(text) => ({ name: text })}
                            required={isEditing ? false : true}
                        />
                    </Col>

                    <Col span={12}>
                        <SelectField
                            required
                            label={<FormattedMessage defaultMessage="Tình trạng" />}
                            name="status"
                            options={statusValues}
                        />
                    </Col>
                </Row>

                <Row gutter={24}>

                    <Col span={12}>
                        <Form.Item
                            label={<FormattedMessage defaultMessage="Học phí" />}
                            name="fee"
                            rules={[{ required: true, message: <FormattedMessage defaultMessage="Học phí không được để trống" /> }]}
                        >
                            <InputNumber
                                addonAfter="đ"
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                min={0}
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            label={<FormattedMessage defaultMessage="Phí hoàn lại" />}
                            name="returnFee"
                            rules={[{ required: true, message: <FormattedMessage defaultMessage="Phí hoàn lại không được để trống" /> }]}
                        >
                            <InputNumber
                                addonAfter="đ"
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                min={0}
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                    </Col>


                </Row>

                <Row gutter={24}>
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

export default CourseForm;