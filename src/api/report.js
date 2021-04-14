import Request from '../utils/request'

export function getDataRequest() {
  return Request({
    url: 'reports/type/1',
    method: 'get'
  })
}
