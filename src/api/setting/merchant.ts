import request from '@/utils/request'


// 获取网站信息
export function getConfig() {
    return request.get({ url: '/setting/getConfig' })
}
// 设置网站信息
export function setConfig(params: any) {
    return request.post({ url: '/setting/setConfig', params })
}