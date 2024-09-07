import { STATUS_ACTIVE, STATUS_INACTIVE, STATUS_PENDING,PROVINCE_KIND,DISTRICT_KIND,VILLAGE_KIND } from '@constants';
import { defineMessages } from 'react-intl';
import {
    nationKindMessage,
    actionMessage,
} from './intl';

const commonMessage = defineMessages({
    statusActive: 'Active',
    statusPending: 'Pending',
    statusInactive: 'Inactive',
});

export const languageOptions = [
    { value: 1, label: 'EN' },
    { value: 2, label: 'VN' },
    { value: 3, label: 'Other' },
];

export const orderOptions = [
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
];

export const commonStatus = [
    { value: STATUS_ACTIVE, label: 'Active', color: 'green' },
    { value: STATUS_PENDING, label: 'Pending', color: 'warning' },
    { value: STATUS_INACTIVE, label: 'Inactive', color: 'red' },
];

export const statusOptions = [
    { value: STATUS_ACTIVE, label: commonMessage.statusActive, color: '#00A648' },
    { value: STATUS_PENDING, label: commonMessage.statusPending, color: '#FFBF00' },
    { value: STATUS_INACTIVE, label: commonMessage.statusInactive, color: '#CC0000' },
];
export const STATE_TASK_ASIGN = 1;
export const STATE_TASK_DONE = 2;

export const STATE_COURSE_PREPARED = 1;
export const STATE_COURSE_STARTED = 2;
export const STATE_COURSE_FINISHED = 3;
export const STATE_COURSE_CANCELED = 4;
export const STATE_COURSE_RECRUITED = 5;

export const STATE_PROJECT_CREATE = 1;
export const STATE_PROJECT_RUNNING = 2;
export const STATE_PROJECT_DONE = 3;
export const STATE_PROJECT_CANCEL = 4;
export const STATE_PROJECT_FAILED = 5;

export const projectStateMessage = defineMessages({
    create: 'Đang tạo',
    running: 'Đang xử lí',
    done:'hoàn tất',  
    cancel: 'Đã hủy',
    failed: 'thất bại',
});



export const courseStatusMessage = defineMessages({
    prepare: 'Chưa bắt đầu',
    started: 'Đã bắt đầu',
    finished:'Đã kết thúc',
    recruited: 'Chiêu sinh',
    cancled: 'Đã hủy',
});

export const taskStateMessage = defineMessages({
    asign: 'Đang làm',
    done: 'Hoàn thành',
});

export const formSize = {
    small: '700px',
    normal: '800px',
    big: '900px',
};

export const nationKindOptions = [
    {
        value: PROVINCE_KIND,
        label: nationKindMessage.province,
    },
    {
        value: DISTRICT_KIND,
        label: nationKindMessage.district,
    },
    {
        value: VILLAGE_KIND,
        label: nationKindMessage.village,
    },
];

export const kindPost = [
    {
        value: 1,
        label: 'Post',
        color: 'green',
    },
    {
        value: 2,
        label: 'Story',
        color: 'blue',
    },
   
];

export const settingGroups = {
    GENERAL: 'general',
    PAGE: 'page_config',
    REVENUE: 'revenue_config',
    TRAINING: 'training_config',
};
export const dataTypeSetting = {
    INT: 'int',
    STRING: 'string',
    BOOLEAN: 'boolean',
    DOUBLE: 'double',
    RICHTEXT: 'richtext',
};

export const settingKeyName = {
    MONEY_UNIT: 'money_unit',
    TRAINING_UNIT: 'training_percent',
    BUG_UNIT: 'training_project_percent',
    NUMBER_OF_TRAINING_PROJECT: 'number_of_training_projects',
};


export const actionOptions = [
    {
        value: 1,
        label: actionMessage.contactForm,
    },
    { value: 2, label: actionMessage.navigation },
];