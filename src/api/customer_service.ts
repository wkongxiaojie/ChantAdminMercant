import request from '@/utils/request'

// 客服表列表
export function CustomerServiceLists(params: any) {
    return request.get({ url: '/customer_service.CustomerService/lists', params })
}

// 添加客服表
export function CustomerServiceAdd(params: any) {
    return request.post({ url: '/customer_service.CustomerService/add', params })
}

// 编辑客服表
export function CustomerServiceEdit(params: any) {
    return request.post({ url: '/customer_service.CustomerService/edit', params })
}

// 删除客服表
export function CustomerServiceDelete(params: any) {
    return request.post({ url: '/customer_service.CustomerService/delete', params })
}

// 客服表详情
export function CustomerServiceDetail(params: any) {
    return request.get({ url: '/customer_service.CustomerService/detail', params })
}

// 客服分类列表
export function CustomerServiceCateAll(params?: any) {
    return request.get({ url: '/customer_service.CustomerServiceCate/lists', params })
}

// 客服分类增加
export function CustomerServiceCateAdd(params?: any) {
    return request.post({ url: '/customer_service.CustomerServiceCate/add', params })
}

// 客服分类编辑
export function CustomerServiceCateEdit(params?: any) {
    return request.post({ url: '/customer_service.CustomerServiceCate/edit', params })
}

// 客服分类删除
export function CustomerServiceCateDel(params?: any) {
    return request.post({ url: '/customer_service.CustomerServiceCate/delete', params })
}

// 客服分类详情
export function CustomerServiceCateDetail(params?: any) {
    return request.get({ url: '/customer_service.CustomerServiceCate/detail', params })
}
