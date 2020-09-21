<template>
    <view class="content">
        <Search />
        <view class="nav-Rotation">
            <swiper
                indicator-dots
                indicator-color="#fff"
                indicator-active-color="#FF2262"
                autoplay
                interval="2500"
                circular
                class="swiperImg"
            >
                <swiper-item v-for="item in swiperImg " :key="item.goods_id">
                    <navigator open-type="item.open_type" url="item.navigator_url">
                        <image :src="item.image_src" />
                    </navigator>
                </swiper-item>
            </swiper>
        </view>
    </view>
</template>

<script>
import Search from "../../components/search/Search.vue"
export default {
    components: {
        Search,
    },
    data() {
        return {
            swiperImg: [],
        }
    },
    onLoad() {
        uni.request({
            url:
                "https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata",
            success: (res) => {
                // console.log(res)
                this.swiperImg = res.data.message
            },
        })
    },
    methods: {},
}
</script>

<style lang="less">
.content {
    .swiperImg {
        width: 750rpx;
        height: 340rpx;
        image {
            width: 750rpx;
            height: 340rpx;
        }
    }
}
</style>
