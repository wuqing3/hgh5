<template>
    <div class="menuList">
        <van-grid :gutter="5" :column-num="3">
            <van-grid-item icon="photo-o" text="扫码" @click="scanQrCode" >
                <van-image :src='require("../../../assets/canmera.png")' width="45" height="45" >
                </van-image>
                <span class="des">扫码报工</span>
            </van-grid-item>
            <van-grid-item @click="showHistory">
                <van-image :src='require("../../../assets/history.png")' width="45" height="45" >
                </van-image>
                <span class="des">历史记录</span>
            </van-grid-item>
            <van-grid-item icon="photo-o">
                <van-image src="" width="45" height="45" >
                </van-image>
                <span class="des"></span>
            </van-grid-item>
        </van-grid>
    </div>
</template>

<script>
    import {Toast} from 'vant'
    export default {
        name: "menuList",

        methods:{
            scanQrCode(){
                if("undefined"===typeof(app_form)) {
                    this.func_qrcode("369087579619852288");

                    return;
                }
                app_form.func_ui_showInputDialog();
            },
            showHistory(){
                this.$router.push({
                    path:'/history',
                })
            },

            func_qrcode(code){
                code = "369087579619852288#3"
                let id = code.split('#')[0];
                let boxNumber = code.split('#')[1];

                if(!id){
                    Toast.fail("获取失败");
                }else{
                    this.$router.push({
                        path:'/logs',
                        query:{
                            id,
                            boxNumber
                        }
                    })
                }

            }
        },

        mounted(){
            window.func_qrcode = this.func_qrcode;
        },
    }
</script>

<style lang="less" scoped>
    .menuList{
        .des{
            font-size: 12px;
            margin-top: 5px;
        }
        margin-top: 50px;
        /deep/ .van-grid-item{
            .van-grid-item__content{
                padding: 10px 8px;
            }
        }

    }
</style>
