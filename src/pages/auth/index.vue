<template>
    <view class="content">
        <button open-type="getUserInfo" @tap="getUserInfo" class="btn">
            授权微信登录
        </button>
    </view>
</template>

<script>
export default {
    data() {
        return {}
    },
    onLoad() {},
    methods: {
        getUserInfo() {},
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
