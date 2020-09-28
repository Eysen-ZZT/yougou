// 预期希望调用格式：
// this.$axios({ url:'/users/wxlogin' })

// this.$request({
//   url:'/users/wxlogin',
//   data:{ },
// })
// this.$request({
//   method:'POST',
//   url:'/my/orders/req_unifiedorder',
//   data:{ },
// })

const baseURL = 'https://api-hmugo-web.itheima.net/api/public/v1';
const request = (config) => {
    console.log(config);
    // 判断请求接口是否带有 /my/ 带有/my/ 的接口都需要在发送请求时携带token值 
    if (config.url.indexOf('/my/') > -1) {
        // 获取token
        const token = uni.getStorageSync('token')
            // 设置请求头
        config.header = {
            ...config.header,
            Authorization: token
        }
    }
    return new Promise((resolve, reject) => {
        uni.request({
            // 展开配置参数，如data method 等
            ...config,
            // 拼接地址
            url: baseURL + config.url,
            // 成功回调
            success: (res) => {
                // console.log(res);
                if (res.statusCode === 200) {
                    resolve(res);
                } else {
                    reject(res.errMsg);
                }
            },
            // 失败回调
            fail: (err) => {
                reject(res.errMsg);
            }
        });
    })
}

// 导出
export default request;