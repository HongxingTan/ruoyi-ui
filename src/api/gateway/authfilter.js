import request from '@/utils/request'

// 查询权限拦截器列表
export function listAuthfilter(query) {
  return request({
    url: '/gateway/authfilter/list',
    method: 'get',
    params: query
  })
}

// 查询权限拦截器详细
export function getAuthfilter(id) {
  return request({
    url: '/gateway/authfilter/' + id,
    method: 'get'
  })
}

// 新增权限拦截器
export function addAuthfilter(data) {
  return request({
    url: '/gateway/authfilter',
    method: 'post',
    data: data
  })
}

// 修改权限拦截器
export function updateAuthfilter(data) {
  return request({
    url: '/gateway/authfilter',
    method: 'put',
    data: data
  })
}

// 删除权限拦截器
export function delAuthfilter(id) {
  return request({
    url: '/gateway/authfilter/' + id,
    method: 'delete'
  })
}

// 导出权限拦截器
export function exportAuthfilter(query) {
  return request({
    url: '/gateway/authfilter/export',
    method: 'get',
    params: query
  })
}

export function getAuthData(id) {
  return request({
    url: '/gateway/authfilter/getAuthData/' + id,
    method: 'get'
  })
}
