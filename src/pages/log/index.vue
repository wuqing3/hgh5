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
                    {{boxNumber}}
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

                let file= new File([u8arr],jpgName,{type:'image/jpg'});
                let formData = new FormData()
                formData.append('file',file)

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
                let boxNumber = this.$route.query.boxNumber;
                let param = {
                    "empId": this.userInfo.id,
                    jobNo:this.jobNo,
                    "empName": this.userInfo.name,
                    "processId": this.processInfo.id,
                    "processName": this.processInfo.processName,
                    "productId":  this.productList[this.index].id,
                    "productName":  this.productList[this.index].productName,
                    "reportNum": this.number,
                    boxNumber,
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
                this.src = x + y;
                this.photoStatus = false;
            }
        },
        mounted(){
            let id = this.$route.query.id;
            this.boxNumber = this.$route.query.boxNumber;



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
