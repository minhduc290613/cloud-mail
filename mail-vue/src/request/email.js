import http from '@/axios/index.js';

export function emailList(accountId, allReceive, emailId, timeSort, size, type, full, folder = 'inbox') {
    return http.get('/email/list', {params: {accountId, allReceive, emailId, timeSort, size, type, full, folder}})
}

export function emailDelete(emailIds) {
    return http.delete('/email/delete?emailIds=' + emailIds)
}

export function emailMove(emailIds, folder) {
    return http.put('/email/folder', {emailIds, folder})
}

export function emailLatest(emailId, accountId, allReceive) {
    return http.get('/email/latest', {params: {emailId, accountId, allReceive}, noMsg: true, timeout: 35 * 1000})
}

export function emailRead(emailIds) {
    return http.put('/email/read', {emailIds})
}

export function emailSend(form,progress) {
    return http.post('/email/send', form,{
        onUploadProgress: (e) => {
            progress(e)
        },
        noMsg: true
    })
}
