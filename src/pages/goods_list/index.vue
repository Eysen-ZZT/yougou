<template>
    <view class="content">
        <Search />
        <view class="goods">
            <view class="options">
                <view
                    :class="{'list':true,'active':current==index}"
                    v-for="(item,index) in options"
                    :key="index"
                    @click="handleClass(index)"
                >{{item}}</view>
            </view>
            <scroll-view scroll-y class="goods-item-list">
                <view class="goods-item" v-for="item in productData" :key="item.goods_id">
                    <navigator url navigator hover-class="className" class="navigator">
                        <view class="goods-pic">
                            <image :src="item.goods_small_logo" mode />
                        </view>
                        <view class="goods-info">
                            <view class="goods-name">{{item.goods_name}}</view>
                            <view class="goods-price">￥{{item.goods_price}}</view>
                        </view>
                    </navigator>
                </view>
            </scroll-view>
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
            // 排序选项
            options: ["综合", "销量", "价格"],
            // 控制选项类名
            current: 0,
            // 页码
            pagenum: 1,
            // 页容量
            pagesize: 10,
            // 商品列表数据
            productData: [],
        }
    },
    onLoad(obj) {
        // obj是从上一页面跳转传递过来的参数
        this.getProductList(obj.cid)
    },
    methods: {
        getProductList(cid) {
            uni.request({
                url:
                    "https://api-hmugo-web.itheima.net/api/public/v1/goods/search", //仅为示例，并非真实接口地址。
                data: {
                    cid,
                    pagenum: this.pagenum,
                    pagesize: this.pagesize,
                },
                success: (res) => {
                    console.log(res)
                    this.productData = res.data.message.goods
                },
            })
        },
        // 切换类名
        handleClass(index) {
            this.current = index
        },
    },
}
</script>

<style lang="less">
.content {
    width: 750rpx;
    .goods {
        .options {
            background-color: #f8f8f8;
            height: 88rpx;
            display: flex;
            justify-content: space-around;
            align-items: center;
            .list {
                width: 184rpx;
                text-align: center;
                height: 88rpx;
                line-height: 88rpx;
                border-bottom: 3px solid transparent;
                box-sizing: content-box;
                font-size: 28rpx;
            }
            .active {
                border-bottom-color: #ff2262;
            }
        }
        .goods-item-list {
            .goods-item {
                padding: 0 26rpx;
                .navigator {
                    display: flex;
                    .goods-pic {
                        width: 191rpx;
                        height: 191rpx;
                        padding: 9rpx 30rpx 9rpx 15rpx;
                        image {
                            width: 191rpx;
                            height: 191rpx;
                        }
                    }
                    .goods-info {
                        flex: 1;
                        padding: 9rpx 0;
                        border-bottom: 1rpx solid #ddd;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-around;
                        .goods-name {
                            font-size: 22rpx;
                            color: #434343;
                        }
                        .goods-price {
                            font-size: 24rpx;
                            color: #ff2262;
                        }
                    }
                }
            }
        }
    }
}
</style>
