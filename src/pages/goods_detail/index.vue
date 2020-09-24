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
        }
    },
    onLoad(obj) {
        this.goods_id = obj.goods_id
        this.getGoodsDetail()
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
            uni.previewImage({
                urls: this.picsUrl,
                current: this.picsUrl[index],
            })
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
}
</style>
