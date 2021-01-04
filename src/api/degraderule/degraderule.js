import request from '@/utils/request'

// 查询熔断降级列表
export function listDegraderule(query) {
  return request({
    url: '/degraderule/degraderule/list',
    method: 'get',
    params: query
  })
}

// 查询熔断降级详细
export function getDegraderule(degradeRuleId) {
  return request({
    url: '/degraderule/degraderule/' + degradeRuleId,
    method: 'get'
  })
}

// 新增熔断降级
export function addDegraderule(data) {
  return request({
    url: '/degraderule/degraderule',
    method: 'post',
    data: data
  })
}

// 修改熔断降级
export function updateDegraderule(data) {
  return request({
    url: '/degraderule/degraderule',
    method: 'put',
    data: data
  })
}

// 删除熔断降级
export function delDegraderule(degradeRuleId) {
  return request({
    url: '/degraderule/degraderule/' + degradeRuleId,
    method: 'delete'
  })
}

// 导出熔断降级
export function exportDegraderule(query) {
  return request({
    url: '/degraderule/degraderule/export',
    method: 'get',
    params: query
  })
}