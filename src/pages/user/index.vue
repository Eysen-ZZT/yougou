<template>
    <view class="content">
        <view class="login">
            <view class="userImg" v-if="userInfo">
                <image class="bgi" :src="userInfo.avatarUrl" />
                <view class="img">
                    <image :src="userInfo.avatarUrl" />
                    <view class="nickName">{{ userInfo.nickName }}</view>
                </view>
            </view>
            <navigator url="/pages/auth/index" class="loginBtn" v-else>
                去登录
            </navigator>
        </view>
        <view class="Order-status">
            <view class="icon-item">
                <u-icon name="coupon" color="#434343" size="64"></u-icon>
                <view class="text">待付款</view>
            </view>
            <view class="icon-item"
                ><u-icon name="car" color="#434343" size="64"></u-icon>
                <view class="text">待收货</view>
            </view>
            <view class="icon-item"
                ><u-icon name="rmb-circle" color="#434343" size="64"></u-icon>
                <view class="text">退货/退款</view>
            </view>
            <navigator url="/pages/order/index" class="icon-item">
                <u-icon name="order" color="#434343" size="64"></u-icon>
                <view class="text">全部订单</view>
            </navigator>
        </view>
        <view class="setItem-list">
            <view class="setItem" @tap="phoneCall">
                <view class="left">
                    <u-icon
                        name="kefu-ermai"
                        color="#434343"
                        size="45"
                    ></u-icon>
                    <view class="text">联系客服</view>
                </view>
                <view class="item-text">400-618-4000</view>
            </view>
            <view class="setItem">
                <view class="left">
                    <u-icon name="file-text" color="#434343" size="45"></u-icon>
                    <view class="text">意见反馈</view>
                </view>
                <view class="item-text"></view>
            </view>
            <view class="setItem">
                <view class="left">
                    <u-icon
                        name="info-circle"
                        color="#434343"
                        size="45"
                    ></u-icon>
                    <view class="text">当前版本</view>
                </view>
                <view class="item-text">v4.1.1</view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            // 用户信息
            userInfo: null,
        }
    },
    onLoad() {},
    onShow() {
        this.userInfo = uni.getStorageSync("userInfo")
        console.log(this.userInfo)
    },
    methods: {
        phoneCall() {
            uni.makePhoneCall({
                phoneNumber: "400-618-4000",
            })
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
    .login {
        height: 349rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        .loginBtn {
            width: 352rpx;
            height: 88rpx;
            background-color: #07c160;
            border-radius: 10rpx;
            font-size: 34rpx;
            color: #fff;
            text-align: center;
            line-height: 88rpx;
        }
        .userImg {
            width: 750rpx;
            height: 349rpx;
            position: relative;
            overflow: hidden;
            display: flex;
            justify-content: center;
            .bgi {
                position: absolute;
                top: -10%;
                left: -10%;
                width: 120%;
                height: 120%;
                filter: blur(5px);
            }
            .img {
                margin-top: 58rpx;
                width: 172rpx;
                height: 172rpx;
                z-index: 99;
                image {
                    width: 172rpx;
                    height: 172rpx;
                    border-radius: 50%;
                }
                .nickName {
                    margin-top: 16rpx;
                    font-size: 32rpx;
                    text-align: center;
                    color: #fff;
                }
            }
        }
    }
    .Order-status {
        margin: 20rpx;
        height: 144rpx;
        background-color: #fff;
        display: flex;
        justify-content: space-around;
        align-items: center;
        border-radius: 20rpx;
        .icon-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            .text {
                margin-top: 15rpx;
            }
        }
    }
    .setItem-list {
        height: 520rpx;
        margin: 20rpx;
        background-color: #fff;
        padding: 0 20rpx;
        border-radius: 20rpx;
        .setItem {
            height: 101rpx;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2rpx solid #ddd;
            color: #444;
            padding: 0 10rpx;
            .left {
                width: 177rpx;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
        }
    }
}
</style>
