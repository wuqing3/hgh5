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
                    <span class="product-label">箱子号码</span>
                </template>
                <template #input>
                    {{boxCode}}
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

            <van-image
                    width="160"
                    height="100"
                    :src="src"
            />

        </div>

        <div style="margin: 16px;position: absolute;bottom: 0;display: flex; justify-content: space-between;width:calc(100% - 42px);">
            <van-button icon="arrow-left" type="warning" style="width: 100px" @click="back">返回</van-button>
            <van-button icon="success" type="info" style="width: 100px" @click="onSubmit">提交</van-button>
            <van-button v-if="photoStatus" icon="photograph" type="primary" style="width:100px;" @click="takePhoto">拍照</van-button>
            <van-button v-if="!photoStatus" plain icon="upgrade" type="primary" style="width:100px;" @click="uploadPics">上传</van-button>
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
                photoStatus:true,
                src:'',
                picSrc:'',
                jpgName:'',

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
            uploadPics(){

                let bstr = atob(this.src.split(',')[1]);
                let n = bstr.length;
                let u8arr = new Uint8Array(n);
                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n);
                }

                let file= new File([u8arr],this.jpgName,{type:'image/jpg'});
                let formData = new FormData();
                formData.append('file',file);
                this.$api.uploadPic(formData).then(res => {
                    this.picSrc = res.data;
                    Toast.success(res.msg);
                }).catch(err => {
                    Toast.fail(err);
                })
            },
            getProcessById(id){
                let param = {
                    id:id
                }
                this.$api.getProcessById(param).then(res=>{
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
                this.boxCode = this.$route.query.boxCode;
                let param = {
                    "empId": this.userInfo.id,
                    jobNo:this.jobNo,
                    "empName": this.userInfo.name,
                    "processId": this.processInfo.id,
                    "processName": this.processInfo.processName,
                    "productId":  this.productList[this.index].id,
                    "productName":  this.productList[this.index].productName,
                    "reportNum": this.number,
                    boxCode:this.boxCode,
                    pic:this.picSrc,
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
                let jpgName = new Date().getTime() +'.jpg';
                this.jpgName = jpgName;
                app_form.func_media_takePhoto(jpgName);
            },
            func_photo(x,y,z) {
                // x = 'data:image/jpg;base64,'
                // y = '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'
                this.src = x + y;
                this.photoStatus = false;
            }
        },
        mounted(){
            let id = this.$route.query.id;
            this.boxCode = this.$route.query.boxCode;



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
