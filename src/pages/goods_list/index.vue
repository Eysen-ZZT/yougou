<template>
    <view class="content">
        <Search />
        <view class="goods">
            <view class="options">
                <view
                    :class="{ list: true, active: current == index }"
                    v-for="(item, index) in options"
                    :key="index"
                    @click="handleClass(index)"
                    >{{ item }}</view
                >
            </view>
            <scroll-view
                scroll-y
                class="goods-item-list"
                @scrolltolower="handleLoad"
            >
                <view
                    class="goods-item"
                    v-for="item in productData"
                    :key="item.goods_id"
                >
                    <navigator
                        :url="`/pages/goods_detail/index?goods_id=${item.goods_id}`"
                        navigator
                        hover-class="className"
                        class="navigator"
                    >
                        <view class="goods-pic">
                            <!-- 
                                解决无图片的三种方案：
                                1.v-if 
                                2.三元表达式
                                3.短路运算
                            -->
                            <image
                                :src="
                                    item.goods_small_logo || '/static/empty.png'
                                "
                                mode
                            />
                        </view>
                        <view class="goods-info">
                            <view class="goods-name">{{
                                item.goods_name
                            }}</view>
                            <view class="goods-price">{{
                                item.goods_price == 0 ? "999" : item.goods_price
                            }}</view>
                        </view>
                    </navigator>
                </view>
                <u-loadmore
                    v-if="productData.length > 10"
                    :status="status"
                    :load-text="loadText"
                />
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
            // 分类id
            cid: "",
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
            // 加载状态
            status: "loadmore",
            // 加载提示信息
            loadText: {
                loadmore: "轻轻上拉",
                loading: "努力加载中",
                nomore: "实在没有了",
            },
            // 判断是否有更多数据
            hasMore: true,
        }
    },
    onLoad(obj) {
        // obj是从上一页面跳转传递过来的参数
        this.cid = obj.cid
        this.getProductList()
    },
    // 监听该页面用户下拉刷新事件
    onPullDownRefresh() {
        // 重置数据并发送请求重新获取数据
        this.productData = []
        this.pagenum = 1
        this.hasMore = true
        this.getProductList()
    },
    methods: {
        // 获取商品列表数据
        getProductList() {
            if (!this.hasMore) return
            this.status = "loading"
            uni.request({
                url:
                    "https://api-hmugo-web.itheima.net/api/public/v1/goods/search", //仅为示例，并非真实接口地址。
                data: {
                    cid: this.cid,
                    pagenum: this.pagenum,
                    pagesize: this.pagesize,
                },
                success: (res) => {
                    console.log(res)
                    const { goods } = res.data.message
                    // 使用ES6拓展运算符将分页数据添加到列表
                    this.productData = [...this.productData, ...goods]
                    if (goods.length <= 0) {
                        this.hasMore = false
                        this.status = "nomore"
                    } else {
                        this.status = "loading"
                    }
                    // 请求回数据之后停止当前页面下拉刷新
                    uni.stopPullDownRefresh()
                },
            })
        },
        // 切换类名
        handleClass(index) {
            this.current = index
        },
        // 滑到底部触发事件
        handleLoad() {
            // 当前页递增，发送请求，增加列表数据
            this.pagenum++
            this.getProductList()
        },
    },
}
</script>

<style lang="scss">
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
                box-sizing: border-box;
                font-size: 28rpx;
            }
            .active {
                border-bottom-color: #ff2262;
                color: #ff2262;
            }
        }
        .goods-item-list {
            height: calc(100vh - 88rpx);
            .goods-item {
                padding: 0 26rpx;
                .navigator {
                    display: flex;
                    .goods-pic {
                        width: 191rpx;
                        height: 191rpx;
                        box-sizing: content-box;
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
                            overflow: hidden;
                            text-overflow: ellipsis;
                            display: -webkit-box;
                            -webkit-line-clamp: 2;
                            -webkit-box-orient: vertical;
                            font-size: 22rpx;
                            color: #434343;
                        }
                        .goods-price {
                            font-size: 24rpx;
                            color: #ff2262;
                            &::before {
                                content: "￥";
                                font-size: 20rpx;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>
