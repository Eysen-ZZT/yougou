<template>
    <view class="content">
        <view class="tabs">
            <view
                :class="{ 'tabs-item': true, active: current == index }"
                v-for="(item, index) in tabs"
                :key="index"
                @click="handleClass(index)"
                >{{ item }}</view
            >
        </view>
        <view class="order-item-list">
            <view class="order-item"> </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            tabs: ["全部", "待付款", "待发货"],
            current: 0,
        }
    },
    onLoad() {
        this.getOrderList()
    },
    methods: {
        // 获取全部订单列表
        async getOrderList() {
            const token = uni.getStorageSync("token")
            const res = await uni.request({
                url:
                    "https://api-hmugo-web.itheima.net/api/public/v1/my/orders/all",
                data: {
                    type: this.current + 1,
                },
                header: {
                    Authorization: token,
                },
            })
            console.log(res)
        },
        // 切换类名
        handleClass(index) {
            this.current = index
            this.getOrderList()
        },
    },
}
</script>

<style lang="scss">
.content {
    width: 750rpx;
    .tabs {
        height: 88rpx;
        display: flex;
        justify-content: space-around;
        align-items: center;
        background-color: #f2f2f2;
        .tabs-item {
            width: 184rpx;
            height: 88rpx;
            box-sizing: border-box;
            border-bottom: 3rpx solid transparent;
            text-align: center;
            line-height: 88rpx;
        }
        .active {
            border-bottom: 3rpx solid #ff2262;
        }
    }
}
</style>
