<template>
    <div class="main">
        <div class="header">
            <span class="title">江苏泓光轨道设备有限公司</span>
        </div>
        <div class="menu">
            <menuList></menuList>
        </div>
    </div>
</template>

<script>
    import menuList from "@/pages/main/modules/menuList";
    export default {
        name: "index",
        components:{
            menuList
        }
    }
</script>

<style lang="less" scoped>
    .main{
        /*border:1px solid black;*/
        padding: 0px 5px;
        width: 100%;
        height: 100%;
        background-image: url("../../assets/zjm.jpg");
        background-repeat: no-repeat;
        background-size: 100% 100%;
        /*padding-top: 50px;*/
        box-sizing: border-box;
        .header{
            height: 240px;
            padding-top: 50px;
            box-sizing: border-box;
            .title{
                font-size: 24px;
                font-weight: 700;
                font-family: "Kaiti TC";
            }
        }

        .menu{
            /*border:1px solid yellow;*/
            /*height:400px;*/
            padding-top:10px;
            box-sizing: border-box;
        }
    }
</style>
