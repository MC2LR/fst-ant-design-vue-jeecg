<template>
  <a-drawer
    :title="title"
    :width="drawerWidth"
    @close="handleCancel"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}"
  >
    <div :style="{width: '100%',border: '1px solid #e9e9e9',padding: '10px 16px',background: '#fff',}">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item :label="$t('system_Menutype')" :labelCol="labelCol" :wrapperCol="wrapperCol" >
          <a-radio-group @change="onChangeMenuType" v-decorator="['menuType',{'initialValue':localMenuType}]">
            <a-radio :value="0">{{$t('system_MenuLevelmenu')}}</a-radio>
            <a-radio :value="1">{{$t('system_MenuSubmenu')}}</a-radio>
            <a-radio :value="2">{{$t('system_MenubtnOrperm')}}</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="menuLabel"
          hasFeedback >
          <a-input :placeholder="$t('system_Menuenter')" v-decorator="[ 'name', validatorRules.name]" :readOnly="disableSubmit"/>
        </a-form-item>


        <a-form-item
          v-show="localMenuType!=0"
          :label="$t('system_MenuSuperior')"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :validate-status="validateStatus"
          :hasFeedback="true"
          :required="true">
          <span slot="help">{{ validateStatus=='error'? $t('system_MenuSuperchoose') : '&nbsp;&nbsp;' }}</span>
          <a-tree-select
            style="width:100%"
            :dropdownStyle="{ maxHeight: '200px', overflow: 'auto' }"
            :treeData="treeData"
            v-model="model.parentId"
            :placeholder="$t('system_Menuparentchoose')"
            :disabled="disableSubmit"
            @change="handleParentIdChange">
          </a-tree-select>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="$t('system_MenuUrl')">
          <a-input :placeholder="$t('system_MenuUrlchoose')" v-decorator="[ 'url',validatorRules.url]" :readOnly="disableSubmit"/>
        </a-form-item>

        <a-form-item
          v-show="show"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="$t('system_MenubefComponent')">
          <a-input :placeholder="$t('system_MenubefComponent')" v-decorator="[ 'component',validatorRules.component]" :readOnly="disableSubmit"/>
        </a-form-item>

        <a-form-item
          v-show="localMenuType==0"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="$t('system_Menujumpaddr')">
          <a-input :placeholder="$t('system_MenuRoutParm')" v-decorator="[ 'redirect',{}]" :readOnly="disableSubmit"/>
        </a-form-item>

        <a-form-item
          v-show="!show"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="$t('system_MenuAuthID')">
          <a-input :placeholder="$t('system_MenuSeparated')" v-decorator="[ 'perms', {}]" :readOnly="disableSubmit"/>
        </a-form-item>

        <a-form-item
          v-show="!show"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="$t('system_MenuAuthpolicy')">
          <j-dict-select-tag  v-decorator="['permsType', {}]" placeholder="$t('system_Menuselectpolicy')" :type="'radio'" :triggerChange="true" dictCode="global_perms_type"/>


        </a-form-item>
        <a-form-item
          v-show="!show"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="$t('system_Menustatus')">
          <j-dict-select-tag  v-decorator="['status', {}]" placeholder="$t('system_MenuselectStatus')" :type="'radio'" :triggerChange="true" dictCode="valid_status"/>

        </a-form-item>

        <a-form-item
          v-show="show"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="$t('system_Menuicon')">
          <a-input :placeholder="$t('system_MenuSelectIcon')" v-model="model.icon" :readOnly="disableSubmit">
            <a-icon slot="addonAfter" type="setting" @click="selectIcons" />
          </a-input>
        </a-form-item>

        <a-form-item
          v-show="show"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="$t('system_Menuorderby')">
          <a-input-number placeholder="$t('system_MenuInputsort')" style="width: 200px" v-decorator="[ 'sortNo',validatorRules.sortNo]" :readOnly="disableSubmit"/>
        </a-form-item>

        <a-form-item
          v-show="show"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="$t('system_MenuRouting')">
          <a-switch :checkedChildren="$t('system_MenuYes')" :unCheckedChildren="$t('system_MenuNo')" v-model="routeSwitch"/>
        </a-form-item>

        <a-form-item
          v-show="show"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="$t('system_MenuRoutHide')">
          <a-switch :checkedChildren="$t('system_MenuYes')" :unCheckedChildren="$t('system_MenuNo')" v-model="menuHidden"/>
        </a-form-item>

        <a-form-item
          v-show="show"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="$t('system_MenuRoutcache')">
          <a-switch :checkedChildren="$t('system_MenuYes')" :unCheckedChildren="$t('system_MenuNo')" v-model="isKeepalive"/>
        </a-form-item>


        <a-form-item
          v-show="show"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="$t('system_MenuRoutAggregate')">
          <a-switch :checkedChildren="$t('system_MenuYes')" :unCheckedChildren="$t('system_MenuNo')" v-model="alwaysShow"/>
        </a-form-item>

        <!--update_begin author:wuxianquan date:20190908 for:增加组件，外链打开方式可选 -->
        <a-form-item
          v-show="show"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="$t('system_MenuOpenway')">
          <a-switch :checkedChildren="$t('system_Menuexternal')" :unCheckedChildren="$t('system_Menuinternal')" v-model="internalOrExternal"/>
        </a-form-item>
        <!--update_end author:wuxianquan date:20190908 for:增加组件，外链打开方式可选 -->


      </a-form>

      <!-- 选择图标 -->
      <icons @choose="handleIconChoose" @close="handleIconCancel" :iconChooseVisible="iconChooseVisible"></icons>
    </a-spin>
      <a-row :style="{textAlign:'right'}">
        <a-button :style="{marginRight: '8px'}" @click="handleCancel">
          关闭
        </a-button>
        <a-button :disabled="disableSubmit" @click="handleOk" type="primary">确定</a-button>
      </a-row>
    </div>
  </a-drawer>
