import PageWrapper from '@components/common/layout/PageWrapper';
import useTranslate from '@hooks/useTranslate';
import { Card, Tabs } from 'antd';
import React, { useState } from 'react';
import { defineMessages } from 'react-intl';

import { settingGroups } from '@constants/masterData';
import routes from '@routes';
import StoryListPage from './Story';
const message = defineMessages({
    members: 'Thành viên',
    story: 'Story',

});

const ProjectDetailListPage = () => {

    const translate = useTranslate();
    const [activeTab, setActiveTab] = useState(
        localStorage.getItem(routes.settingsPage.keyActiveTab)
            ? localStorage.getItem(routes.settingsPage.keyActiveTab)
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
                    onTabClick={(key) => {
                        setActiveTab(key);
                        localStorage.setItem(routes.settingsPage.keyActiveTab, key);
                    }}
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
                            // children: activeTab == settingGroups.PAGE ,
                        },

                    ]}
                />
            </Card>
        </PageWrapper>
    );
};
export default ProjectDetailListPage;