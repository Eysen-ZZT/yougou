<template>
    <view class="content">
        <view
            class="goods-item"
            v-for="(item, index) in cartList"
            :key="item.goods_id"
        >
            <view class="checkBox" @tap="handleSelect(index)">
                <u-checkbox
                    v-model="item.isSelect"
                    shape="circle"
                    active-color="#ff2262"
                    size="40"
                ></u-checkbox>
            </view>
            <view class="goods-pic">
                <image :src="item.goods_pic || '/static/empty.png'" />
            </view>
            <view class="goods-info">
                <view class="goods-name">{{ item.goods_name }}</view>
                <view class="bottom">
                    <view class="goods-price">{{
                        item.goods_price == 0 ? "999" : item.goods_price
                    }}</view>
                    <view class="goods-count">
                        <view class="minus btn" @tap="handleMinus(index)"
                            >-</view
                        >
                        <view class="count">{{ item.goods_count }}</view>
                        <view class="add btn" @tap="handleAdd(index)">+</view>
                    </view>
                </view>
            </view>
        </view>
        <view class="empty" v-if="cartList.length <= 0">
            <view class="top">购物车尽然是空的</view>
            <view class="middle">再忙，也要记得买点什么犒赏自己~</view>
            <navigator
                url="/pages/index/index"
                open-type="switchTab"
                class="bottom"
                >去逛逛</navigator
            >
        </view>
        <view class="settlement" v-if="cartList.length > 0">
            <view class="checkBox">
                <u-checkbox
                    v-model="isCheck"
                    shape="circle"
                    active-color="#ff2262"
                    size="40"
                    label-size="24"
                    @tap="checkAll"
                    >全选</u-checkbox
                >
            </view>
            <view class="right">
                <view class="allPrice">
                    <view
                        >合计: <text>{{ allPrice }}</text>
                    </view>
                </view>
                <view
                    @tap="goPay"
                    :class="{ goSettlement: true, active: goodsNum !== 0 }"
                    >去结算({{ goodsNum }})</view
                >
                <u-toast ref="uToast" />
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            // 购物车列表
            cartList: [],
            // 全选选中状态
            isCheck: false,
        }
    },
    onLoad() {},
    // 显示购物车页面的时候需要使用最新的数据
    onShow() {
        this.cartList = uni.getStorageSync("cartList") || []
        this.isCheckAll()
    },
    watch: {
        // 监听列表商品数据变化
        cartList: {
            // 深度监听子属性
            deep: true,
            handler: (value) => {
                uni.setStorageSync("cartList", value)
            },
        },
    },
    computed: {
        // 计算商品总价格
        allPrice() {
            const priceArr = this.cartList.filter((item) => {
                if (item.isSelect) {
                    return item
                }
            })
            let sum = 0
            priceArr.forEach((item) => {
                sum += item.goods_count * item.goods_price
            })
            return sum
        },
        // 计算结算商品数量
        goodsNum() {
            const num = this.cartList.filter((item) => item.isSelect)
            return num.length
        },
    },
    methods: {
        // 判断全选是否选中
        isCheckAll() {
            const boo = this.cartList.every((item) => {
                return item.isSelect
            })
            if (boo) {
                this.isCheck = true
            } else {
                this.isCheck = false
            }
        },
        // 单选
        handleSelect(index) {
            this.isCheckAll()
        },
        // 全选
        checkAll() {
            this.cartList = this.cartList.map((item) => {
                return {
                    ...item,
                    isSelect: this.isCheck,
                }
            })
        },
        // 减少商品数量
        handleMinus(index) {
            if (this.cartList[index].goods_count <= 1) {
                uni.showModal({
                    title: "提示",
                    content: "确认将这1个宝贝删除",
                    cancelText: "我在想想",
                    confirmText: "删除",
                    success: (res) => {
                        if (res.confirm) {
                            console.log("用户点击确定")
                            this.cartList.splice(index, 1)
                        } else if (res.cancel) {
                            console.log("用户点击取消")
                        }
                    },
                })
            } else {
                this.cartList[index].goods_count--
            }
        },
        // 添加商品数量
        handleAdd(index) {
            this.cartList[index].goods_count++
        },
        // 去结算
        goPay() {
            if (this.goodsNum == 0) {
                this.$refs.uToast.show({
                    title: "您还没有选择商品哦",
                    icon: false,
                })
            } else {
                uni.navigateTo({
                    url: "/pages/pay/index",
                })
            }
        },
    },
}
</script>

<style lang="scss" scoped>
html {
    height: 100%;
}
.content {
    width: 750rpx;
    min-height: 100vh;
    background-color: #f2f2f2;
    padding: 20rpx;
    padding-bottom: 103rpx;
    .goods-item {
        display: flex;
        background-color: #fff;
        margin-bottom: 20rpx;
        padding: 20rpx 0;
        border-radius: 20rpx;
        .checkBox {
            width: 80rpx;
            padding-left: 20rpx;
            display: flex;
            align-items: center;
        }
        .goods-pic {
            width: 191rpx;
            height: 191rpx;
            image {
                width: 191rpx;
                height: 191rpx;
            }
        }
        .goods-info {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            padding: 0 20rpx;
            .goods-name {
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                font-size: 24rpx;
            }
            .bottom {
                display: flex;
                justify-content: space-between;
                align-items: center;
                .goods-price {
                    color: #ff2262;
                    &::before {
                        content: "￥";
                        font-size: 22rpx;
                    }
                }
                .goods-count {
                    width: 120rpx;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    color: #8a8a8a;
                    .btn {
                        width: 30rpx;
                        height: 30rpx;
                        border-radius: 50%;
                        border: 1px solid #8a8a8a;
                        text-align: center;
                        line-height: 25rpx;
                    }
                }
            }
        }
    }
    .settlement {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 750rpx;
        height: 83rpx;
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 23rpx;
        .right {
            display: flex;
            align-items: center;
            .allPrice {
                text {
                    margin-left: 10rpx;
                    color: #ff2262;
                    &::before {
                        content: "￥";
                        font-size: 20rpx;
                    }
                }
            }
            .goSettlement {
                margin-left: 20rpx;
                height: 52rpx;
                padding: 0 26rpx;
                font-size: 22rpx;
                background-color: #ff2262;
                border-radius: 26rpx;
                line-height: 52rpx;
                color: rgba($color: #fff, $alpha: 0.5);
            }
            .active {
                color: rgba($color: #fff, $alpha: 1);
            }
        }
    }
    .empty {
        height: 70vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .top {
            font-size: 34rpx;
            color: #666;
        }
        .middle {
            margin-top: 20rpx;
            font-size: 22rpx;
            color: #999;
        }
        .bottom {
            margin-top: 20rpx;
            width: 165rpx;
            height: 70rpx;
            text-align: center;
            line-height: 66rpx;
            border: 1px solid #ddd;
            font-size: 28rpx;
            color: #5f646e;
        }
    }
}
</style>
