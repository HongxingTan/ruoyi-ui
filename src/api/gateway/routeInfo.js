import request from '@/utils/request'

// 查询路由信息列表
export function listRouteInfo(query) {
  return request({
    url: '/gateway/routeInfo/list',
    method: 'get',
    params: query
  })
}

// 查询路由信息详细
export function getRouteInfo(id) {
  return request({
    url: '/gateway/routeInfo/' + id,
    method: 'get'
  })
}

// 新增路由信息
export function addRouteInfo(data) {
  return request({
    url: '/gateway/routeInfo',
    method: 'post',
    data: data
  })
}

// 修改路由信息
export function updateRouteInfo(data) {
  return request({
    url: '/gateway/routeInfo',
    method: 'put',
    data: data
  })
}

// 删除路由信息
export function delRouteInfo(id) {
  return request({
    url: '/gateway/routeInfo/' + id,
    method: 'delete'
  })
}

// 导出路由信息
export function exportRouteInfo(query) {
  return request({
    url: '/gateway/routeInfo/export',
    method: 'get',
    params: query
  })
}