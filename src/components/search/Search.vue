<template>
    <view class="search">
        <navigator url="/pages/search/index" hover-class="none">
            <input class="iptSearch" type="text" placeholder="搜索" />
        </navigator>
    </view>
</template>

<script>
export default {}
</script>

<style lang="less">
.search {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #ff2262;
    height: 100rpx;
    width: 750rpx;
    navigator {
        width: 95%;
    }
    .iptSearch {
        background-color: #fff;
        height: 80rpx;
        padding-left: 40rpx;
        border-radius: 40rpx;
        color: #666;
        text-align: center;
    }
}
</style>