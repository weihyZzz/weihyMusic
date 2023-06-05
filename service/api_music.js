import diyRequest from './index'
export function getBanners() {
    return diyRequest.get("/banner", {
        type: 2
    })
}