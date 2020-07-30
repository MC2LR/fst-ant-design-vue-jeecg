<template>
  <a-modal
    :title="title"
    :width="width"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    :cancelText="$t('close')">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item :label="$t('areaDefNmae')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <!-- <a-input v-decorator="[ 'monitorAreaId', validatorRules.monitorAreaId]" placeholder="请输入区域定义"></a-input> -->
          <a-select  v-model="L1_selected" v-decorator="['monitorAreaId', {rules: [{ required: true, message: this.$t('writeAreaDefName') }]}]" :placeholder="$t('writeAreaDefName')">
                <a-select-option
                  v-for="(area, index) in areaDefinitions"
                  :key="index"
                  :value="area.id"
                >{{ area.monitorAreaName}}</a-select-option>
              </a-select>
        </a-form-item>
        <a-form-item :label="$t('areaDeatilName')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <!-- <a-input v-model="areaDeatils" v-decorator="[ 'monitorAreaDetailsId', validatorRules.monitorAreaDetailsId]" placeholder="请输入区域详细"></a-input> -->
          <a-select  v-model="L2_selected" v-decorator="['monitorAreaDetailsId', {rules: [{ required: true, message: this.$t('writeAreadeName') }]}]" :placeholder="$t('writeAreadeName')">
                <a-select-option
                  v-for="(areadeatil, index) in selectedAreaDeatils"
                  :key="index"
                  :value="areadeatil.id"
                >{{ areadeatil.monitorAreaDetailsName }}</a-select-option>
              </a-select>
        </a-form-item>
        <a-form-item  :label="$t('patternName')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <!-- <a-input v-model="pattrens" v-decorator="[ 'monitorPatternId', validatorRules.monitorPatternId]" placeholder="请输入pattern"></a-input> -->
          <a-select  v-model="L3_selected" v-decorator="['monitorPatternId', {rules: [{ required: true, message: this.$t('writePatternName') }]}]" :placeholder="$t('writePatternName')">
                <a-select-option
                  v-for="(pa, index) in selectedPattrens"
                  :key="index"
                  :value="pa.id"
                >{{ pa.monitorPatternName }}</a-select-option>
              </a-select>
        </a-form-item>
        <a-form-item :label="$t('machine')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <!-- <a-input v-decorator="[ 'terminalId', validatorRules.terminalId]" placeholder="请输入端末ID"></a-input> -->
          <a-select  v-model="L3_selected" v-decorator="['terminalId', {rules: [{ required: true, message: this.$t('writeMachine') }]}]" :placeholder="$t('writeMachine')">
                <a-select-option
                  v-for="(ma, index) in machines"
                  :key="index"
                  :value="ma.id"
                >{{ ma.terminalName }}</a-select-option>
              </a-select>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>

  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import {getAction,downFile,postAction } from '@/api/manage'
  export default {
    name: "SysMonitorAreadetailsPatternModal",
    components: { 
    },
    data () {
      return {
        areaDefinitions:[],
        areaDeatils:[],
        pattrens:[],
        selectedAreaDefinitions:[],
        selectedAreaDeatils:[],
        selectedPattrens:[],
        machines:[],
        L1_selected:'',
        L2_selected:'',
        L3_selected:'',
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
        shopId:{},
        monitorAreaId:{},
        monitorAreaDetailsId:{},
        monitorPatternId:{},
        terminalId:{},
        delFlg:{},
        },
        url: {
          add: "/test/sysMonitorAreadetailsPattern/add",
          edit: "/test/sysMonitorAreadetailsPattern/edit",
          getAreaDef:"/test/mstMonitorAreaDefinition/list",
          getAreaDeatil:"/test/mstMonitorAreaDetails/list",
          getParten:"/test/mstMonitorPattern/list",
          getMachines:"/test/sysMonitorAreadetailsPattern/listMachine",


        }
      }
    },
    created () {
      this.loadAreaDef();
      this.loadAreaDeatils();
      this.loadParten();
      this.loadMachines();
      this.makeData();
    },
     watch:{
		    	L1_selected:function (val) {
            console.log('l1 selected ')
            console.log(val);
		            this.selectedAreaDeatils = this.areaDeatils.filter(function (x){ return x.monitorAreaId == val});
		            this.L2_selected = this.selectedAreaDeatils.length>0 ? this.areaDeatils[0].id : "";
		        },
		        L2_selected:function (val) {
              console.log('l2 selected ')
            console.log(val);
              console.log(this.pattrens);
                this.selectedPattrens = this.pattrens.filter(function (x){ return x.monitorAreaDetailsId == val});
                console.log(this.pattrens);
		            this.L3_selected = this.selectedPattrens.length>0 ? this.pattrens[0].id : "";
		        }
		    },
    methods: {
      makeData(){
        console.log('enter the makedata');
            this.L1_selected = this.areaDefinitions.length>0 ? this.areaDefinitions[0].id : "";
            var val = this.L1_selected
            console.log('L1_selected' + val);
            this.selectedAreaDeatils = this.areaDeatils.filter(function (x){ return x.monitorAreaId == val })
            console.log('L1_selected areaDeatils');
		        this.L2_selected = this.selectedAreaDeatils.length>0 ? this.areaDeatils[0].id : "";

		        var val = this.L2_selected;
            this.selectedPattrens = this.pattrens.filter(function (x){ return x.monitorAreaDetailsId == val })
            console.log('select pattern is ');
             console.log(this.pattrens);
		        this.L3_selected = this.pattrens.length>0 ? this.selectedPattrens[0].id : "";
    },
      loadAreaDef(){
         getAction(this.url.getAreaDef).then((res) => {
        if (res.success) {
        this.areaDefinitions=res.result.records;
        console.log('defs');
        console.log(res.result.records);
        }
        if(res.code===510){
          this.$message.warning(res.message)
        }
      })
    },
    loadMachines(){
         getAction(this.url.getMachines).then((res) => {
        if (res.success) {
        this.machines=res.result;
        console.log('the machines is ');
        console.log(this.machines);
        }
        if(res.code===510){
          this.$message.warning(res.message)
        }
      })
    },
    loadAreaDeatils(){
         getAction(this.url.getAreaDeatil).then((res) => {
        if (res.success) {
        this.areaDeatils=res.result.records;
        console.log(2222233333333333);
        console.log(res.result.records);
        }
        if(res.code===510){
          this.$message.warning(res.message)
        }
      })
    },
    loadParten(){
         getAction(this.url.getParten).then((res) => {
        if (res.success) {
        this.pattrens=res.result.records;
        console.log('get pattern success');
        console.log(this.pattrens);
        }
        if(res.code===510){
          this.$message.warning(res.message)
        }
      })
    },
 
      add () {
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'shopId','monitorAreaId','monitorAreaDetailsId','monitorPatternId','terminalId','delFlg'))
        })
        // this.L3_selected=this.model.
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
            let formData = Object.assign(this.model, values);
            console.log("表单提交数据",formData)
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
      handleCancel () {
        this.close()
      },
      popupCallback(row){
        this.form.setFieldsValue(pick(row,'shopId','monitorAreaId','monitorAreaDetailsId','monitorPatternId','terminalId','delFlg'))
      },

      
    }
  }
</script>