import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/tokens',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  var data = {refreshToken:token,uid:123456};
  return request({
    url: '/tokens/refresh',
    method: 'post',
    //params: { refreshToken:token } get
    data
  })
}

export function logout() {

  return '{code:200,data:4}'
  // request({
  //   url: '/vue-element-admin/user/logout',
  //   method: 'post'
  // })
}
