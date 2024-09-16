import BaseTable from '@components/common/table/BaseTable';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import { Button, Modal, Tag, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { EyeOutlined, UserOutlined, UsergroupDeleteOutlined, ContainerOutlined } from '@ant-design/icons';
import AvatarField from '@components/common/form/AvatarField';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import { AppConstants, categoryKind, DEFAULT_FORMAT, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import { FieldTypes } from '@constants/formConfig';
import { stateResgistration } from '@constants/masterData';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import useDisclosure from '@hooks/useDisclosure';
import useTranslate from '@hooks/useTranslate';
import { CheckOutlined } from '@ant-design/icons';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useLocation, useNavigate } from 'react-router-dom';
import useFetch from '@hooks/useFetch';

import routes from '../route';
const message = defineMessages({
    objectName: 'Registration Course',
});

const RegistrationProject = () => {
    const translate = useTranslate();
    const statusValues = translate.formatKeys(stateResgistration, ['label']);
    const [isOpen, { open, close }] = useDisclosure();
    const location = useLocation();
    const { pathname: pagePath } = useLocation();


    const currentUrl = new URL(window.location.href);
    const searchParams = new URLSearchParams(currentUrl.search);
    const courseName = searchParams.get('courseName');
    const courseState = searchParams.get('courseState');
    const courseStatus = searchParams.get('courseStatus');
    const studentId = searchParams.get('studentId');
    const studentName = searchParams.get('studentName');
    const registrationId = searchParams.get('registrationId');
    const courseId = searchParams.get('courseId');

    const stateValues = translate.formatKeys(stateResgistration, ['label']);
    const { data, mixinFuncs, queryFilter, loading, pagination } = useListBase({
        apiConfig: apiConfig.registrationProject,
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,

        },
        override: (funcs) => {
            funcs.mappingData = (response) => {
                if (response.result === true) {
                    return {
                        data: response.data.content,
                        total: response.data.totalElements,
                    };
                }
            };
            funcs.additionalActionColumnButtons = () => {
                return {
                    done: (record) => {
                        const { id, isDone } = record;

                        return (
                            <BaseTooltip title={isDone ? "Đã hoàn thành" : "Hoành thanh dự án"}>
                                <Button
                                    type="link"
                                    style={{ padding: 0, color: isDone ? 'grey' : 'blue' }}
                                    onClick={() => handleIconClick(id)}
                                    disabled={isDone}
                                >
                                    <CheckOutlined
                                        twoToneColor={isDone ? 'grey' : 'blue'}
                                    />
                                </Button>
                            </BaseTooltip>
                        );
                    },


                };
            };

            funcs.getCreateLink = () => {
                return `${pagePath}/create?studentId=${studentId}&studentName=${encodeURIComponent(
                    studentName,
                )}&registrationId=${registrationId}&courseId=${courseId}&courseName=${encodeURIComponent(
                    courseName,
                )}&courseState=${courseState}&courseStatus=${courseStatus}`;
            };

        },
    });

    const { execute: updateRegisterProject } = useFetch(apiConfig.registrationProject.update,
        {
            immediate: false,
        },
    );
    const [id, setId] = useState(null);
    const handleIconClick = (id) => {
        setId(id);
        open();
    };
    const handleOk = async () => {
        console.log("check id",id);
        const isDone = true;
        const formvalue = {
            id : id,
            isDone : true,
        };
        try {
            await updateRegisterProject({
                method: 'PUT',
                data: formvalue,
                onCompleted: (response) => {

                    close();
                    mixinFuncs.handleFetchList();

                },
                onError: (error) => {
                    console.error('Error creating task:', error);
                },
            });
        } catch (error) {
            console.error('Error saving task:', error);
        }
    };

    const columns = [
        {
            title: '#',
            dataIndex: ['project', 'avatar'],
            align: 'center',
            width: 70,
            render: (avatar) => (
                <AvatarField
                    size="large"
                    icon={<UserOutlined />}
                    src={avatar ? `${AppConstants.contentRootUrl}${avatar}` : null}
                />
            ),
        },
        {
            title: 'Tên dự án',
            dataIndex: ['project', 'name'],
            width: 500,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isDone',
            width: 100,
            align: 'center',
            render: (isDone) => {
                if (isDone) {
                    return <Tag color="green">Hoàn thành</Tag>;
                } else {
                    return <Tag color="yellow">Chưa hoàn thành</Tag>;
                }
            },
        },
        mixinFuncs.renderActionColumn(
            {
                done: true,
                delete: true,
            },
            { width: '180px', fixed: 'right' },
        ),
    ];

    return (
        <PageWrapper
            routes={[
                { breadcrumbName: 'Học sinh', path: routes.StudentListPage.path },
                { breadcrumbName: 'Khóa học', path: `/student/course?studentId=${studentId}&studentName=${studentName}` },
                { breadcrumbName: 'Đăng kí dự án' },
            ]}
        >
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({ initialValues: queryFilter })}
                actionBar={mixinFuncs.renderActionBar()}
                title={studentName}
                baseTable={
                    <BaseTable
                        onChange={mixinFuncs.changePagination}
                        columns={columns}
                        dataSource={data}
                        pagination={pagination}
                        scroll={{ x: 'max-content' }}
                    />
                }
            />


            <Modal
                title="Thay đổi trạng thái hoàn thành dự án"
                open={isOpen}
                onOk={handleOk}
                onCancel={close}
            >
                {/* <p>Content of the modal</p> */}
            </Modal>
        </PageWrapper>
    );
};

export default RegistrationProject;