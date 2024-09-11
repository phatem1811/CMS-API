import PageWrapper from '@components/common/layout/PageWrapper';
import useTranslate from '@hooks/useTranslate';
import { Card, Tabs } from 'antd';
import React, { useState } from 'react';
import { defineMessages } from 'react-intl';
import { settingGroups } from '@constants/masterData';
import routes from '@routes';
import StoryListPage from './Story';
import MemberListPage from './member';
import { useLocation, useNavigate } from 'react-router-dom'; 
const message = defineMessages({
    members: 'Thành viên',
    story: 'Story',
});
const ProjectDetailListPage = () => {
    const translate = useTranslate();
    const navigate = useNavigate(); 
    const location = useLocation();
    const handleTabClick = (key) => {
        setActiveTab(key);
        localStorage.setItem(routes.ProjectDetailListPage.keyActiveTab, key);

        if (key === 'members') {
           
            const params = new URLSearchParams(location.search);
            params.delete('developerId');
            params.delete('status');
            navigate({ search: params.toString() }); 
        }
    };

    const [activeTab, setActiveTab] = useState(
        localStorage.getItem(routes.ProjectDetailListPage.keyActiveTab)
            ? localStorage.getItem(routes.ProjectDetailListPage.keyActiveTab)
            : settingGroups.PAGE,
    );
    return (
        <PageWrapper routes={[
            { breadcrumbName: 'Dự án', path: routes.ProjectListPage.path },
            { breadcrumbName: 'Conference and Event Management System' },
        ]}>
            <Card className="card-form" bordered={false}>
                <Tabs
                    type="card"
                    onTabClick={handleTabClick}
                    
                    activeKey={activeTab}
                    items={[
                        {
                            key: 'Story',
                            label: translate.formatMessage(message.story),
                            // children: activeTab == settingGroups.GENERAL,
                            children: <StoryListPage />,
                        },
                        {
                            key: 'members',
                            label: translate.formatMessage(message.members),
                     
                            children: <MemberListPage />,
                        },

                    ]}
                />
            </Card>
        </PageWrapper>
    );
};
export default ProjectDetailListPage;