<template>
    <view class="content">
        <Search />
        <view class="category">
            <scroll-view scroll-y class="tabs">
                <view
                    class="tabs-item"
                    v-for="(item,index) in cateData"
                    :key="item.cat_id"
                    @click="handleBar(index)"
                >
                    <view :class="{'item-con':true, 'active':currentBar==index}">{{item.cat_name}}</view>
                </view>
            </scroll-view>
            <scroll-view scroll-y class="sub-tabs">
                <view
                    class="sub-tabs-item"
                    v-for="(item2,index2) in cateData[currentBar].children"
                    :key="item2.cat_id"
                >
                    <view class="item-title">
                        <text space="nbsp">/</text>
                        {{' '+item2.cat_name+' '}}
                        <text>/</text>
                    </view>
                    <view class="item-list">
                        <view
                            class="subItem"
                            v-for="item3 in cateData[currentBar].children[index2].children"
                            :key="item3.cat_id"
                        >
                            <image :src="item3.cat_icon" mode />
                            <text>{{item3.cat_name}}</text>
                        </view>
                    </view>
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
            // 商品分类数据
            cateData: [],
            // 商品分类数据副本
            subCateData: [],
            // 侧边栏类名控制
            currentBar: 0,
        }
    },
    onLoad() {
        const cateData = uni.getStorageSync("cateData")
        const cateDataEndTime = uni.getStorageSync("cateDataEndTime")
        // 如果本地没有数据则发送请求获取数据
        if (!cateData) {
            this.getCateAll()
        } else {
            // 如果有，看当前时间是否大于设置的期限时间，（距上一次请求时间大于一分钟）
            if (cateDataEndTime < +new Date()) {
                this.getCateAll()
            } else {
                // 如果没有，则直接使用本地数据
                this.cateData = cateData
            }
        }
    },
    methods: {
        getCateAll() {
            // 分类总数据
            uni.request({
                url:
                    "https://api-hmugo-web.itheima.net/api/public/v1/categories",
                success: (res) => {
                    // console.log(res)
                    // 商品分类数据
                    this.cateData = res.data.message
                    this.subCateData = [...res.data.message]
                    // 保存到本地存储
                    uni.setStorageSync("cateData", this.cateData)
                    // 重新发送请求时间，一分钟后
                    uni.setStorageSync("cateDataEndTime", 60000 + +new Date())
                },
            })
        },
        // 切换侧边栏类名
        handleBar(index) {
            this.currentBar = index
            // 解决切换分类右边内容不回到顶部的bug
            this.cateData = []
            setTimeout(() => {
                this.cateData = this.subCateData
            }, 1)
        },
    },
}
</script>

<style lang="less">
.content {
    width: 750rpx;
    .category {
        display: flex;
        .tabs {
            background-color: #f3f3f3;
            width: 182rpx;
            height: calc(100vh - 100rpx);
            // overflow: auto;
            .tabs-item {
                padding: 17rpx 0;
                .item-con {
                    text-align: center;
                    font-size: 26rpx;
                    color: #585858;
                    border-left: 4rpx solid transparent;
                }
                .active {
                    border-left: 4rpx solid #ff2262;
                    color: #ff2262;
                }
            }
        }
        .sub-tabs {
            flex: 1;
            height: calc(100vh - 100rpx);
            .sub-tabs-item {
                .item-title {
                    padding: 18rpx 0 25rpx 0;
                    text-align: center;
                    color: #575757;
                    font-size: 24rpx;
                    text {
                        color: #9c9c9c;
                        font-weight: 200;
                    }
                }
                .item-list {
                    display: flex;
                    flex-wrap: wrap;
                    margin-bottom: 30rpx;
                    .subItem {
                        width: 33%;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        padding: 10rpx 0;
                        image {
                            width: 120rpx;
                            height: 120rpx;
                        }
                        text {
                            font-size: 24rpx;
                            color: #2e2e2e;
                        }
                    }
                }
            }
        }
    }
}
</style>
