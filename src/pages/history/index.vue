<template>
    <div class="record">
        <div class="search-box">
<!--            <van-button type="info" size="small"> 扫描工号</van-button>-->
<!--            <input type="text" v-model="value" class="input">-->
<!--            <div class="search-btn" @click="onClick">搜索</div>-->
            <van-field v-model="value"  placeholder="请输入工号" label-width="100">
                <template #label>
                    <van-button type="info" size="small" @click="scanJobNumber">扫描工号</van-button>
                </template>
                <template #button>
                    <van-button type="primary" size="small" @click="onClick">🔍搜索</van-button>
                </template>
            </van-field>
        </div>
        <van-divider contentPosition="center">填报记录</van-divider>
        <div class="histroyList">
            <div class="item-header item">
                <span>员工</span>
                <span>产品型号</span>
                <span>工序名称</span>
                <span>数量</span>
<!--                <span>工时</span>-->
                <span>总工时</span>
            </div>
            <div class="item" v-for="(item,index) in histroyList" :key="index">
                <span>{{item.empName}}</span>
                <span>{{item.productName}}</span>
                <span>{{item.processName}}</span>
                <span>{{item.reportNum}}</span>
<!--                <span>{{item.processTimes}}</span>-->
                <span>{{item.reportNum * item.processTimes}}</span>
            </div>
        </div>
        <div style="margin: 16px;position: absolute;bottom: 0px;">
            <van-button icon="arrow-left" type="warning" style="margin-right: 20px;width: 100px" @click="back">返回</van-button>

        </div>
    </div>
</template>
<script>
    export default {
        name:'history',
        data(){
            return {
                value:'',
                histroyList:[
                ]
            }
        },
        methods:{
            onClick(e){
                console.log(e)
                this.$api.listByEmpId({jobNo:this.value,isCheck:'0'}).then(res=>{
                    console.log(res)
                    this.histroyList = res.data
                })
            },
            scanJobNumber(){
                if("undefined"===typeof(app_form)) {
                    this.func_qrcode("");
                    return;
                }
                app_form.func_ui_showInputDialog();
            },
            func_qrcode(id){
                if(id){
                    this.value = id;
                    this.onClick()
                }
            },
            back(){
                this.$router.go(-1);
            }
        },
        mounted(){
            window.func_qrcode = this.func_qrcode
        }
    }
</script>

<style lang="less" scoped>
    .record{
        padding: 5px;
        .van-cell{
            padding: 10px;
            /deep/ .van-field__button{
                line-height: 1;
            }
            /deep/ .van-field__body{
                height: 100%;
            }
        }
    }

    .histroyList{
        width:100%;

    }
    .histroyList .item{
        display: flex;
        justify-content: space-around;
        border-bottom:1px solid #aaaaaa;
        padding: 10px 5px;

    }
    .histroyList .item span{
        display: inline-block;
        width:20%;
        font-size: 12px;
    }
    .search-box{
        width:100%;
        height:60px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

</style>
