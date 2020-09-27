<template>
    <view class="content">
        <view class="address">
            <view v-if="!userAddress.userName" class="address-empty">
                <view @tap="getUserAddress" class="address-empty-btn">
                    选择收货地址
                </view>
                <!-- <button open-type="openSetting">打开授权设置界面</button> -->
            </view>
            <view v-else class="address-info">
                <view class="address-info-detail">
                    {{ addressDetail }}
                </view>
                <text space="nbsp">
                    {{ userAddress.userName + "      "
                    }}{{ userAddress.telNumber }}
                </text>
            </view>
        </view>
        <view class="title">已选商品</view>
        <view class="goods-item" v-for="item in payList" :key="item.goods_id">
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
                        x<view class="count">{{ item.goods_count }}</view>
                    </view>
                </view>
            </view>
        </view>
        <view class="settlement">
            <view class="allPrice">
                <view
                    >合计: <text>{{ allPrice }}</text>
                </view>
            </view>
            <view class="goSettlement">去支付({{ goodsNum }})</view>
        </view>
        <u-toast ref="uToast" />
    </view>
</template>

<script>
export default {
    data() {
        return {
            // 地址信息
            userAddress: {},
            // 支付页清单
            payList: [],
        }
    },
    onLoad() {},
    onShow() {
        // 获取支付页列表数据
        const cartList = uni.getStorageSync("cartList") || []
        if (cartList.length > 0) {
            this.payList = cartList.filter((item) => item.isSelect)
        }
        console.log(this.payList)
        this.userAddress = uni.getStorageSync("userAddress")
    },
    computed: {
        // 拼接收获地址
        addressDetail() {
            const {
                provinceName,
                cityName,
                countyName,
                detailInfo,
            } = this.userAddress
            return provinceName + cityName + countyName + detailInfo
        },
        // 计算商品总价格
        allPrice() {
            const priceArr = this.payList.filter((item) => item.isSelect)
            let sum = 0
            priceArr.forEach((item) => {
                sum += item.goods_count * item.goods_price
            })
            return sum
        },
        // 计算结算商品数量
        goodsNum() {
            const num = this.payList.filter((item) => item.isSelect)
            return num.length
        },
    },
    methods: {
        // 获取用户地址信息
        getUserAddress() {
            uni.chooseAddress({
                success: (res) => {
                    // console.log(res)
                    this.userAddress = res
                    uni.setStorageSync("userAddress", res)
                },
            })
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
    .address {
        height: 187rpx;
        background-color: #fff;
        border-radius: 20rpx;

        .address-empty {
            height: 187rpx;
            display: flex;
            justify-content: center;
            align-items: center;
            .address-empty-btn {
                width: 303rpx;
                height: 89rpx;
                border-radius: 44.5rpx;
                border: 2rpx solid #ff2262;
                color: #ff2262;
                text-align: center;
                line-height: 89rpx;
            }
        }
        .address-info {
            height: 187rpx;
            padding: 17rpx;
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            .address-info-detail {
                font-size: 30rpx;
                color: #333;
                margin-bottom: 20rpx;
            }
            text {
                font-size: 24rpx;
                color: #666;
            }
        }
    }
    .title {
        height: 71rpx;
        font-size: 26rpx;
        color: #333;
        background-color: #fff;
        border-radius: 20rpx;
        margin-top: 35rpx;
        padding: 0 26rpx;
        line-height: 71rpx;
    }
    .goods-item {
        margin-top: 10rpx;
        margin-bottom: 20rpx;
        display: flex;
        background-color: #fff;
        border-radius: 20rpx;
        padding: 20rpx;
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
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    color: #8a8a8a;
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
            color: rgba($color: #fff, $alpha: 1);
        }
    }
}
</style>
