import { Card, Col, Form, InputNumber, Row, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import useBasicForm from '@hooks/useBasicForm';

import apiConfig from '@constants/apiConfig';

import useTranslate from '@hooks/useTranslate';
import { statusOptions } from '@constants/masterData';
import { FormattedMessage } from 'react-intl';
import { BaseForm } from '@components/common/form/BaseForm';
import AutoCompleteField from '@components/common/form/AutoCompleteField';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const ProjectRegistrationForm = ({ formId, actions, dataDetail, onSubmit, setIsChangedFormValues, isEditing }) => {
    const translate = useTranslate();
    const statusValues = translate.formatKeys(statusOptions, ['label']);

    const searchParams = new URLSearchParams(location.search);
    const registrationId = searchParams.get('registrationId');

    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });

    const handleSubmit = (values) => {
        values.registrationId = registrationId;
        const formvalues = {
            ...values,
        };
        return mixinFuncs.handleSubmit(formvalues);
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
            universityId: dataDetail?.university?.id,
        });
    }, [dataDetail]);

    return (
        <BaseForm id={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange}>
            <Card className="card-form" bordered={false}>
                <Row gutter={24}>
                    <Col span={24}>
                        <AutoCompleteField
                            label={<FormattedMessage defaultMessage="Dự án" />}
                            name={['projectId']}
                            apiConfig={apiConfig.project.autocomplete}
                            mappingOptions={(item) => ({
                                value: item.id,
                                label: item.name,
                            })}
                            searchParams={(text) => ({ name: text })}
                            required
                        />
                    </Col>
                </Row>
                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};
export default ProjectRegistrationForm;