</template>

<script>
  import {addPermission,editPermission,queryTreeList} from '@/api/api'
  import Icons from './icon/Icons'
  import pick from 'lodash.pick'


  export default {
    name: "PermissionModal",
    components: {Icons},
    data () {
      return {
        drawerWidth:700,
        treeData:[],
        treeValue: '0-0-4',
        title:"操作",
        visible: false,
        disableSubmit:false,
        model: {},
        localMenuType:0,
        alwaysShow:false,//表单元素-聚合路由
        menuHidden:false,//表单元素-隐藏路由
        routeSwitch:true, //是否路由菜单
        /*update_begin author:wuxianquan date:20190908 for:定义变量，初始值代表内部打开*/
        internalOrExternal:false,//菜单打开方式
        /*update_end author:wuxianquan date:20190908 for:定义变量，初始值代表内部打开*/
        isKeepalive:true, //是否缓存路由
        show:true,//根据菜单类型，动态显示隐藏表单元素
        menuLabel:'菜单名称',
        isRequrie:true,  // 是否需要验证
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },

        confirmLoading: false,
        form: this.$form.createForm(this),

        iconChooseVisible: false,
        validateStatus:""
      }
    },
    computed:{
      validatorRules:function() {
        return {
          name:{rules: [{ required: true, message: '请输入菜单标题!' }]},
          component:{rules: [{ required: this.show, message: '请输入前端组件!' }]},
          url:{rules: [{ required: this.show, message: '请输入菜单路径!' }]},
          permsType:{rules: [{ required: true, message: '请输入授权策略!' }]},
          sortNo:{initialValue:1.0},
        }
      }
    },
    created () {
      this.initDictConfig();
    },
    methods: {
      loadTree(){
        var that = this;
        queryTreeList().then((res)=>{
          if(res.success){
            console.log('----queryTreeList---')
            console.log(res)
            that.treeData = [];
            let treeList = res.result.treeList
            for(let a=0;a<treeList.length;a++){
              let temp = treeList[a];
              temp.isLeaf = temp.leaf;
              that.treeData.push(temp);
            }
          }
        });
      },
      add () {
        // 默认值
        this.edit({status:'1',permsType:'1',route:true});
      },
      edit (record) {
        this.resetScreenSize(); // 调用此方法,根据屏幕宽度自适应调整抽屉的宽度
        this.form.resetFields();
        this.model = Object.assign({}, record);
        //--------------------------------------------------------------------------------------------------
        //根据菜单类型，动态展示页面字段
        console.log(record)
        this.alwaysShow = !record.alwaysShow?false:true;
        this.menuHidden = !record.hidden?false:true;

        if(record.route!=null){
          this.routeSwitch = record.route?true:false;
        }

        if(record.keepAlive!=null){
          this.isKeepalive = record.keepAlive?true:false;
        }else{
          this.isKeepalive = false; // 升级兼容 如果没有（后台没有传过来、或者是新建）默认为false
        }

        /*update_begin author:wuxianquan date:20190908 for:编辑初始化数据*/
        if(record.internalOrExternal!=null){
          this.internalOrExternal = record.internalOrExternal?true:false;
        }else{
          this.internalOrExternal = false;
        }
        /*update_end author:wuxianquan date:20190908 for:编辑初始化数据*/


        //console.log('record.menuType', record.menuType);
        this.show = record.menuType==2?false:true;
        this.menuLabel = record.menuType==2?'按钮/权限':'菜单名称';

        if(this.model.parentId){
          this.localMenuType = 1;
        }else{
          this.localMenuType = 0;
        }
        //----------------------------------------------------------------------------------------------

        this.visible = true;
        this.loadTree();
        let fieldsVal = pick(this.model,'name','perms','permsType','component','url','sortNo','menuType','status');
        this.$nextTick(() => {
          this.form.setFieldsValue(fieldsVal)
        });
      },
      close () {
        this.$emit('close');
        this.disableSubmit = false;
        this.visible = false;
      },
      handleOk () {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            this.model.alwaysShow = this.alwaysShow;
            this.model.hidden = this.menuHidden;
            this.model.route = this.routeSwitch;
            this.model.keepAlive = this.isKeepalive;
            /*update_begin author:wuxianquan date:20190908 for:获取值*/
            this.model.internalOrExternal = this.internalOrExternal;
            /*update_end author:wuxianquan date:20190908 for:获取值*/

            let formData = Object.assign(this.model, values);
            if ((formData.menuType == 1 || formData.menuType == 2) && !formData.parentId) {
              that.validateStatus = 'error';
              that.$message.error("请检查你填的类型以及信息是否正确！");
              return;
            } else {
              that.validateStatus = 'success';
            }
            that.confirmLoading = true;
            console.log(formData);
            let obj;
            if (!this.model.id) {
              obj = addPermission(formData);
            } else {
              obj = editPermission(formData);
            }
            obj.then((res) => {
              if (res.success) {
                that.$message.success(res.message);
                that.$emit('ok');
              } else {
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
              that.close();
            });
          }
        })
      },
      handleCancel () {
        this.close()
      },
      validateNumber(rule, value, callback){
        if(!value || new RegExp(/^[0-9]*[1-9][0-9]*$/).test(value)){
          callback();
        }else{
          callback("请输入正整数!");
        }
      },
      onChangeMenuType(e) {
        //console.log('localMenuType checked', e.target.value)
        this.localMenuType=e.target.value
        if(e.target.value == 2){
          this.show = false;
          this.menuLabel = '按钮/权限';
        }else{
          this.show = true;
          this.menuLabel = '菜单名称';
        }
        this.$nextTick(() => {
          this.form.validateFields(['url','component'], { force: true });
        });
      },
      selectIcons(){
        this.iconChooseVisible = true
      },
      handleIconCancel () {
        this.iconChooseVisible = false
      },
      handleIconChoose (value) {
        console.log(value)
        this.model.icon = value
        this.form.icon = value
        this.iconChooseVisible = false
      },
      // 根据屏幕变化,设置抽屉尺寸
      resetScreenSize(){
        let screenWidth = document.body.clientWidth;
        if(screenWidth < 500){
          this.drawerWidth = screenWidth;
        }else{
          this.drawerWidth = 700;
        }
      },
      initDictConfig() {
      },
      handleParentIdChange(value){
        if(!value){
          this.validateStatus="error"
        }else{
          this.validateStatus="success"
        }
      }
    }
  }
</script>

<style scoped>

</style>