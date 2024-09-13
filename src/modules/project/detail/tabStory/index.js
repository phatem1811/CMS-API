import PageWrapper from '@components/common/layout/PageWrapper';
import useTranslate from '@hooks/useTranslate';
import { Card, Tabs } from 'antd';
import React, { useState, useEffect } from 'react';
import { defineMessages } from 'react-intl';

import routes from '@routes';
import { useLocation, useNavigate } from 'react-router-dom';
import TaskTab from './TaskTab';
import TestPlanTab from './TestPlanTab';
import { FormattedMessage } from 'react-intl';



const message = defineMessages({
    task: 'Task',
    testplan: 'Test Plan',
   
});
const StoryTabs = () => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const location = useLocation();
    
    const queryParams = new URLSearchParams(location.search);
    const projectName = queryParams.get('projectName');
    const storyName = queryParams.get('storyName');
    const projectId = queryParams.get('projectId');


    const handleTabClick = (key) => {
        setActiveTab(key);

        const params = new URLSearchParams(location.search);
        params.set('activeTab', key);
        navigate(`${location.pathname}?${params.toString()}`);
        localStorage.setItem(routes.StoryTabs.keyActiveTab, key);
    };
    useEffect(() => {
        const savedTab = queryParams.get('activeTab') || localStorage.getItem(routes.StoryTabs.keyActiveTab);
        if (savedTab) {
            setActiveTab(savedTab);
        } else {
            setActiveTab('task');
        }
    }, [location.search]);
    const [activeTab, setActiveTab] = useState('task');
    return (
        <PageWrapper routes={[
            { breadcrumbName: <FormattedMessage defaultMessage="Dự án" />, path: routes.ProjectListPage.path },
            {
                breadcrumbName: projectName,
                path: `/project/project-tab?projectId=${projectId}&projectName=${projectName}&active=true`,
            },

            { breadcrumbName: storyName },
        ]}>
            <Card className="card-form" bordered={false}>
                <Tabs
                    type="card"
                    onTabClick={handleTabClick}

                    activeKey={activeTab}
                    items={[
                        {
                            key: 'Task',
                            label: translate.formatMessage(message.task),
                            children: <TaskTab />,
                        },
                        {
                            key: 'Test Plan',
                            label: translate.formatMessage(message.testplan),
                            children: <TestPlanTab />,
                        },


                    ]}
                />
            </Card>
        </PageWrapper>
    );
};
export default StoryTabs;