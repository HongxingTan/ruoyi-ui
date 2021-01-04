import request from '@/utils/request'

// 查询网关限流列表
export function listGatewayflowrule(query) {
  return request({
    url: '/gatewayflowrule/gatewayflowrule/list',
    method: 'get',
    params: query
  })
}

// 查询网关限流详细
export function getGatewayflowrule(gatewayFlowRuleId) {
  return request({
    url: '/gatewayflowrule/gatewayflowrule/' + gatewayFlowRuleId,
    method: 'get'
  })
}

// 新增网关限流
export function addGatewayflowrule(data) {
  return request({
    url: '/gatewayflowrule/gatewayflowrule',
    method: 'post',
    data: data
  })
}

// 修改网关限流
export function updateGatewayflowrule(data) {
  return request({
    url: '/gatewayflowrule/gatewayflowrule',
    method: 'put',
    data: data
  })
}

// 删除网关限流
export function delGatewayflowrule(gatewayFlowRuleId) {
  return request({
    url: '/gatewayflowrule/gatewayflowrule/' + gatewayFlowRuleId,
    method: 'delete'
  })
}

// 导出网关限流
export function exportGatewayflowrule(query) {
  return request({
    url: '/gatewayflowrule/gatewayflowrule/export',
    method: 'get',
    params: query
  })
}