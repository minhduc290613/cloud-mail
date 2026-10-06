import { defineStore } from 'pinia'

export const useSettingStore = defineStore('setting', {
    state: () => ({
        domainList: [],
        settings: {
            r2Domain: '',
            loginOpacity: 1.00,
        },
        lang: 'vi',
        dashboard: {
            background: '',
            overlay: 0.08,
            transparency: 50,
            surfaceOpacity: 0.5,
            accent: '#6d5dfc'
        },
        mailTemplates: [],
        defaultMailTemplateId: 'welcome',
    }),
    actions: {

    },
    persist: {
        pick: ['lang', 'dashboard', 'mailTemplates', 'defaultMailTemplateId'],
    },
})
