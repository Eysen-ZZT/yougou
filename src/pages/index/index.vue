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
                <swiper-item v-for="item in swiperImg" :key="item.goods_id">
                    <navigator
                        :open-type="item.open_type"
                        :url="item.navigator_url.replace(/main/, 'index')"
                    >
                        <image :src="item.image_src" />
                    </navigator>
                </swiper-item>
            </swiper>
        </view>
        <view class="cate">
            <view class="catelist" v-for="item in cateImg" :key="item.name">
                <navigator
                    :open-type="item.open_type"
                    :url="item.navigator_url.replace(/main/, 'index')"
                    v-if="item.navigator_url"
                >
                    <image :src="item.image_src" />
                </navigator>
                <image :src="item.image_src" v-else />
            </view>
        </view>
        <view class="floor" v-for="(item, index) in floorData" :key="index">
            <view class="floor-title">
                <image :src="item.floor_title.image_src" />
            </view>
            <view class="floor-cover">
                <navigator
                    class="cover-pic"
                    :open-type="item2.open_type"
                    :url="item2.navigator_url.replace(/[?]/, '/index?')"
                    v-for="item2 in item.product_list"
                    :key="item2.name"
                >
                    <image :src="item2.image_src" mode="heightFix" />
                </navigator>
            </view>
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
            // 轮播图数据
            swiperImg: [],
            // 导航分类数据
            cateImg: [],
            // 楼层数据
            floorData: [],
        }
    },
    onLoad() {
        // 轮播图数据
        // uni.request({
        //     url:
        //         "https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata",
        //     success: (res) => {
        //         // console.log(res)
        //         this.swiperImg = res.data.message
        //     },
        // })
        this.getswiperImg()
        // 导航分类数据
        uni.request({
            url:
                "https://api-hmugo-web.itheima.net/api/public/v1/home/catitems",
            success: (res) => {
                // console.log(res)
                this.cateImg = res.data.message
            },
        })
        // 楼层数据
        uni.request({
            url:
                "https://api-hmugo-web.itheima.net/api/public/v1/home/floordata",
            success: (res) => {
                // console.log(res)
                this.floorData = res.data.message
            },
        })
    },
    methods: {
        async getswiperImg() {
            const res = await this.$request({
                url: "/home/swiperdata",
            })
            console.log(res)
            this.swiperImg = res.data.message
        },
    },
}
</script>

<style lang="less">
.content {
    .swiperImg {
        width: 750rpx;
        height: 340rpx;
        box-shadow: 0px 1px 4px 1px rgba(200, 200, 200, 0.3);
        image {
            width: 750rpx;
            height: 340rpx;
        }
    }
    .cate {
        display: flex;
        justify-content: space-around;
        margin: 12rpx 0;
        .catelist {
            image {
                width: 128rpx;
                height: 140rpx;
            }
        }
    }
    .floor {
        .floor-title {
            margin-top: 43rpx;
            image {
                width: 750rpx;
                height: 59rpx;
            }
        }
        .floor-cover {
            padding: 10rpx 11rpx 0 12rpx;
            overflow: hidden;
            .cover-pic {
                float: left;
                height: 188rpx;
                margin-left: 15rpx;
                margin-bottom: 10rpx;
                image {
                    height: 188rpx;
                }
                &:first-child {
                    width: 233rpx;
                    height: 386rpx;
                    margin-left: 0;
                    margin-bottom: 0;
                    image {
                        width: 233rpx;
                        height: 386rpx;
                    }
                }
            }
        }
    }
}
</style>
