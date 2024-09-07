import React from 'react';

import { categoryKind } from '@constants';
import CategoryListPageCommon from '@components/common/page/category';
import { defineMessages, useIntl } from 'react-intl';

const message = defineMessages({
    home: 'Home',
    newsCategory: 'News Category',
});

const CategoryListPage = () => {
    const intl = useIntl();

    return (
        <CategoryListPageCommon
            routes={[{ breadcrumbName: intl.formatMessage(message.newsCategory) }]}
            kind={categoryKind.news}
        />
    );
};

export default CategoryListPage;
