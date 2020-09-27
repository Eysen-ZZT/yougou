<template>
    <view class="content">
        <swiper
            class="swiper"
            indicator-dots
            duration="500"
            indicator-color="#fff"
            indicator-active-color="#FF2262"
        >
            <swiper-item
                v-for="(item, index) in goodsData.pics"
                :key="item.pics_id"
                class="swiper-item"
            >
                <image
                    :src="item.pics_big"
                    mode="widthFix"
                    class="swiper-item-pic"
                    @tap="showBigImg(index)"
                />
            </swiper-item>
        </swiper>
        <view class="goods-option">
            <view class="goods-price">{{
                goodsData.goods_price == 0 ? "999" : goodsData.goods_price
            }}</view>
            <view class="goods-right">
                <view class="share">
                    <u-icon name="zhuanfa" color="#707070" size="38"> </u-icon>
                    <button open-type="share">分享</button>
                    <u-toast ref="uToast" />
                </view>
                <view class="star">
                    <u-icon
                        @click="handleStar(goodsData)"
                        :name="isStar ? 'star-fill' : 'star'"
                        :color="isStar ? '#ff2262' : '#707070'"
                        size="38"
                    ></u-icon>
                </view>
            </view>
        </view>
        <view class="goods-title">
            {{ goodsData.goods_name || "" }}
        </view>
        <view class="pic-label">
            <text>图文详情</text>
            <view
                class="pic"
                v-if="goodsData.goods_introduce"
                v-html="
                    isIOS
                        ? goodsData.goods_introduce.replace(/webp/g, 'jpg')
                        : goodsData.goods_introduce
                "
            ></view>
        </view>
        <view class="navigation">
            <view class="left">
                <view class="item">
                    <button open-type="contact">客服</button>
                    <u-icon
                        name="kefu-ermai"
                        color="##707070"
                        size="38"
                    ></u-icon>
                    <view class="text">联系客服</view>
                </view>
                <navigator
                    url="/pages/cart/index"
                    open-type="switchTab"
                    hover-class="className"
                    class="item"
                >
                    <!-- <u-badge
                        size="mini"
                        type="error"
                        count="9"
                        overflow-count="99"
                        :offset="[-10, -8]"
                    ></u-badge> -->
                    <u-icon
                        name="shopping-cart"
                        color="##707070"
                        size="38"
                    ></u-icon>
                    <view class="text">购物车</view>
                </navigator>
            </view>
            <view class="right">
                <view class="cart btn" @tap="joinCart(goodsData)"
                    >加入购物车</view
                >
                <view class="buy btn">立即购买</view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            // 商品详情数据
            goodsData: {},
            // 商品id
            goods_id: "",
            // 预览大图数据
            picsUrl: [],
            // 判断是否是ios端
            isIOS: false,
            // 控制收藏属性
            isStar: false,
        }
    },
    onLoad(obj) {
        // 页面参数
        this.goods_id = obj.goods_id
        // 获取系统信息
        this.checkSystemInfo()
        // 获取商品详情
        this.getGoodsDetail()
        // 获取收藏状态
        this.isStared()
    },
    methods: {
        // 获取商品详情数据
        getGoodsDetail() {
            uni.request({
                url:
                    "https://api-hmugo-web.itheima.net/api/public/v1/goods/detail", //仅为示例，并非真实接口地址。
                data: {
                    goods_id: this.goods_id,
                },
                success: (res) => {
                    console.log(res)
                    const goodsData = res.data.message
                    this.goodsData = goodsData
                    // 提取预览图片地址
                    this.picsUrl = goodsData.pics.map((item) => {
                        return item.pics_big
                    })
                },
            })
        },
        // 预览大图
        showBigImg(index) {
            // 调用预览图片的api 传入相关参数
            uni.previewImage({
                urls: this.picsUrl,
                current: this.picsUrl[index],
            })
        },
        // 获取系统信息
        checkSystemInfo() {
            const res = uni.getSystemInfoSync()
            const { system } = res
            // console.log(system)
            this.isIOS = system.toLocaleLowerCase().indexOf("ios") > -1
        },
        // 点击收藏
        handleStar(goodsData) {
            const goodsList = uni.getStorageSync("star") || []
            if (this.isStar) {
                const index = goodsList.findIndex((item) => {
                    return goodsData.goods_id === item.goods_id
                })
                console.log(index)
                goodsList.splice(index, 1)
                this.isStar = false
            } else {
                this.isStar = true
                this.$refs.uToast.show({
                    title: "添加收藏成功",
                    // type: "success",
                    icon: false,
                })
                goodsList.unshift(goodsData)
            }
            uni.setStorageSync("star", goodsList)
        },
        // 检测是否为收藏状态
        isStared() {
            const goodsList = uni.getStorageSync("star") || []
            const goodsItem = goodsList.find((item) => {
                return item.goods_id == this.goods_id
            })
            // console.log(goodsItem)
            if (goodsItem) {
                this.isStar = true
            } else {
                this.isStar = false
            }
        },
        // 加入购物车
        joinCart(goodsData) {
            const cartList = uni.getStorageSync("cartList") || []
            const goodsItem = {
                // 选中状态
                isSelect: false,
                // 商品数量
                goods_count: 1,
                goods_id: goodsData.goods_id,
                goods_price:
                    goodsData.goods_price == 0 ? 999 : goodsData.goods_price,
                goods_name: goodsData.goods_name,
                goods_pic: goodsData.pics[0].pics_sma,
            }

            if (cartList.length < 1) {
                this.$refs.uToast.show({
                    title: "添加成功，在购物车等亲~",
                    icon: false,
                })
                cartList.unshift(goodsItem)
            } else {
                const index = cartList.findIndex((item) => {
                    return item.goods_id == this.goods_id
                })
                if (index == -1) {
                    this.$refs.uToast.show({
                        title: "添加成功，在购物车等亲~",
                        icon: false,
                    })
                    cartList.unshift(goodsItem)
                } else {
                    this.$refs.uToast.show({
                        title: "添加成功，在购物车等亲~",
                        icon: false,
                    })
                    cartList[index].goods_count++
                }
            }
            uni.setStorageSync("cartList", cartList)
        },
    },
}
</script>

