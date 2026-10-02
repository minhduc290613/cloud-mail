import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import 'dayjs/locale/vi'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import {useSettingStore} from '@/store/setting.js'

const settingStore = useSettingStore()
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.locale(settingStore.lang === 'en' ? 'en' : settingStore.lang === 'zh' ? 'zh-cn' : 'vi')
const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

export function fromNow(date) {
    const d = dayjs.utc(date).tz(timeZone)
    const now = dayjs()
    const diffSeconds = now.diff(d, 'second')
    const diffMinutes = now.diff(d, 'minute')
    const diffHours = now.diff(d, 'hour')
    const isToday = now.isSame(d, 'day')

    if (settingStore.lang === 'en') {
        if (isToday) {
            if (diffSeconds < 60) return 'Just now'
            if (diffMinutes < 60) return `${diffMinutes} min ago`
            if (diffHours < 2) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
            return d.format('hh:mm A')
        }
        return d.year() === now.year() ? d.format('MMM D') : d.format('YYYY/MM/DD')
    }
    if (settingStore.lang === 'zh') {
        if (isToday) {
            if (diffSeconds < 60) return '几秒前'
            if (diffMinutes < 60) return `${diffMinutes}分钟前`
            if (diffHours < 2) return '1小时前'
            return d.format('HH:mm')
        }
        if (now.subtract(1, 'day').isSame(d, 'day')) return `昨天 ${d.format('HH:mm')}`
        if (now.subtract(2, 'day').isSame(d, 'day')) return `前天 ${d.format('HH:mm')}`
        return d.year() === now.year() ? d.format('M月D日') : d.format('YYYY/M/D')
    }
    if (isToday) {
        if (diffSeconds < 60) return 'Vừa xong'
        if (diffMinutes < 60) return `${diffMinutes} phút trước`
        if (diffHours < 2) return `${diffHours} giờ trước`
        return d.format('HH:mm')
    }
    if (now.subtract(1, 'day').isSame(d, 'day')) return `Hôm qua ${d.format('HH:mm')}`
    if (now.subtract(2, 'day').isSame(d, 'day')) return `Hôm kia ${d.format('HH:mm')}`
    return d.year() === now.year() ? d.format('DD/MM') : d.format('DD/MM/YYYY')
}

export function formatDetailDate(time) {
    const d = dayjs.utc(time).tz(timeZone)
    const now = dayjs()
    const isSameYear = now.year() === d.year()
    if (settingStore.lang === 'en') return isSameYear ? d.format('ddd, MMM D, h:mm A') : d.format('ddd, MMM D, YYYY, h:mm A')
    if (settingStore.lang === 'zh') return d.format('YYYY年M月D日 ddd AH:mm')
    return isSameYear ? d.format('ddd, DD/MM, HH:mm') : d.format('ddd, DD/MM/YYYY, HH:mm')
}

export function tzDayjs(time) { return dayjs.utc(time).tz(timeZone) }
export function toUtc(time) { return dayjs(time).utc() }
export function setExtend(lang) { dayjs.locale(lang) }
