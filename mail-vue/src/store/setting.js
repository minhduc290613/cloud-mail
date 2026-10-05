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
            surfaceOpacity: 0.58,
            accent: '#6d5dfc'
        },
    }),
    actions: {

    },
    persist: {
        pick: ['lang', 'dashboard'],
    },
})
