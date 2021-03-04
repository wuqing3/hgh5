<template>
    <div class="logs">
        <div class="title">扫码报工</div>
        <div class="form">
            <van-field
                readonly
                clickable
                name="productName"
                :value="index"
                label-width="100"
                placeholder="点击选择产品"
                @click="showPicker = true"
            >
                <template #label>
                    <span class="product-label">产品</span>
                </template>
                <template #input v-if="productList[0]">
                  {{productList[index].productName}}--{{productCodeS[index]}}
                </template>
                <template #button>
                    <van-icon name="arrow" size="16"/>
                </template>
            </van-field>
            <van-field
                readonly
                label-width="100"
            >
                <template #label>
                    <span class="product-label">工序名称</span>
                </template>
                <template #input>
                    {{processInfo.processName}}
                </template>
            </van-field>
            <van-field
                readonly
                label-width="100"
            >
                <template #label>
                    <span class="product-label">工序时间</span>
                </template>
                <template #input>
                    {{processTimeS[index]}}（秒）
                </template>
            </van-field>
            <van-field
                readonly
                label-width="100"
            >
                <template #label>
                    <span class="product-label">填报工时</span>
                </template>
                <template #input>
                    {{allTime}}（秒）
                </template>
            </van-field>
        </div>
        <div class="form" style="margin-top: 15px;">
            <van-field
                    name="productName"
                    label-width="100"
                    placeholder="填写或扫描工号"
                    v-model="jobNo"
            >
                <template #label>
                    <van-button type="info" size="small" @click="scanJobNumber">扫描工号</van-button>
                </template>

            </van-field>
            <van-field
                    name="productName"
                    label-width="100"
                    placeholder="填写工作量"
                    v-model="number"
            >
                <template #label>
                    <span class="product-label">上报数量</span>
                </template>
            </van-field>
        </div>


        <div style="margin:20px 16px;">
<!--            /type="file" accept="image/*" capture="camera"-->
            <van-button block size="large"  native-type="file" icon="photograph" type="info" style="height: 80px;" @click="takePhoto">拍照</van-button>
        </div>

        <div style="margin: 16px;position: absolute;bottom: 0">
            <van-button icon="arrow-left" type="warning" style="margin-right: 20px;width: 100px" @click="back">返回</van-button>
            <van-button icon="success" type="info" style="width: 100px" @click="onSubmit">提交</van-button>
        </div>
        <van-popup v-model="showPicker" position="bottom"  round :style="{height:'60%'}">
            <van-picker

                    show-toolbar
                    :columns="productNames"
                    @confirm="onConfirm"
                    @cancel="showPicker = false"
            />
        </van-popup>

    </div>
</template>

<script>
    import {Toast} from 'vant'
    import { Dialog } from 'vant';
    export default {
        name: "index",
        data(){
            return {
                username:'',
                password:'',
                showPicker:false,

                index:0,
                mode: 'selector',
                number:'',
                jobNo:'',
                productId:'',
                userInfo:{},
                processName:'',
                productNames:[],
                productCodeS:[],
                processTimeS:[],
                productList:[],
                processInfo:{

                }
            }
        },
        computed:{
            allTime(){
                if(this.number && this.processTimeS.length>0){
                    return this.number*this.processTimeS[this.index]
                }else {
                    return 0
                }
            },
        },

        methods:{
            back(){
                this.$router.go(-1)
            },
            getProductList(id){
                this.$api.getProductByProcessId({processId:id}).then(res=>{
                    console.log(res)
                    if(!res.data.length){
                        Toast.fail("工序未绑定流程卡")
                        this.$router.go(-1)
                    }
                    this.productList = res.data
                    this.productNames = this.productList.map(target=>target.productName)
                    this.productCodeS = this.productList.map(target=>target.productCode)
                    this.processTimeS = this.productList.map(target=>target.processTime)
                })
            },
            onConfirm(v,index){
                console.log(index);
                this.index = index;
                this.showPicker = false;
            },

            getProcessById(id){
                let param = {
                    id:id
                }
                this.$api.getProcessById(param).then(res=>{
                    console.log(res);
                    if(res.data){
                        this.processInfo = res.data
                    }
                    else {
                         Toast.fail("无此工序")
                         this.$router.go(-1)
                    }
                })
            },

            scanJobNumber(){
                if("undefined"===typeof(app_form)) {
                    this.func_qrcode("10001");
                    return;
                }
                app_form.func_ui_showInputDialog();
            },
            func_qrcode(id){
                if(id){
                    this.jobNo = id;
                    // this.getByNo();
                }
            },

            insert(){
                let param = {
                    "empId": this.userInfo.id,
                    jobNo:this.jobNo,
                    "empName": this.userInfo.name,
                    "processId": this.processInfo.id,
                    "processName": this.processInfo.processName,
                    "productId":  this.productList[this.index].id,
                    "productName":  this.productList[this.index].productName,
                    "reportNum": this.number,
                     processTime:this.processTimeS[this.index]
                }

                this.$api.insert(param).then(res=>{
                    Toast.success("填报成功！");
                    this.$router.go(-1)
                })
            },



            getByNo(){
                // jobNo
                this.$api.getByNo({jobNo:this.jobNo}).then(res=>{
                    console.log(res);
                    if(res.data){
                        this.userInfo = res.data
                        this.insert()
                    }
                    else {
                        Toast.fail("工号不存在");
                    }
                })
            },
            onSubmit(){
                if(this.jobNo == ''){
                    Toast.fail("填写工号!");
                    return false;
                }
                if(this.number===''){
                    Toast.fail('请填写报工数量')
                    return
                }
                Dialog.confirm({
                    title:'',
                    message:'确认提交报工吗？'
                }).then(() => {
                    this.getByNo();
                }).catch(() => {

                })



            },
            takePhoto(){
                if("undefined" === typeof(app_form)){
                    this.func_photo();
                    return
                }
                console.log(app_form)
                // app_form.func_ui_showInputDialog();
                app_form.func_media_takePhoto();
            },
            func_photo(x) {
                console.log(x)
            }
        },
        mounted(){
            let id = this.$route.query.id;
            this.getProcessById(id)
            this.getProductList(id);

            window.func_qrcode = this.func_qrcode;
            window.func_photo = this.func_photo;
        }
    }
</script>

<style lang="less" scoped>
    .logs{
        /*border:1px solid red;*/
        background:#f6f7f9;
        padding: 0px 5px;
        .title{
            margin: 20px;
            height: 40px;
            line-height: 40px;
            font-weight: 700;
            font-size: 24px;

        }
        .form{
            .product-label{
                font-weight: 700;
                font-size:16px;
            }

        }
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

</style>
