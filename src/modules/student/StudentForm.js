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

const StudentForm = ({ formId, actions, dataDetail, onSubmit, setIsChangedFormValues, categories, isEditing }) => {
    const { execute: executeUpFile } = useFetch(apiConfig.file.upload);
    const [avatarUrl, setAvatarUrl] = useState(null);
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
        values.fromDate = formatDateString(values.fromDate, DEFAULT_FORMAT);
        values.endDate = formatDateString(values.endDate, DEFAULT_FORMAT);
        values.birthday = formatDateString(values.birthday, DEFAULT_FORMAT);
        const formvalue = {
            ...values,
            avatar: avatarUrl,
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
        const formattedDataDetail = {
            ...dataDetail,
            fromDate: dataDetail.fromDate && dayjs(dataDetail.fromDate, DEFAULT_FORMAT),
            endDate: dataDetail.endDate && dayjs(dataDetail.endDate, DEFAULT_FORMAT),
            avatar: dataDetail.avatar,
            fullName: dataDetail.account?.fullName,
            birthday: dataDetail.account?.birthday && dayjs(dataDetail.account.birthday, DEFAULT_FORMAT),
            phone: dataDetail.account?.phone,
            email: dataDetail.account?.email,
            password: dataDetail.account?.password,
            universityId: dataDetail.university?.id,
            studyClassId: dataDetail.studyClass?.id,
        };

        form.setFieldsValue({
            ...formattedDataDetail,
            status: formattedDataDetail.status,
        });
        setAvatarUrl(dataDetail?.account?.avatar);
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

                </Row>
                <Row gutter={10}>
                    <Col span={12}>
                        <TextField required label={<FormattedMessage defaultMessage="Tên học sinh" />} name="fullName" />
                    </Col>
                    <Col span={12}>
                        <DatePickerField
                            name="birthday"
                            label={<FormattedMessage defaultMessage="Ngày sinh" />}
                            placeholder="Ngày sinh"
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
                </Row>
                <Row gutter={10}>
                    <Col span={12}>
                        <TextField required label={<FormattedMessage defaultMessage="MSSV" />} name="mssv" />
                    </Col>
                    <Col span={12}>
                        <TextField required label={<FormattedMessage defaultMessage="Số điện thoại" />} name="phone" />
                    </Col>

                </Row>
                <Row gutter={10}>
                    <Col span={12}>
                        <TextField required label={<FormattedMessage defaultMessage="Mật khẩu" />} name="password" />
                    </Col>
                    <Col span={12}>
                        <TextField required label={<FormattedMessage defaultMessage="Email" />} name="email" />
                    </Col>
                </Row>
                <Row gutter={10}>
                    <Col span={12}>
                        <AutoCompleteField
                            label={<FormattedMessage defaultMessage="Trường" />}
                            name={['universityId']}
                            apiConfig={apiConfig.category.autocomplete}
                            mappingOptions={(item) => ({ value: item.id, label: item.categoryName })}
                            initialSearchParams={{ kind: 1 }}
                            searchParams={(text) => ({ name: text })}
                            required={isEditing ? false : true}
                        />
                    </Col>
                    <Col span={12}>
                        <AutoCompleteField
                            label={<FormattedMessage defaultMessage="Hệ" />}
                            name={['studyClassId']}
                            apiConfig={apiConfig.category.autocomplete}
                            mappingOptions={(item) => ({ value: item.id, label: item.categoryName })}
                            initialSearchParams={{ kind: 2 }}
                            searchParams={(text) => ({ name: text })}
                            required={isEditing ? false : true}
                        />
                    </Col>

                </Row>

                <Row gutter={10}>
                    <Col span={12}>
                        <DatePickerField
                            name="fromDate"
                            label={<FormattedMessage defaultMessage="Ngày bắt đầu trainning" />}
                            placeholder="Ngày bắt đầu trainning"
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
                            label={<FormattedMessage defaultMessage="Ngày kết thúc trainning" />}
                            name="endDate"
                            placeholder="Ngày kết thúc trainning"
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
                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};

export default StudentForm;