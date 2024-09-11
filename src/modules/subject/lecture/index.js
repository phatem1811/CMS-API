import BaseTable from '@components/common/table/BaseTable';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import { Button, Modal, Tag } from 'antd';
import React, { useEffect, useState, useCallback } from 'react';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import { AppConstants, categoryKind, DEFAULT_FORMAT, DATE_FORMAT_DISPLAY, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import useTranslate from '@hooks/useTranslate';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useNavigate, useLocation, useParams } from "react-router-dom";
import routes from '../route';
import useFetch from '@hooks/useFetch';
import { FieldTypes } from '@constants/formConfig';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useContext, useMemo } from 'react';
import { HolderOutlined } from '@ant-design/icons';
import { DndContext } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Table } from 'antd';
const RowContext = React.createContext({});

const DragHandle = () => {
    const { setActivatorNodeRef, listeners } = useContext(RowContext);
    return (
        <Button
            type="text"
            size="small"
            icon={<HolderOutlined />}
            style={{
                cursor: 'move',
            }}
            ref={setActivatorNodeRef}
            {...listeners}
        />
    );
};
const Row = (props) => {
    const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
        id: props['data-row-key'],
    });
    const style = {
        ...props.style,
        transform: CSS.Translate.toString(transform),
        transition,
        ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
    };
    const contextValue = useMemo(
        () => ({
            setActivatorNodeRef,
            listeners,
        }),
        [setActivatorNodeRef, listeners],
    );
    return (
        <RowContext.Provider value={contextValue}>
            <tr {...props} ref={setNodeRef} style={style} {...attributes} />
        </RowContext.Provider>
    );
};


dayjs.extend(customParseFormat);

const message = defineMessages({
    objectName: 'Môn học',

});

const LectureListPage = () => {
    const { id: subjectId } = useParams();

    console.log('subjectId', subjectId);

    const { data: dataLecture } = useFetch(apiConfig.lecture.getBySubject, {
        pathParams: { id: subjectId },
        immediate: true,
        mappingData: (response) => response.data.content,
    });
    const translate = useTranslate();

    const [dataSource, setDataSource] = useState([]);
    const [updatedata, setUpdatedata] = useState([]);
    const { pathname: pagePath } = useLocation();
    const [selectedRowId, setSelectedRowId] = useState(null); 
    const [nextOrdering, setNextOrdering] = useState(null);
    useEffect(() => {
        if (dataLecture) {
            const sortData = [...dataLecture].sort((a, b) => a.ordering - b.ordering);
            setDataSource(sortData);
        }
    }, [dataLecture]);

    const handleDragEnd = (({ active, over }) => {
        if (active.id !== over?.id) {
            setDataSource((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);

                const updatedItems = arrayMove(items, oldIndex, newIndex);
                const reorderedItems = updatedItems.map((item, index) => ({
                    ...item,
                    ordering: index,
                }));
                setUpdatedata(reorderedItems);

                return reorderedItems;
            });
        }
    });

    const { execute: updateSortLecture } = useFetch(apiConfig.lecture.updateSort, {
        immediate: false,
    });


    const { data, mixinFuncs } = useListBase({
        apiConfig: apiConfig.lecture,
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
            funcs.getCreateLink = () => {
                if( selectedRowId ) {
                    const currentUrl = new URL(window.location.href);

                    return `${pagePath}/create?nextOrdering=${nextOrdering}`;

                }
                return `${pagePath}/create`;
                
            };
        },
    });
    const handleUpdatePositions = async() => {    
        try {
            await updateSortLecture({            
                data: updatedata,
                onCompleted: (response) => {
                    console.log('successfully:', response);
                },
                onError: (error) => {
                    console.error('Error creating :', error);
                },
            });
        } catch (error) {
            console.error('Error saving :', error);
        }
    };

    const findNextOrdering = (dataSource, currentIndex) => {
 
        for (let i = currentIndex + 1; i < dataSource.length; i++) {
            if (dataSource[i].lectureKind === 1) {
                return dataSource[i].ordering;
            }
        }
       
        return null;
    };
    const handleClick = (record) => {
        const { id, lectureKind } = record;
        const currentIndex = dataSource.findIndex(item => item.id === id);
        setSelectedRowId(id); 
        if (currentIndex >= 0) {
            const nextOrdering = findNextOrdering(dataSource, currentIndex);
            setNextOrdering(nextOrdering);
            if (nextOrdering) {
                console.log("Nearest ordering:",nextOrdering);
            } else {
                console.log("No nearest lecture with lectureKind = 1 found.");
            }
        }
    };
    const getRowStyle = (record) => ({
        backgroundColor: record.id === selectedRowId ? '#d3d3d3' : 'transparent', 
        cursor: 'pointer',
    });
    

    const columns = [
        {
            key: 'sort',
            align: 'center',
            width: 10,
            render: () => <DragHandle />,
        },
        {
            title: <FormattedMessage defaultMessage="Tên bài giảng" />,
            dataIndex: 'lectureName',
            width: 20,
            render: (lectureName, record) => {
                const { id, lectureKind } = record;

                return (
                    <div
                        onClick={() => handleClick(record)}
                        style={{
                            display: 'flex',
                            cursor: lectureKind === 1 ? 'pointer' : 'default',
                            width: '100%',
                            height: '500%', 
                    
                        }}
                    >
                        <span
                            style={{
                                fontWeight: lectureKind === 1 ? 'bold' : 'normal',
                                textTransform: lectureKind === 1 ? 'uppercase' : 'none',
                                marginLeft: lectureKind === 2 ? '30px' : '0',
                                flex: 1,
                            }}
                        >
                            {lectureName}
                        </span>
                    </div>
                );
            },
        },
        mixinFuncs.renderActionColumn(
            {
                edit: true,
                delete: true,
            },
            { width: '80px' },
        ),
    ];


    return (
        <PageWrapper
            routes={[
                { breadcrumbName: <FormattedMessage defaultMessage="Môn học" />, path: routes.SubjectListPage.path },
                { breadcrumbName: <FormattedMessage defaultMessage="Bài giảng" /> },
            ]}
        >
            <ListPage
                actionBar={
                    <div style={{ width: '36%', margin: '0 auto' }}>
                        {mixinFuncs.renderActionBar()}
                    </div>
                }
                baseTable={
                    <>
                        <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={handleDragEnd}>
                            <SortableContext
                                items={dataSource.map((item) => item.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <Table
                                    rowKey="id"
                                    components={{ body: { row: Row } }}
                                    columns={[...columns]}
                                    dataSource={dataSource}
                                    pagination={false}
                                    style={{ width: '70%' }}
                                    onRow={(record) => ({                                     
                                        style: getRowStyle(record), 
                                    })}
                                />
                            </SortableContext>
                        </DndContext>
                        <div style={{ marginLeft: 650 }}>
                            <Button onClick={handleUpdatePositions} type="primary">
                                Cập nhật vị trí
                            </Button>
                        </div>


                    </>
                }

            />
        </PageWrapper>
    );
};
export default LectureListPage;