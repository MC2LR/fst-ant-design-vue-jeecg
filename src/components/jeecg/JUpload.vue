<template>
  <a-upload
    name="file"
    :multiple="true"
    :action="uploadAction"
    :headers="headers"
    :data="{'isup':1,'bizPath':bizPath}"
    :fileList="fileList"
    :beforeUpload="beforeUpload"
    @change="handleChange"
    :disabled="disabled">
    <a-button>
      <a-icon type="upload" />{{ text }}
    </a-button>
  </a-upload>
</template>

<script>

  import Vue from 'vue'
  import { ACCESS_TOKEN } from "@/store/mutation-types"

  const FILE_TYPE_ALL = "all"
  const FILE_TYPE_IMG = "image"
  const FILE_TYPE_TXT = "file"
  const uidGenerator=()=>{
    return '-'+parseInt(Math.random()*10000+1,10);
  }
  const getFileName=(path)=>{
    if(path.lastIndexOf("\\")>=0){
      let reg=new RegExp("\\\\","g");
      path = path.replace(reg,"/");
    }
    return path.substring(path.lastIndexOf("/")+1);
  }
  export default {
    name: 'JUpload',
    data(){
      return {
        uploadAction:window._CONFIG['domianURL']+"/sys/common/upload",
        urlDownload:window._CONFIG['domianURL'] + "/sys/common/download/",
        headers:{},
        fileList: []
      }
    },
    props:{
      text:{
        type:String,
        required:false,
        default:"クリックをアップロード"
      },
      fileType:{
        type:String,
        required:false,
        default:FILE_TYPE_ALL
      },
      /*この属性は、ファイルのアップロードのビジネスパスを制御するために使用されます*/
      bizPath:{
        type:String,
        required:false,
        default:"temp"
      },
      value:{
        type:String,
        required:false
      },
      // update-begin- --- author:wangshuai ------ date:20190929 ---- for:Juploadコンポーネントをクリックできるかどうか
      disabled:{
        type:Boolean,
        required:false,
        default: false
      },
      // update-end- --- author:wangshuai ------ date:20190929 ---- for:Juploadコンポーネントをクリックできるかどうか
      //この属性は廃止されました
      triggerChange:{
        type: Boolean,
        required: false,
        default: false
      },
    },
    watch:{
      value(val){
        this.initFileList(val)
      }
    },
    created(){
      const token = Vue.ls.get(ACCESS_TOKEN);
      this.headers = {"X-Access-Token":token}
    },

    methods:{
      initFileList(paths){
        if(!paths || paths.length==0){
          //return [];
          // update-begin- --- author:os_chengtgen ------ date:20190729 ---- for:issues:326,Juploadコンポーネントの初期化バグ
          this.fileList = [];
          return;
          // update-end- --- author:os_chengtgen ------ date:20190729 ---- for:issues:326,Juploadコンポーネントの初期化バグ
        }
        let fileList = [];
        let arr = paths.split(",")
        for(var a=0;a<arr.length;a++){
          fileList.push({
            uid:uidGenerator(),
            name:getFileName(arr[a]),
            status: 'done',
            url: this.urlDownload+arr[a],
            response:{
              status:"history",
              message:arr[a]
            }
          })
        }
        this.fileList = fileList
      },
      handlePathChange(){
        let uploadFiles = this.fileList
        let path = ''
        if(!uploadFiles || uploadFiles.length==0){
          path = ''
        }
        let arr = [];

        for(var a=0;a<uploadFiles.length;a++){
          arr.push(uploadFiles[a].response.message)
        }
        if(arr.length>0){
          path = arr.join(",")
        }
        this.$emit('change', path);
      },
      beforeUpload(file){
        var fileType = file.type;
        if(fileType===FILE_TYPE_IMG){
          if(fileType.indexOf('image')<0){
            this.$message.warning('写真をアップロードしてください');
            return false;
          }
        }else if(fileType===FILE_TYPE_TXT){
          if(fileType.indexOf('image')>=0){
            this.$message.warning('ファイルをアップロードしてください');
            return false;
          }
        }
        //TODO 拡張機能検証ファイルのサイズ
        return true
      },
      handleChange(info) {
        console.log("--ファイルリストの変更--")
        let fileList = info.fileList
        if(info.file.status==='done'){
          if(info.file.response.success){
            fileList = fileList.map((file) => {
              if (file.response) {
                file.url = this.urlDownload+file.response.message;
              }
              return file;
            });
          }
          this.$message.success(`${info.file.name} アップロードが完了しました！`);
        }else if (info.file.status === 'error') {
          this.$message.error(`${info.file.name} アップロードに失敗しました。`);
        }else if(info.file.status === 'removed'){
          this.handleDelete(info.file)
        }
        this.fileList = fileList
        if(info.file.status==='done' || info.file.status === 'removed'){
          this.handlePathChange()
        }
      },
      handleDelete(file){
        //必要に応じて追加 削除ロジック
        console.log(file)
      },
    },
    model: {
      prop: 'value',
      event: 'change'
    }
  }
</script>

<style scoped>

</style>