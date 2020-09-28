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
            <view class="goSettlement" @tap="goPay"
                >去支付({{ goodsNum }})</view
            >
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
        // 去支付
        async goPay() {
            uni.showLoading({
                title: "加载中",
            })
            const token = uni.getStorageSync("token")
            if (!token) {
                uni.navigateTo({
                    url: "/pages/auth/index",
                })
            } else {
                console.log(token)
                // 处理创建订单所需的参数
                const order_price = this.allPrice
                const consignee_addr = this.addressDetail
                const goods = this.payList.map((item) => {
                    return {
                        goods_id: item.goods_id,
                        goods_number: item.goods_count,
                        goods_price: item.goods_price,
                    }
                })
                const data = {
                    order_price,
                    consignee_addr,
                    goods,
                }
                console.log(data)
                // 发起创建订单请求
                const res = await uni.request({
                    url:
                        "https://api-hmugo-web.itheima.net/api/public/v1/my/orders/create",
                    data,
                    method: "POST",
                    header: {
                        Authorization: token,
                    },
                })
                console.log(res)
                // 获取支付参数 生成预订单
                const order_number = res[1].data.message.order_number
                const res2 = await uni.request({
                    url:
                        "https://api-hmugo-web.itheima.net/api/public/v1/my/orders/req_unifiedorder",
                    data: {
                        order_number,
                    },
                    method: "POST",
                    header: {
                        Authorization: token,
                    },
                })
                console.log(res2)
                uni.hideLoading()
                // 从预订单中提取微信支付接口需要的参数 调用微信接口
                const pay = res2[1].data.message.pay
                const res3 = await uni.requestPayment({
                    ...pay,
                })
                console.log(res3)
                // 支付完成之后查询支付状态
                const res4 = await uni.request({
                    url:
                        "https://api-hmugo-web.itheima.net/api/public/v1/my/orders/chkOrder",
                    data: {
                        order_number,
                    },
                    method: "POST",
                    header: {
                        Authorization: token,
                    },
                })
                console.log(res4)
                if (res4[1].data.message) {
                    this.$refs.uToast.show({
                        title: res4[1].data.message,
                        icon: false,
                    })
                    // 更新本地存储
                    const oldCartList = uni.getStorageSync("cartList")
                    const newCartList = oldCartList.filter(
                        (item) => item.isSelect === false
                    )
                    uni.setStorageSync("cartList", newCartList)
                    // 这里使用重定向是因为付款成功之后不允许用户再回到之前的付款页面
                    uni.redirectTo({
                        url: "/pages/order/index",
                    })
                } else {
                    this.$refs.uToast.show({
                        title: "支付失败",
                        icon: false,
                    })
                }
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
