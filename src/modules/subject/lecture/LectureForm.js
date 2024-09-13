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
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import RichTextField from '@components/common/form/RichTextField';
import { useParams } from 'react-router-dom';
dayjs.extend(customParseFormat);

const LectureForm = ({ formId, actions, dataDetail, onSubmit, setIsChangedFormValues, isEditing }) => {

    const [lectureKind, setLectureKind] = useState(null);

    const { subjectId } = useParams();
   
    const [updatedata, setUpdatedata] = useState([]);
    const handleLectureKindChange = (value) => {
        setLectureKind(value);
    };
    const [dataSource, setDataSource] = useState([]);


    const { execute } = useFetch(apiConfig.lecture.getBySubject, {
        pathParams: { id: subjectId },
        immediate: false,
    });
    const { execute: updateSortLecture } = useFetch(apiConfig.lecture.updateSort, {
        immediate: false,
    });



    const translate = useTranslate();
    const statusValues = translate.formatKeys(statusOptions, ['label']);

    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });

    const handleSubmit = async (values) => {
        values.subjectId = subjectId;
        values.status = 1;
        

        if (!isEditing) {
            try {
                await execute({
                    method: 'GET',
                    onCompleted: (response) => {
                        console.log(' successfully:', response.data);
                        const queryParams = new URLSearchParams(location.search);
                        const nextOrdering = queryParams.get('nextOrdering');
                        console.log("check nextOrdering", nextOrdering);
                        values.ordering = nextOrdering;
                        const dataupdate = response.data.content.map((item) => {
                            if (item.ordering >= nextOrdering) {
                                return {
                                    ...item,
                                    ordering: item.ordering + 1,
                                };
                            }
                            return item;
                        });
                        console.log('Updated Data fetch:', dataupdate);
                        updateSortLecture({            
                            data: dataupdate,
                            onCompleted: (response) => {
                                console.log('successfully update sort:', response);
                            },
                            onError: (error) => {
                                console.error('Error creating :', error);
                            },
                        });
                       

                    },
                    onError: (error) => {
                        console.error('Error creating task:', error);
                    },
                });
            } catch (error) {
                console.error('Error saving task:', error);
            }

        }
        console.log('value:', values);

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
        form.setFieldsValue({
            ...dataDetail,
        });
    }, [dataDetail]);
    return (
        <BaseForm id={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange}>
            <Card className="card-form" bordered={false}>

                <Row gutter={10}>
                    <Col span={12}>
                        <TextField
                            required
                            label={<FormattedMessage defaultMessage="Tên bài giảng" />}
                            name="lectureName"
                        />
                    </Col>
                    <Col span={12}>
                        <SelectField
                            label={<FormattedMessage defaultMessage="Loại bài giảng" />}
                            name="lectureKind"


                            options={[
                                { value: 1, label: 'Chương' },
                                { value: 2, label: 'Bài học' },
                            ]}
                            onChange={handleLectureKindChange}
                        />
                    </Col>
                    {lectureKind !== 1 && dataDetail?.lectureKind !== 1 && (
                        <>
                            <Col span={24}>
                                <TextField

                                    label={<FormattedMessage defaultMessage="Đường dẫn Tài liêu" />}
                                    name="urlDocument"
                                />
                            </Col>
                            <Col span={24}>
                                <RichTextField
                                    label={<FormattedMessage defaultMessage="Nội dung bài giảng" />}
                                    name="description"
                                    type="textarea"
                                    style={{ marginBottom: 20, height: 200 }}
                                />
                            </Col>
                            <Col span={24}>
                                <TextField
                                    label={<FormattedMessage defaultMessage="Mô tả Ngắn" />}
                                    name="shortDescription"
                                    type="textarea"
                                />
                            </Col>

                        </>
                    )}
                </Row>


                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};

export default LectureForm;