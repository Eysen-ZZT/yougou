<template>
    <view class="content">
        <button open-type="getUserInfo" @getuserinfo="getUserInfo" class="btn">
            授权微信登录
        </button>
        <u-toast ref="uToast" />
    </view>
</template>

<script>
export default {
    data() {
        return {}
    },
    onLoad() {},
    methods: {
        async getUserInfo(e) {
            // console.log(e.detail)
            // 获取登录请求数据
            const { iv, encryptedData, signature, rawData } = e.detail
            const res = await uni.login()
            const { code } = res[1]
            console.log(code)
            const res1 = await uni.request({
                url:
                    "https://api-hmugo-web.itheima.net/api/public/v1/users/wxlogin",
                method: "POST",
                data: {
                    encryptedData,
                    rawData,
                    iv,
                    signature,
                    code,
                },
            })
            console.log(res1)
            const { message, meta } = res1[1].data
            if (meta.msg == "登录成功") {
                const token = message.token
                // console.log(token)
                uni.setStorageSync("token", token)
                this.$refs.uToast.show({
                    title: "登录成功",
                    icon: false,
                })
                setTimeout(() => {
                    uni.navigateBack()
                }, 1000)
            } else {
                this.$refs.uToast.show({
                    title: "数据请求失败，请重新尝试",
                    icon: false,
                })
            }
        },
    },
}
</script>

<style lang="scss">
.content {
    width: 750rpx;
    height: 90vh;
    display: flex;
    justify-content: center;
    align-items: center;
    .btn {
        width: 461rpx;
        background-color: #07c160;
        color: #fff;
    }
}
</style>
