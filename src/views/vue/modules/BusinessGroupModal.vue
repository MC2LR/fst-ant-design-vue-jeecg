<template>
  <a-modal
    :title="title"
    :width="width"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="閉じる">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item label="番号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'businessGroupCode', validatorRules.businessGroupCode]" placeholder="番号を入力してください"></a-input>
        </a-form-item>
        <a-form-item label="業務グループ名" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'businessGroupName', validatorRules.businessGroupName]" placeholder="業務グループ名を入力してください"></a-input>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="業務分類１"
          hasFeedback>
          <a-select
            placeholder="業務分類１を選んでください"
            :value="selectedItems1"
            @change="handleChange1"
            style="width: 90%"
          >
            <a-select-option v-for="(item,index) in filteredOptions1" :key="index" :value="item.id" >
              {{ item.businessTypeName }}
            </a-select-option>
          </a-select>
          <a-button @click="selectedItems1='',selectedItems2='',selectedItems3='',selectedItems4='',selectedItems5=''" icon="close"></a-button>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="業務分類２"
          v-show="selectedItems1"
          hasFeedback>
          <a-select
            placeholder="業務分類２を選んでください"
            :value="selectedItems2"
            @change="handleChange2"
            style="width: 90%"
          >
            <a-select-option v-for="(item,index) in filteredOptions2" :key="index" :value="item.id">
              {{ item.businessTypeName }}
            </a-select-option>
          </a-select>
          <a-button @click="selectedItems2='',selectedItems3='',selectedItems4='',selectedItems5=''" icon="close"></a-button>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="業務分類３"
          v-show="selectedItems1&&selectedItems2"
          hasFeedback>
          <a-select
            placeholder="業務分類３を選んでください"
            :value="selectedItems3"
            @change="handleChange3"
            style="width: 90%"
          >
            <a-select-option v-for="(item,index) in filteredOptions3" :key="index" :value="item.id">
              {{ item.businessTypeName }}
            </a-select-option>
          </a-select>
          <a-button @click="selectedItems3='',selectedItems4='',selectedItems5=''" icon="close"></a-button>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          v-show="selectedItems2&&selectedItems3&&selectedItems1"
          :wrapperCol="wrapperCol"
          label="業務分類４"
          hasFeedback>
          <a-select
            placeholder="業務分類４を選んでください"
            :value="selectedItems4"
            @change="handleChange4"
            style="width: 90%"
          >
            <a-select-option v-for="(item,index) in filteredOptions4" :key="index" :value="item.id">
              {{ item.businessTypeName }}
            </a-select-option>
          </a-select>
          <a-button @click="selectedItems4='',selectedItems5=''" icon="close"></a-button>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          v-show="selectedItems2&&selectedItems3&&selectedItems1&&selectedItems4"
          :wrapperCol="wrapperCol"
          label="業務分類５"
          hasFeedback>
          <a-select
            placeholder="業務分類５を選んでください"
            :value="selectedItems5"
            @change="handleChange5"
            style="width: 90%"
          >
            <a-select-option v-for="(item,index) in filteredOptions5" :key="index" :value="item.id">
              {{ item.businessTypeName }}
            </a-select-option>
          </a-select>
          <a-button @click="selectedItems5=''" icon="close"></a-button>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>

  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import { duplicateCheck } from '@/api/api'
  import { deleteAction, getAction,downFile } from '@/api/manage'
  import Vue from 'vue'
  import { ACCESS_TOKEN } from "@/store/mutation-types"

  export default {
    name: "BusinessGroupModal",
    components: { 
    },
    data () {
      return {
        form: this.$form.createForm(this),
        title:"操作",
        width:800,
        visible: false,
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },

        confirmLoading: false,
        validatorRules:{
          businessGroupName:{ rules: [{ required: true, message: '業務グループ名なし' }] },
          businessGroupCode:{ 
            rules: [
              {
                required: true,
                message: "番号を入力してください"
              },
              {
                validator: this.myValidate
              }
            ]
          },
          enterpriseId:{},
          shopId:{},
          businessTypeId1:{},
          businessTypeId2:{},
          businessTypeId3:{},
          businessTypeId4:{},
          businessTypeId5:{},
        },
        url: {
          add: "/test/businessGroup/add",
          edit: "/test/businessGroup/edit",
          businessTypeList: "/test/businessType/list2",
          businessTypeList_display: "/test/businessType/list3",
        },
        businessTypeList:[],
        businessTypeList_display:[],
        selectedItems:[],
        selectedItems1:[],
        selectedItems2:[],
        selectedItems3:[],
        selectedItems4:[],
        selectedItems5:[],
        mode:'e',
        business1:''
      }
    },
    created () {
    },
    computed: {
      filteredOptions1() {

        console.log("报错前")
        console.log(this.selectedItems1)
        console.log(this.selectedItems1)
        console.log(this.businessTypeList)
        
        return this.businessTypeList;
      },
      filteredOptions2() {
        if (typeof(this.selectedItems1)=="undefined"&&
        typeof(this.selectedItems2)=="undefined"&&
        typeof(this.selectedItems3)=="undefined"&&
        typeof(this.selectedItems4)=="undefined"&&
        typeof(this.selectedItems5)=="undefined") {
          return this.businessTypeList
        }
        if (this.selectedItems1==""&&
        this.selectedItems2==""&&
        this.selectedItems3==""&&
        this.selectedItems4==""&&
        this.selectedItems5=="") {
          return this.businessTypeList
        }
        if (this.business1) {
          return this.businessTypeList.filter(
            o => !this.selectedItems1.includes(o.id)
          ).filter(
            o => !this.selectedItems3.includes(o.id)
          ).filter(
            o => !this.selectedItems4.includes(o.id)
          ).filter(
            o => !this.selectedItems5.includes(o.id)
          ).filter(
            o => this.business1.includes(o.business1)
          );
        }
        return this.businessTypeList.filter(
          o => !this.selectedItems1.includes(o.id)
        ).filter(
          o => !this.selectedItems3.includes(o.id)
        ).filter(
          o => !this.selectedItems4.includes(o.id)
        ).filter(
          o => !this.selectedItems5.includes(o.id)
        );
      },
      filteredOptions3() {
        if (typeof(this.selectedItems1)=="undefined"&&
        typeof(this.selectedItems2)=="undefined"&&
        typeof(this.selectedItems3)=="undefined"&&
        typeof(this.selectedItems4)=="undefined"&&
        typeof(this.selectedItems5)=="undefined") {
          return this.businessTypeList
        }
        if (this.selectedItems1==""&&
        this.selectedItems2==""&&
        this.selectedItems3==""&&
        this.selectedItems4==""&&
        this.selectedItems5=="") {
          return this.businessTypeList
        }
        if (this.business1) {
          return this.businessTypeList.filter(
            o => !this.selectedItems1.includes(o.id)
          ).filter(
            o => !this.selectedItems2.includes(o.id)
          ).filter(
            o => !this.selectedItems4.includes(o.id)
          ).filter(
            o => !this.selectedItems5.includes(o.id)
          ).filter(
            o => this.business1.includes(o.business1)
          );
        }
        return this.businessTypeList.filter(
          o => !this.selectedItems1.includes(o.id)
        ).filter(
          o => !this.selectedItems2.includes(o.id)
        ).filter(
          o => !this.selectedItems4.includes(o.id)
        ).filter(
          o => !this.selectedItems5.includes(o.id)
        );
      },
      filteredOptions4() {
        if (typeof(this.selectedItems1)=="undefined"&&
        typeof(this.selectedItems2)=="undefined"&&
        typeof(this.selectedItems3)=="undefined"&&
        typeof(this.selectedItems4)=="undefined"&&
        typeof(this.selectedItems5)=="undefined") {
          return this.businessTypeList
        }
        if (this.selectedItems1==""&&
        this.selectedItems2==""&&
        this.selectedItems3==""&&
        this.selectedItems4==""&&
        this.selectedItems5=="") {
          return this.businessTypeList
        }
        if (this.business1) {
          return this.businessTypeList.filter(
            o => !this.selectedItems1.includes(o.id)
          ).filter(
            o => !this.selectedItems2.includes(o.id)
          ).filter(
            o => !this.selectedItems3.includes(o.id)
          ).filter(
            o => !this.selectedItems5.includes(o.id)
          ).filter(
            o => this.business1.includes(o.business1)
          );
        }
        return this.businessTypeList.filter(
          o => !this.selectedItems1.includes(o.id)
        ).filter(
          o => !this.selectedItems2.includes(o.id)
        ).filter(
          o => !this.selectedItems3.includes(o.id)
        ).filter(
          o => !this.selectedItems5.includes(o.id)
        );
      },
      filteredOptions5() {
        if (typeof(this.selectedItems1)=="undefined"&&
        typeof(this.selectedItems2)=="undefined"&&
        typeof(this.selectedItems3)=="undefined"&&
        typeof(this.selectedItems4)=="undefined"&&
        typeof(this.selectedItems5)=="undefined") {
          return this.businessTypeList
        }
        if (this.selectedItems1==""&&
        this.selectedItems2==""&&
        this.selectedItems3==""&&
        this.selectedItems4==""&&
        this.selectedItems5=="") {
          return this.businessTypeList
        }
        if (this.business1) {
          return this.businessTypeList.filter(
            o => !this.selectedItems1.includes(o.id)
          ).filter(
            o => !this.selectedItems2.includes(o.id)
          ).filter(
            o => !this.selectedItems3.includes(o.id)
          ).filter(
            o => !this.selectedItems4.includes(o.id)
          ).filter(
            o => this.business1.includes(o.business1)
          );
        }
        return this.businessTypeList.filter(
          o => !this.selectedItems1.includes(o.id)
        ).filter(
          o => !this.selectedItems2.includes(o.id)
        ).filter(
          o => !this.selectedItems3.includes(o.id)
        ).filter(
          o => !this.selectedItems4.includes(o.id)
        );
      },
    },
    methods: {
      loadBusinessType(){
        try {
          getAction(this.url.businessTypeList, {}).then((res) => {
            if (res.success) {
              this.businessTypeList = res.result;
              console.log(this.businessTypeList)
              this.loadBusinessType_display();
            }
            if(res.code===510){
              this.$message.warning(res.message)
            }
            this.loading = false;
          })
        } catch (error) {
          this.$message.error("businessTypeList get error 300line!")
        }
      },
      loadBusinessType_display(){
        try {
          getAction(this.url.businessTypeList_display, {}).then((res) => {
            if (res.success) {
              this.businessTypeList_display = res.result;
              console.log(this.businessTypeList_display)
              this.myFilter()
            }
            if(res.code===510){
              this.$message.warning(res.message)
            }
            this.loading = false;
          })
        } catch (error) {
          this.$message.error("businessTypeList get error 280line!")
        }
      },
      myFilter(){
        console.log(this.businessTypeList)
        if (this.model.businessTypeId1) {
          this.businessTypeList_display.forEach(element => {
            console.log(this.model.businessTypeId1)
            console.log(element.id)
            if (this.model.businessTypeId1 == element.id) {
              console.log(this.business1)
              this.business1 = element.business1;
              this.businessTypeList.push(element)
            }
          });
          this.selectedItems1 = this.model.businessTypeId1;
        }
        if (this.model.businessTypeId2) {
          this.businessTypeList_display.forEach(element => {
            if (this.model.businessTypeId2 == element.id) {
              this.businessTypeList.push(element)
            }
          });
          this.selectedItems2 = this.model.businessTypeId2;
        }
        if (this.model.businessTypeId3) {
          this.businessTypeList_display.forEach(element => {
            if (this.model.businessTypeId3 == element.id) {
              this.businessTypeList.push(element)
            }
          });
          this.selectedItems3 = this.model.businessTypeId3;
        }
        if (this.model.businessTypeId4) {
          this.businessTypeList_display.forEach(element => {
            if (this.model.businessTypeId4 == element.id) {
              this.businessTypeList.push(element)
            }
          });
          this.selectedItems4 = this.model.businessTypeId4;
        }
        if (this.model.businessTypeId5) {
          this.businessTypeList_display.forEach(element => {
            if (this.model.businessTypeId5 == element.id) {
              this.businessTypeList.push(element)
            }
          });
          this.selectedItems5 = this.model.businessTypeId5;
        }
      },
      add () {
        this.edit({});
        this.mode = "a";
      },
      edit (record) {

        this.loadBusinessType();
        // this.loadBusinessType_display();

        this.selectedItems1 = '';
        this.selectedItems2 = '';
        this.selectedItems3 = '';
        this.selectedItems4 = '';
        this.selectedItems5 = '';

        if (this.businessTypeList) {
        }else{
          this.businessTypeList = [];
        }
        if (this.businessTypeList_display) {
        }else{
          this.businessTypeList_display = [];
        }

        this.form.resetFields();

        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          
          this.form.setFieldsValue(pick(this.model,'businessGroupName','businessGroupCode'))
        })
        
      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            if(!this.model.id){
              httpurl+=this.url.add;
              method = 'post';
            }else{
              httpurl+=this.url.edit;
               method = 'put';
            }
            console.log(this.selectedItems1)
            if (this.selectedItems1 == "") {
                that.$message.warning("少なくとも1つのタイプを選択する必要があります");
                that.confirmLoading = false;
                return;
            }
            this.model.businessTypeId1 = this.selectedItems1;
            this.model.businessTypeId2 = this.selectedItems2;
            this.model.businessTypeId3 = this.selectedItems3;
            this.model.businessTypeId4 = this.selectedItems4;
            this.model.businessTypeId5 = this.selectedItems5;
            let formData = Object.assign(this.model, values);
            console.log("表单提交数据",formData)
            console.log("表单提交数据",this.selectedItems1)
 
            httpAction(httpurl,formData,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
              that.close();
            })
          }
         
        })
      },
      handleChange1(selectedItems) {
        this.selectedItems2 = '';
        this.selectedItems3 = '';
        this.selectedItems4 = '';
        this.selectedItems5 = '';

        this.selectedItems1 = selectedItems
        this.businessTypeList.forEach((element,index) => {
          if (element.id == selectedItems) {
            this.business1 = element.business1
            console.log(this.business1)
            console.log(element)
          }
        });
        console.log(this.selectedItems1)
      },
      handleChange2(selectedItems) {
        this.selectedItems3 = '';
        this.selectedItems4 = '';
        this.selectedItems5 = '';

        this.selectedItems2 = selectedItems
        this.businessTypeList.forEach((element,index) => {
          if (element.id == selectedItems) {
            this.business1 = element.business1
            console.log(this.business1)
            console.log(element)
          }
        });
        console.log(this.selectedItems2)
      },
      handleChange3(selectedItems) {
        this.selectedItems4 = '';
        this.selectedItems5 = '';

        this.selectedItems3 = selectedItems
        this.businessTypeList.forEach((element,index) => {
          if (element.id == selectedItems) {
            this.business1 = element.business1
            console.log(this.business1)
            console.log(element)
          }
        });
        console.log(this.selectedItems3)
      },
      handleChange4(selectedItems) {
        this.selectedItems5 = '';

        this.selectedItems4 = selectedItems
        this.businessTypeList.forEach((element,index) => {
          if (element.id == selectedItems) {
            this.business1 = element.business1
            console.log(this.business1)
            console.log(element)
          }
        });
        console.log(this.selectedItems4)
      },
      handleChange5(selectedItems) {
        this.selectedItems5 = selectedItems
        this.businessTypeList.forEach((element,index) => {
          if (element.id == selectedItems) {
            this.business1 = element.business1
            console.log(this.business1)
            console.log(element)
          }
        });
        console.log(this.selectedItems5)
      },
      handleCancel () {
        this.close()
      },
      popupCallback(row){
        this.form.setFieldsValue(pick(row,'businessGroupName','enterpriseId','shopId' ,'businessGroupCode'))
        if (this.model.businessTypeId1) {
          this.selectedItems1 = this.model.businessTypeId1;
        }
        if (this.model.businessTypeId2) {
          this.selectedItems2 = this.model.businessTypeId2;
        }
        if (this.model.businessTypeId3) {
          this.selectedItems3 = this.model.businessTypeId3;
        }
        if (this.model.businessTypeId4) {
          this.selectedItems4 = this.model.businessTypeId4;
        }
        if (this.model.businessTypeId5) {
          this.selectedItems5 = this.model.businessTypeId5;
        }
      },
      myValidate(rule, value, callback) {
        var params = {
          tableName: 'm_business_group',
          fieldName: 'business_group_code',
          fieldVal: value,
          dataId: this.model.id
        }
        duplicateCheck(params).then(res => {
          if (res.success) {
            callback()
          } else {
            callback("データは既に存在します。再入力してください")
          }
        })
      },
    }
  }
</script>