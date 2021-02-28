const axios =require("axios");
import qs from 'qs'
import {Toast} from 'vant'

let baseURL = "/api/"

const instance = axios.create({
    baseURL,
    timeout:5000,
});
instance.interceptors.response.use(function (response) {
    return response.data;
}, function (error) {
    return Promise.reject(error);
});


const fetch = (ourl,params,methods='post') => {

    return new Promise((resolve,reject) => {
        let url = ourl;
        if(methods == 'get'){
            url = ourl + '?' + qs.stringify(params);
        }
        instance[methods](url, params).then(res=>{

            if(res.code == '200'){
                resolve(res)
            }else{
                Toast.fail(res.msg);
            }
        }).catch((err)=>{

            Toast.fail(err);
            reject(err);

        })
    })
}

export default {
    login(param){
        return fetch('/user/login')
    },
    ///open/process/get
    getProcessById(param){
        return fetch('/open/process/get',param,'get')
    },
    getByNo(param){
        return fetch('/open/emp/getByNo',param,'get')
    },
    getProductList(param={}){
        param.size = 1000
        return fetch('/open/product/page',param,)
    },
    getProductByProcessId(param={}){
        return fetch('/open/product/getByProcessId',param,'get')
    },
//  /open/rep/insert
    insert(param={}){
        return fetch('/open/rep/insert',param,)
    },
    listByEmpId(param={}){
        return fetch('/open/rep/listByEmpId',param,)
    },
}
