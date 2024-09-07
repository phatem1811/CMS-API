import PageWrapper from '@components/common/layout/PageWrapper';
import ListPage from '@components/common/layout/ListPage';
import BaseTable from '@components/common/table/BaseTable';
import useListBase from '@hooks/useListBase';
import apiConfig from '@constants/apiConfig';
import React from 'react';
import DatePickerField from '@components/common/form/DatePickerField';
import {  Row, Col, Card, Input } from 'antd';
// import { defineMessages, FormattedMessage } from 'react-intl';
import { defineMessages, FormattedMessage } from 'react-intl';
import useTranslate from '@hooks/useTranslate';
import { DEFAULT_TABLE_ITEM_SIZE } from '@constants/index';
import { Navigate, useLocation , useNavigate } from 'react-router-dom';
import { statusOptions } from '@constants/masterData';
import { commonMessage } from '@locales/intl';
import { BaseForm } from '@components/common/form/BaseForm';
import useFetch from '@hooks/useFetch';
import { CheckCircleOutlined } from '@ant-design/icons';
import { Radio, Button, Modal } from 'antd';
import { useState } from 'react';
import useDisclosure from '@hooks/useDisclosure';
import TextField from '@components/common/form/TextField';
import { useForm } from 'antd/es/form/Form';    
import { DATE_FORMAT_DISPLAY, DATE_FORMAT_VALUE, DEFAULT_FORMAT } from '@constants/index';
import { formatDateString } from '@utils/index';

// const message = defineMessages({
//     id: 'course.objectName',
//     objectName: 'Bài giảng',
// });

const CreateTask = () => {
    const location = useLocation();
    const queryString = location.search;
    const [form] = useForm();
    const [isOpen, { open, close }] = useDisclosure(false);
    const params = new URLSearchParams(queryString);
    const subjectId = params.get('subjectId');
    const courseId = params.get('courseId');
    const [selectedLecture, setselectedLecture] = useState(null);
    const navigate = useNavigate();
    const handleRadioChange = (e) => {
        setselectedLecture(e.target.value); 
    };

    const translate = useTranslate();
    const statusValues = translate.formatKeys(statusOptions, ['label']);

    const {  execute } = useFetch(apiConfig.task.asignAll, {
        immediate: false,
    });

    const { data: dataTaskCourse } = useFetch(apiConfig.task.coursetask, {
        pathParams: { id: courseId },
        immediate: true,
        mappingData: (response) => response.data.content,
    });


    const { data: dataListTask } = useFetch(apiConfig.lecture.getBySubject, {
        pathParams: { id: subjectId },
        immediate: true,
        mappingData: (response) => response.data.content,
    });

    const lectureIds = dataTaskCourse?.map(task => task.lecture?.id) || [];
    console.log("check data task cource", lectureIds);
    const handleCreateTaskClick = () => {
        open();
    };
    const handleSubmit = async (values) => {
        values.startDate = formatDateString(values.startDate, DEFAULT_FORMAT);
        values.dueDate = formatDateString(values.dueDate, DEFAULT_FORMAT);
        const formData = {
            ...values,
            courseId,             
            lectureId: selectedLecture ,
        };
        console.log("check value", formData);
        try {
            await execute({
                method: 'POST', 
                data: formData,
                onCompleted: (response) => {
                    console.log('Task created successfully:', response);
                    // setIsOpen(false); // Close the modal after successful submission
                    navigate( `/course/task${queryString}`);

                },
                onError: (error) => {
                    console.error('Error creating task:', error);
                },
            });
        } catch (error) {
            console.error('Error saving task:', error); // Handle any errors
        }
    };



    const columns = [
        {
            title: <FormattedMessage defaultMessage="Tên bài giảng" />,
            dataIndex: 'lectureName',
            width: '50%',
            render: (lectureName, record) => {
                const { id, lectureKind } = record;
                const isChecked = lectureIds.includes(id);
                const isSelected = selectedLecture === id;
                const showRadio = lectureKind !== 1;

                return (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                    }}>
                        <span style={{
                            fontWeight: lectureKind === 1 ? 'bold' : 'normal',
                            textTransform: lectureKind === 1 ? 'uppercase' : 'none',
                            marginLeft: lectureKind === 2 ? '30px' : '0',
                            flex: 1,
                        }}>
                            {lectureName}
                        </span>
                        {isChecked ? (
                            <CheckCircleOutlined style={{ color: 'green' }} />
                        ) : (
                            showRadio && (
                                <Radio
                                    checked={isSelected}
                                    value={id}
                                    onChange={handleRadioChange}
                                />
                            )
                        )}
                    </div>
                );
            },
        },
    ];

    return (
        <PageWrapper routes={[
            { breadcrumbName: 'bài giảng' },
        ]}>
            <BaseForm>
                <ListPage >
                    <div style={{ textAlign: 'right', marginBottom: '10px' }}>
                        <Button
                            type="primary"
                            style={{ marginTop: '16px' }}
                            disabled={selectedLecture === null}
                            onClick={handleCreateTaskClick}
                        >
                            Tạo Task
                        </Button>
                    </div>
                    <BaseTable

                        columns={columns}
                        dataSource={dataListTask}

                    />

                </ListPage>
            </BaseForm>
            <Modal
                title="Tạo Task"
                open={isOpen}
                onCancel={close}
                footer={null}
                width={950} 
                style={{ top: 20 }} 
            >
                <BaseForm
                    id="create-task-form"
                    onFinish={handleSubmit}
                    form={form}
                    style={{ margin: 0 }}
                >
                    <Card className="card-form" bordered={false} style={{ margin: 0 }}>
                        <Row gutter={10}>
                            <Col span={12}>
                                <DatePickerField
                                    name="startDate"
                                    label={<FormattedMessage defaultMessage="Ngày bắt đầu" />}
                                    placeholder="Ngày bắt đầu"
                                    format={DEFAULT_FORMAT}
                                    style={{ width: '100%' }}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng chọn ngày bắt đầu',
                                        },
                                    ]}
                                    showTime={{ format: 'HH:mm:ss' }}
                                />
                            </Col>
                            <Col span={12}>
                                <DatePickerField
                                    name="dueDate"
                                    label={<FormattedMessage defaultMessage="Ngày kết thúc" />}
                                    placeholder="Ngày kết thúc"
                                    format={DEFAULT_FORMAT}
                                    style={{ width: '100%' }}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng chọn ngày kết thúc',
                                        },
                                    ]}
                                    showTime={{ format: 'HH:mm:ss' }}
                                />
                            </Col>
                        </Row>
                        <div style={{ marginTop: '16px' }}>
                        
                            <TextField
                                required
                                label={<FormattedMessage defaultMessage="Chú ý" />}
                                name="note"
                                type="textarea"
                            />
                        </div>
                        <div className="footer-card-form" style={{ marginTop: '16px', textAlign: 'right' }}>
                            <Button type="primary" htmlType="submit">
                                Lưu
                            </Button>
                        </div>
                    </Card>
                </BaseForm>
            </Modal>
        </PageWrapper>
    );
};

export default CreateTask;