<style lang='scss'>
.content {
    width: 750rpx;
    .swiper {
        height: 750rpx;
        .swiper-item {
            display: flex;
            justify-content: center;
            .swiper-item-pic {
                width: 750rpx;
                height: 750rpx;
            }
        }
    }
    .goods-option {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20rpx 33rpx;
        .goods-price {
            font-size: 32rpx;
            color: #ff2262;
            &::before {
                content: "￥";
                font-size: 24rpx;
            }
        }
        .goods-right {
            display: flex;
            .share {
                position: relative;
                button {
                    position: absolute;
                    top: -3rpx;
                    left: -8rpx;
                    opacity: 0;
                    width: 100%;
                    height: 100%;
                }
            }
            .star {
                margin-left: 20rpx;
            }
        }
    }
    .goods-title {
        padding: 0 33rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        color: #434343;
        &::after {
            content: "";
            display: block;
            margin-top: 48rpx;
            height: 20rpx;
            background-color: #f7f7f7;
        }
    }
    .pic-label {
        padding-top: 20rpx;
        text-align: center;
        text {
            color: #434343;
        }
        .pic {
            padding-top: 20rpx;
            font-size: 0;
        }
    }
    .navigation {
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 99;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #fff;
        width: 750rpx;
        height: 94rpx;
        .left {
            display: flex;
            .item {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                margin-left: 50rpx;
                position: relative;
                .text {
                    font-size: 20rpx;
                }
                button {
                    position: absolute;
                    top: -3rpx;
                    left: -3rpx;
                    opacity: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 999;
                }
            }
        }
        .right {
            display: flex;
            width: 450rpx;
            .btn {
                font-size: 26rpx;
                color: white;
                height: 60rpx;
                line-height: 60rpx;
                padding: 0 33rpx;
                margin: 0 20rpx;
                border-radius: 30rpx;
            }
            .cart {
                background-color: #fcaa23;
            }
            .buy {
                background-color: #ff2262;
            }
        }
    }
}
</style>
