<template>
    <view class="content">
        <view class="search">
            <u-icon
                class="icon"
                name="search"
                color="#6c6c6c"
                size="30"
            ></u-icon>
            <input
                class="text"
                type="text"
                placeholder="输入商品名"
                @input="handleInput"
                :value="value"
            />
            <view class="btn" @tap="handleSearch">搜索</view>
        </view>
        <view class="goods">
            <view
                class="goods-item"
                v-for="item in SearchList"
                :key="item.goods_id"
            >
                <navigator
                    :url="`/pages/goods_detail/index?goods_id=${item.goods_id}`"
                    navigator
                    hover-class="className"
                    class="navigator"
                >
                    <view class="goods-pic">
                        <image
                            :src="item.goods_small_logo || '/static/empty.png'"
                        />
                    </view>
                    <view class="goods-info">
                        <view class="goods-name">{{ item.goods_name }}</view>
                        <view class="goods-price">{{
                            item.goods_price == 0 ? "999" : item.goods_price
                        }}</view>
                    </view>
                </navigator>
            </view>
            <u-loadmore
                v-if="SearchList.length > 20"
                :status="status"
                :load-text="loadText"
            />
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            // 搜索列表
            SearchList: [],
            // 输入框的value值
            value: "卫衣女",
            // 当前页
            pagenum: 1,
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
    onLoad() {},
    onShow() {},
    onReachBottom() {
        console.log("触底了")
        this.pagenum++
        this.getSearchList()
    },
    methods: {
        async getSearchList() {
            if (!this.hasMore) return
            this.status = "loading"
            const res = await this.$request({
                url: "/goods/search",
                data: {
                    query: this.value,
                    pagenum: this.pagenum,
                },
            })
            console.log(res)
            const { goods } = res.data.message
            this.SearchList = [...this.SearchList, ...goods]
            if (goods.length <= 0) {
                console.log("没有数据了")
                this.status = "nomore"
                this.hasMore = false
            } else {
                this.status = "loading"
            }
        },
        handleInput(e) {
            this.value = e.detail.value
            // console.log(this.value)
        },
        handleSearch() {
            this.hasMore = true
            this.SearchList = []
            this.pagenum = 1
            this.getSearchList()
        },
    },
}
</script>

<style lang="scss">
.content {
    width: 750rpx;
    padding-bottom: 30rpx;
    .search {
        width: 750rpx;
        padding: 15rpx 18rpx;
        background-color: #f8f8f8;
        display: flex;
        position: fixed;
        top: 0;
        left: 0;
        .icon {
            position: absolute;
            top: 30rpx;
            left: 35rpx;
        }
        .text {
            flex: 1;
            height: 61rpx;
            padding-left: 57rpx;
            background-color: #e7e7e7;
            border-radius: 30rpx;
            line-height: 61rpx;
            color: #666;
        }
        .btn {
            width: 101rpx;
            height: 61rpx;
            line-height: 61rpx;
            text-align: center;
            color: #fff;
            background-color: #ff2262;
            border-radius: 10rpx;
            font-size: 25rpx;
            margin-left: 15rpx;
        }
    }
    .goods {
        margin-top: 91rpx;
        padding: 0 18rpx;
        .goods-item {
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
</style>
