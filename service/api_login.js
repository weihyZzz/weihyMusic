import { diyLoginRequest } from './index'
export function getLoginCode() {
    return new Promise((resolve, reject) => {
        wx.login({
            timeout: 1000,
            success: (res) => {
                const code = res.code
                resolve(code)
            },
            fail: err => {
                console.log(err);
                reject(err)
            }
        })
    })
}
// 生成token
export function codeToToken(code) {
    return diyLoginRequest.post("/login", {code})
}
// 检查token是否过期
export function checkToken(token) {
    return diyLoginRequest.post("/auth", {}, {
        token
    })
}
// 检查session是否过期
export function checkSession() {
    return new Promise((resolve) => {
        wx.checkSession({
            success: () => {
                resolve(true)
            },
            fail: () => {
                resolve(false)
            }
        })
    })
}