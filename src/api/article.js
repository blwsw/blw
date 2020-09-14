import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/users',
    method: 'get',
    params: query
  })
}

export function fetchArticle(id) {
  return request({
    url: '/vue-element-admin/article/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/vue-element-admin/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return request({
    url: '/users',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/users/'+data.id,
    method: 'put',
    // params:{id:data.id},
    data
  })
}

export function fetchEventLog(obj) {
  return request({
    url: '/eventLog',
    method: 'get',
    params: obj
  })
}
export function fetchHistory(obj) {
  return request({
    url: '/get/history',
    method: 'get',
    params: obj
  })
}
export function fetchEvent(obj) {

  if(!obj.methods){
    obj.methods = 'get'
  }
  var requestParam = {
    url: '/' + obj.url,
    method: obj.methods
  };

  if(obj.methods =='get'){
    requestParam['params'] = obj.data;
  }else{
    requestParam['data'] = obj.data;
    if(obj.params){
      requestParam['params'] = obj.params;
    }
  }

  return request(requestParam);
}
