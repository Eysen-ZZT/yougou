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
        <view
            class="order-item-list"
            v-for="item in OrderList"
            :key="item.order_id"
        >
            <view class="order-item">
                <view class="item">订单编号</view>
                <view class="item-text">{{ item.order_number }}</view>
            </view>
            <view class="order-item">
                <view class="item">订单金额</view>
                <view class="item-text price">{{ item.order_price }}</view>
            </view>
            <view class="order-item">
                <view class="item">订单日期</view>
                <view class="item-text">{{
                    new Date(1601312011 * 1000).toLocaleString()
                }}</view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            // 标签选项
            tabs: ["全部", "待付款", "待发货"],
            // 当前选中tab标签
            current: 0,
            // 订单列表
            OrderList: [],
        }
    },
    onLoad() {
        this.getOrderList()
        // console.log(new Date(1601312011 * 1000).toLocaleString())
    },
    methods: {
        // 获取全部订单列表
        async getOrderList() {
            const res = await this.$request({
                url: "/my/orders/all",
                data: {
                    type: this.current + 1,
                },
            })
            console.log(res)
            this.OrderList = res.data.message.orders
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
html {
    height: 100%;
}
.content {
    width: 750rpx;
    min-height: 100vh;
    background-color: #f2f2f2;
    padding-bottom: 20rpx;
    .tabs {
        height: 88rpx;
        display: flex;
        justify-content: space-around;
        align-items: center;
        background-color: #fff;
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
    .order-item-list {
        margin: 20rpx;
        background-color: #fff;
        border-radius: 20rpx;
        height: 230rpx;
        padding: 20rpx 20rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        .order-item {
            display: flex;
            justify-content: space-between;
            .item {
                color: #696969;
            }
            .item-text {
                color: #434343;
            }
            .price {
                color: #ff2262;
                &::before {
                    content: "￥";
                    font-size: 22rpx;
                }
            }
        }
    }
}
</style>
