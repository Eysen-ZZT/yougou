<template>
    <view class="search">
        <input class="iptSearch" type="text" placeholder="搜索" />
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
    .iptSearch {
        background-color: #fff;
        width: 90%;
        height: 80rpx;
        padding-left: 40rpx;
        border-radius: 40rpx;
        color: #666;
        text-align: center;
    }
}
</style>