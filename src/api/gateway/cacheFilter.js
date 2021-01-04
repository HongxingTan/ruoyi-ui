import request from '@/utils/request'

// 查询结果缓存配置列表
export function listCacheFilter(query) {
  return request({
    url: '/gateway/cacheFilter/list',
    method: 'get',
    params: query
  })
}

// 查询结果缓存配置详细
export function getCacheFilter(id) {
  return request({
    url: '/gateway/cacheFilter/' + id,
    method: 'get'
  })
}

// 新增结果缓存配置
export function addCacheFilter(data) {
  return request({
    url: '/gateway/cacheFilter',
    method: 'post',
    data: data
  })
}

// 修改结果缓存配置
export function updateCacheFilter(data) {
  return request({
    url: '/gateway/cacheFilter',
    method: 'put',
    data: data
  })
}

// 删除结果缓存配置
export function delCacheFilter(id) {
  return request({
    url: '/gateway/cacheFilter/' + id,
    method: 'delete'
  })
}

// 导出结果缓存配置
export function exportCacheFilter(query) {
  return request({
    url: '/gateway/cacheFilter/export',
    method: 'get',
    params: query
  })
}
