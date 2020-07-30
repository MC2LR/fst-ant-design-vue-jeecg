<template>
  <a-tree-select
    allowClear
    labelInValue
    style="width: 100%"
    :disabled="disabled"
    :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
    :placeholder="placeholder"
    :loadData="asyncLoadTreeData"
    :value="treeValue"
    :treeData="treeData"
    :multiple="multiple"
    @change="onChange">
  </a-tree-select>
</template>
<script>

  import { getAction } from '@/api/manage'

  export default {
    name: 'JCategorySelect',
    props: {
      value:{
        type: String,
        required: false
      },
      placeholder:{
        type: String,
        default: '選択してください',
        required: false
      },
      disabled:{
        type:Boolean,
        default:false,
        required:false
      },
      condition:{
        type:String,
        default:'',
        required:false
      },
      // 複数選択をサポートするかどうか
      multiple: {
        type: Boolean,
        default: false,
      },
      loadTriggleChange:{
        type: Boolean,
        default: false,
        required:false
      },
      pid:{
        type:String,
        default:'',
        required:false
      },
      pcode:{
        type:String,
        default:'',
        required:false
      },
      back:{
        type:String,
        default:'',
        required:false
      }
    },
    data () {
      return {
        treeValue:"",
        treeData:[],
        url:"/sys/category/loadTreeData",
        view:'/sys/category/loadDictItem/',
        tableName:"",
        text:"",
        code:"",

      }
    },
    watch: {
      value () {
        this.loadItemByCode()
      },
      pcode(){
        this.loadRoot();
      }
    },
    created(){
      this.validateProp().then(()=>{
        this.loadRoot()
        this.loadItemByCode()
      })
    },
    methods: {
      /**第1レベルのノードを読み込む*/
      loadRoot(){
        let param = {
          pid:this.pid,
          pcode:this.pcode,
          condition:this.condition
        }
        getAction(this.url,param).then(res=>{
          if(res.success && res.result){
            for(let i of res.result){
              i.value = i.key
              if(i.leaf==false){
                i.isLeaf=false
              }else if(i.leaf==true){
                i.isLeaf=true
              }
            }
            this.treeData = [...res.result]
          }else{
            console.log("ツリーレベルのノードクエリ結果-else",res)
          }
        })
      },

      /** データエコー*/
      loadItemByCode(){
        if(!this.value || this.value=="0"){
          this.treeValue = ""
        }else{
          getAction(this.view,{ids:this.value}).then(res=>{
            console.log(124345)
            console.log(124345,res)
            if(res.success){
              let values = this.value.split(',')
              this.treeValue = res.result.map((item, index) => ({
                key: values[index],
                value: values[index],
                label: item
              }))
              this.onLoadTriggleChange(res.result[0]);
            }
          })
        }
      },
      onLoadTriggleChange(text){
        //選択したもののみがトリガーされます
        if(!this.multiple && this.loadTriggleChange){
          this.backValue(this.value,text)
        }
      },
      backValue(value,label){
        let obj = {}
        if(this.back){
          obj[this.back] = label
        }
        this.$emit('change', value, obj)
      },
      asyncLoadTreeData (treeNode) {
        return new Promise((resolve) => {
          if (treeNode.$vnode.children) {
            resolve()
            return
          }
          let pid = treeNode.$vnode.key
          let param = {
            pid:pid,
            condition:this.condition
          }
          getAction(this.url,param).then(res=>{
            if(res.success){
              for(let i of res.result){
                i.value = i.key
                if(i.leaf==false){
                  i.isLeaf=false
                }else if(i.leaf==true){
                  i.isLeaf=true
                }
              }
              this.addChildren(pid,res.result,this.treeData)
              this.treeData = [...this.treeData]
            }
            resolve()
          })
        })
      },
      addChildren(pid,children,treeArray){
        if(treeArray && treeArray.length>0){
          for(let item of treeArray){
            if(item.key == pid){
              if(!children || children.length==0){
                item.isLeaf=true
              }else{
                item.children = children
              }
              break
            }else{
              this.addChildren(pid,children,item.children)
            }
          }
        }
      },

      onChange(value){
        if(!value){
          this.$emit('change', '');
          this.treeValue = ''
        } else if (value instanceof Array) {
          //this.$emit('change', value.map(item => item.value).join(','))
          //this.treeValue = value
        } else {
          this.backValue(value.value,value.label)
          this.treeValue = value
        }
      },
      getCurrTreeData(){
        return this.treeData
      },
      validateProp(){
        let mycondition = this.condition
        return new Promise((resolve,reject)=>{
          if(!mycondition){
            resolve();
          }else{
            try {
              let test=JSON.parse(mycondition);
              if(typeof test == 'object' && test){
                resolve()
              }else{
                this.$message.error("コンポーネントJTreeSelect-conditionが間違った値を渡しました。json文字列が必要です！")
                reject()
              }
            } catch(e) {
              this.$message.error("コンポーネントJTreeSelect-conditionが間違った値を渡しました。json文字列が必要です！")
              reject()
            }
          }
        })
      }
    },
    //2.2コンポーネントの新しい定義親コンポーネントが呼び出されたときに、値を渡すプロパティとイベントタイプを指定する
    model: {
      prop: 'value',
      event: 'change'
    }
  }
</script>
