<template>
  <a-drawer
    :title="title"
    :maskClosable="true"
    :width="drawerWidth"
    placement="right"
    :closable="true"
    @close="handleCancel"
    :visible="visible"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;"
  >
    <template slot="title">
      <div style="width: 100%;">
        <span>{{ title }}</span>
        <span
          style="display:inline-block;width:calc(100% - 51px);padding-right:10px;text-align: right"
        >
          <a-button @click="toggleScreen" icon="appstore" style="height:20px;width:20px;border:0px"></a-button>
        </span>
      </div>
    </template>

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item :label="$t('user_real_name')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            :placeholder="$t('user_input_name')"
            v-decorator="[ 'realname', validatorRules.realname]"
          />
        </a-form-item>
        <a-form-item :label="$t('user_account')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            :placeholder="$t('user_input_account')"
            v-decorator="[ 'username', validatorRules.username]"
            :readOnly="!!model.id"
          />
        </a-form-item>

        <template v-if="!model.id">
          <a-form-item :label="$t('user_login_pwd')" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              type="password"
              :placeholder="$t('user_input_pwd')"
              v-decorator="[ 'password', validatorRules.password]"
            />
          </a-form-item>

          <a-form-item
            :label="$t('user_comfire_pwd')"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-input
              type="password"
              @blur="handleConfirmBlur"
              :placeholder="$t('user_input_comfirepwd')"
              v-decorator="[ 'confirmpassword', validatorRules.confirmpassword]"
            />
          </a-form-item>
        </template>

        <!-- <a-form-item :label="$t('user_job_num')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input :placeholder="$t('user_input_jobnum')" v-decorator="[ 'workNo', validatorRules.workNo]" />
        </a-form-item>

        <a-form-item :label="$t('user_job_des')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-select-position :placeholder="$t('user_select_job')" :multiple="false" v-decorator="['post', {}]"/>
        </a-form-item>-->
         <!-- 权限 -->
        <a-form-item
          :label="$t('user_role_selct')"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-show="!roleDisabled"
        >
          <a-select
            style="width: 100%"
            :placeholder="$t('user_the_userrole')"
            optionFilterProp="children"
            v-model="selectedRole"
            @select="select"
          >
            <a-select-option
              v-for="(role,roleindex) in roleList"
              :key="roleindex.toString()"
              :value="role.id"
            >{{ role.roleName }}</a-select-option>
          </a-select>
        </a-form-item>
        <!-- 所属店舗 -->
        <a-form-item
        v-if="showRole!= '3333'"
          :label="$t('user_store_company')"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-show="!roleDisabled"
        >
          <a-tree-select
            style="width: 100%"
            :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
            :treeData="bankList"
            placeholder="企業または店舗をご選択ください"
            v-model="selectedBank"
            allowClear
          ></a-tree-select>
        </a-form-item>
        <!-- 対応可能業務 -->
        <a-form-item
          v-if="showRole!= '3333' && showRole !='minister'"
          :label="$t('user_business')"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-show="!roleDisabled"
        >
          <a-select
            mode="multiple"
            style="width: 100%"
            :placeholder="$t('user_the_userrole')"
            optionFilterProp="children"
            v-model="selectedBusiness"
          >
            <a-select-option
              v-for="(role,roleindex) in businessData"
              :key="roleindex.toString()"
              :value="role.id"
            >{{ role.bname }}</a-select-option>
          </a-select>
        </a-form-item>
        <!-- 対応可能窓口 -->
        <a-form-item
         v-if="showRole!= '3333' && showRole !='minister'"
          :label="$t('user_windows')"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-show="!roleDisabled"
        >
          <a-select
            mode="multiple"
            style="width: 100%"
            :placeholder="$t('user_the_userrole')"
            optionFilterProp="children"
            v-model="selectedWindow"
          >
            <a-select-option
              v-for="(role,roleindex) in windowsList"
              :key="roleindex.toString()"
              :value="role.id"
            >{{ role.name }}</a-select-option>
          </a-select>
        </a-form-item>

        <!--部门分配-->
        <!-- <a-form-item
          :label="$t('user_division_allocation')"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-show="!departDisabled"
        >
          <a-input-search
            :placeholder="$t('user_division_allocation')"
            v-model="checkedDepartNameString"
            disabled
            @search="onSearch"
          >
            <a-button slot="enterButton" icon="search">{{$t('user_division_allocation')}}</a-button>
          </a-input-search>
        </a-form-item>-->
        <!-- <a-form-item :label="$t('user_icon')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-upload
            listType="picture-card"
            class="avatar-uploader"
            :showUploadList="false"
            :action="uploadAction"
            :data="{'isup':1}"
            :headers="headers"
            :beforeUpload="beforeUpload"
            @change="handleChange"
          >
            <img v-if="picUrl" :src="getAvatarView()" :alt="$t('user_icon')" style="height:104px;max-width:300px"/>
            <div v-else>
              <a-icon :type="uploadLoading ? 'loading' : 'plus'" />
              <div class="ant-upload-text">{{$t('user_upload')}}</div>
            </div>
          </a-upload>
        </a-form-item>

        <a-form-item :label="$t('user_birthday')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-date-picker
            style="width: 100%"
            :placeholder="$t('user_input_birthday')"
            v-decorator="['birthday', {initialValue:!model.birthday?null:moment(model.birthday,dateFormat)}]"/>
        </a-form-item>

        <a-form-item :label="$t('sex')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select v-decorator="[ 'sex', {}]" :placeholder="$t('user_select_sex')">
            <a-select-option :value="1">{{$t('male')}}</a-select-option>
            <a-select-option :value="2">{{$t('female')}}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item :label="$t('email')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input :placeholder="$t('user_input_email')" v-decorator="[ 'email', validatorRules.email]" />
        </a-form-item>

        <a-form-item :label="$t('phone_number')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input :placeholder="$t('携帯電話の番号を入力してください')" :disabled="isDisabledAuth('user:form:phone')" v-decorator="[ 'phone', validatorRules.phone]" />
        </a-form-item>

        <a-form-item :label="$t('user_tel')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input :placeholder="$t('user_input_tel')" v-decorator="[ 'telephone', validatorRules.telephone]"/>
        </a-form-item>

        <a-form-item :label="$t('user_info_flow')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-dict-select-tag  v-decorator="['activitiSync', {}]" :placeholder="$t('user_sys_flow')" :type="'radio'" :triggerChange="true" dictCode="activiti_sync"/>
        </a-form-item>-->
      </a-form>
    </a-spin>
    <depart-window ref="departWindow" @ok="modalFormOk"></depart-window>

    <div class="drawer-bootom-button" v-show="!disableSubmit">
      <a-popconfirm
        :title="$t('cancel_save')"
        @confirm="handleCancel"
        :okText="$t('sure')"
        :cancelText="$t('cancle')"
      >
        <a-button style="margin-right: .8rem">{{$t('cancle')}}</a-button>
      </a-popconfirm>
      <a-button @click="handleSubmit" type="primary" :loading="confirmLoading">{{$t('save')}}</a-button>
    </div>
  </a-drawer>
</template>

<script>
import pick from 'lodash.pick'
import moment from 'moment'
import Vue from 'vue'
import departWindow from './DepartWindow'
import JSelectPosition from '@/components/jeecgbiz/JSelectPosition'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { getAction } from '@/api/manage'
import { USER_INFO } from "@/store/mutation-types";
import {
  addUser,
  editUser,
  queryUserRole,
  queryUserBusiness,
  queryUserWindows,
  queryUserBank,
  queryall
} from '@/api/api'
import { disabledAuthFilter } from '@/utils/authFilter'
import { duplicateCheck } from '@/api/api'
export default {
  name: 'UserModal',
  components: {
    departWindow,
    JSelectPosition
  },
  data() {
    return {
      show:true,
      showRole:'',
      departDisabled: false, //是否是我的部门调用该页面
      roleDisabled: false, //是否是角色维护调用该页面
      modalWidth: 800,
      drawerWidth: 700,
      modaltoggleFlag: true,
      confirmDirty: false,
      selectedDepartKeys: [], //保存用户选择部门id
      checkedDepartKeys: [],
      checkedDepartNames: [], // 保存部门的名称 =>title
      checkedDepartNameString: '', // 保存部门的名称 =>title
      userId: '', //保存用户id
      disableSubmit: false,
      userDepartModel: { userId: '', departIdList: [] }, // 保存SysUserDepart的用户部门中间表数据需要的对象
      dateFormat: 'YYYY-MM-DD',
      businessData: [],
      selectedBusiness: [],
      validatorRules: {
        username: {
          rules: [
            {
              required: true,
              message: this.$t('user_input_account')
            },
            {
              validator: this.validateUsername
            }
          ]
        },
        password: {
          rules: [
            {
              required: true,
              pattern: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+`\-={}:";'<>?,./]).{8,}$/,
              message: this.$t('user_pwd_role')
            },
            {
              validator: this.validateToNextPassword
            }
          ]
        },
        confirmpassword: {
          rules: [
            {
              required: true,
              message: this.$t('user_reenter_pwd')
            },
            {
              validator: this.compareToFirstPassword
            }
          ]
        },
        realname: { rules: [{ required: true, message: this.$t('user_input_name') }] },
        phone: { rules: [{ validator: this.validatePhone }] },
        email: {
          rules: [
            {
              validator: this.validateEmail
            }
          ]
        },
        roles: {},
        //  sex:{initialValue:((!this.model.sex)?"": (this.model.sex+""))}
        workNo: {
          rules: [{ required: true, message: this.$t('user_input_jobnum') }, { validator: this.validateWorkNo }]
        },
        telephone: {
          rules: [{ pattern: /^0\d{2,3}-[1-9]\d{6,7}$/, message: this.$t('user_enter_correct') }]
        }
      },
      title: this.$t('num_perations'),
      visible: false,
      model: {},
      roleList: [],
      selectedRole: [],
      windowsList: [],
      selectedWindow: [],
      bankList: [],
      selectedBank: null,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      uploadLoading: false,
      confirmLoading: false,
      headers: {},
      form: this.$form.createForm(this),
      picUrl: '',
      url: {
        fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
        userWithDepart: '/sys/user/userDepartList', // 引入为指定用户查看部门信息需要的url
        userId: '/sys/user/generateUserId', // 引入生成添加用户情况下的url
        syncUserByUserName: '/process/extActProcess/doSyncUserByUserName', //同步用户到工作流
        listBusiness: '/business/businessTable/list',
        listWindows: '/test/masterShopWindow/list',
        listBank: '/sys/user/listStoreByUser',
        getRoleById:'sys/role/queryById',
        getUserRole:'sys/user/getUserRole'
      }
    }
  },
  created() {
    const token = Vue.ls.get(ACCESS_TOKEN)
    this.headers = { 'X-Access-Token': token }
    this.loadBusiness()
    this.loadWindows()
    this.loadBanks()
    //  var user = userVue.ls.get(USER_INFO)
    //  if(user.realname=="管理者"){
    //     this.show = false;
    //  }
    // console.log(Vue.ls.get(USER_INFO))
  },
  computed: {
    uploadAction: function() {
      return this.url.fileUpload
    }
  },
  methods: {
    select(key,value){
        getAction(this.url.getRoleById, {id:key}).then(res => {
        this.showRole = res.result.roleCode;
      })
    },
    getUserRole(userId){
        getAction(this.url.getUserRole, {id:userId}).then(res => {
        this.showRole = res.roleCode;
        console.log(res)
      })
    },
    loadBusiness() {
      getAction(this.url.listBusiness, {}).then(res => {
        console.log(res)
        this.businessData = res.result.records
      })
    },
    loadWindows() {
      getAction(this.url.listWindows, {}).then(res => {
        console.log(res)
        this.windowsList = res.result.records
      })
    },
    loadBanks() {
      getAction(this.url.listBank, {}).then(res => {
        console.log(res)
        this.bankList = res.result
      })
    },
    isDisabledAuth(code) {
      return disabledAuthFilter(code)
    },
    //窗口最大化切换
    toggleScreen() {
      if (this.modaltoggleFlag) {
        this.modalWidth = window.innerWidth
      } else {
        this.modalWidth = 800
      }
      this.modaltoggleFlag = !this.modaltoggleFlag
    },
    initialRoleList() {
      queryall().then(res => {
        if (res.success) {
          this.roleList = res.result
        } else {
          console.log(res.message)
        }
      })
    },
    loadUserRoles(userid) {
      queryUserRole({ userid: userid }).then(res => {
        if (res.success) {
          this.selectedRole = res.result
          console.log(res)
        } else {
          console.log(res.message)
        }
      })
    },
    loadUserBusiness(userid) {
      queryUserBusiness({ userid: userid }).then(res => {
        if (res.success) {
          this.selectedBusiness = res.result
        } else {
          console.log(res.message)
        }
      })
    },
    loadUserWindows(userid) {
      queryUserWindows({ userid: userid }).then(res => {
        if (res.success) {
          this.selectedWindow = res.result
        } else {
          console.log(res.message)
        }
      })
    },
    loadUserBank(userid) {
      queryUserBank({ userid: userid }).then(res => {
        console.log(res)
        if (res.success && res.result!=null) {
          
          this.selectedBank = res.result[0]
        } else {
          console.log(res.message)
        }
      })
    },
    refresh() {
      this.selectedDepartKeys = []
      this.checkedDepartKeys = []
      this.checkedDepartNames = []
      this.checkedDepartNameString = ''
      this.userId = ''
    },
    add() {
      this.picUrl = ''
      this.refresh()
      this.edit({ activitiSync: '1' })
    },
    edit(record) {
      this.resetScreenSize()
      let that = this
      that.initialRoleList()
      that.checkedDepartNameString = ''
      that.form.resetFields()
      if (record.hasOwnProperty('id')) {
        that.loadUserRoles(record.id)
        this.getUserRole(record.id)
        that.loadUserBusiness(record.id)
        that.loadUserWindows(record.id)
        that.loadUserBank(record.id)
        this.picUrl = 'Has no pic url yet'
      }
      that.userId = record.id
      that.visible = true
      that.model = Object.assign({}, record)
      console.log(that.model)
      that.$nextTick(() => {
        that.form.setFieldsValue(
          pick(
            this.model,
            'username',
            'sex',
            'realname',
            'email',
            'phone',
            'activitiSync',
            'workNo',
            'telephone',
            'post'
          )
        )
      })
      that.checkedDepartKeys = []
      that.loadCheckedDeparts()
    },
    //
    loadCheckedDeparts() {
      let that = this
      if (!that.userId) {
        return
      }
      getAction(that.url.userWithDepart, { userId: that.userId }).then(res => {
        that.checkedDepartNames = []
        if (res.success) {
          for (let i = 0; i < res.result.length; i++) {
            that.checkedDepartNames.push(res.result[i].title)
            this.checkedDepartNameString = this.checkedDepartNames.join(',')
            that.checkedDepartKeys.push(res.result[i].key)
          }
          that.userDepartModel.departIdList = that.checkedDepartKeys
        } else {
          console.log(res.message)
        }
      })
    },
    close() {
      this.$emit('close')
      this.visible = false
      this.disableSubmit = false
      this.selectedRole = []
      this.selectedBusiness = []
      this.selectedWindow = []
      this.selectedBank = null
      this.userDepartModel = { userId: '', departIdList: [] }
      this.checkedDepartNames = []
      this.checkedDepartNameString = ''
      this.checkedDepartKeys = []
      this.selectedDepartKeys = []
      this.showRole=''
    },
    moment,
    handleSubmit() {
      const that = this
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true
          let avatar = that.model.avatar
          if (!values.birthday) {
            values.birthday = ''
          } else {
            values.birthday = values.birthday.format(this.dateFormat)
          }
          let formData = Object.assign(this.model, values)
          formData.avatar = avatar
          // formData.selectedroles = this.selectedRole.length > 0 ? this.selectedRole.join(',') : ''
          var array = [this.selectedRole]
          formData.selectedroles = array.length > 0 ? array.join(',') : ''
          formData.selecteddeparts =
            this.userDepartModel.departIdList.length > 0 ? this.userDepartModel.departIdList.join(',') : ''
          formData.userBusiness = this.selectedBusiness
          formData.userWindows = this.selectedWindow
          console.log(this.selectedBank)
          if(this.selectedBank==null|| this.selectedBank ==''){
            formData.userStore = null
          }else{
              var array1 = [this.selectedBank]
               formData.userStore = array1
          }
          console.log( formData.userStore)
          let obj
          if (!this.model.id) {
            formData.id = this.userId
            obj = addUser(formData)
          } else {
            obj = editUser(formData)
          }
          obj
            .then(res => {
              if (res.success) {
                that.$message.success(res.message)
                that.$emit('ok')
              } else {
                that.$message.warning(res.message)
              }
            })
            .finally(() => {
              that.confirmLoading = false
              that.checkedDepartNames = []
              that.userDepartModel.departIdList = { userId: '', departIdList: [] }

              that.close()
            })
        }
      })
    },
    handleCancel() {
      this.close()
    },
    validateToNextPassword(rule, value, callback) {
      const form = this.form
      const confirmpassword = form.getFieldValue('confirmpassword')

      if (value && confirmpassword && value !== confirmpassword) {
        callback($t('user_two_pwd'))
      }
      if (value && this.confirmDirty) {
        form.validateFields(['confirm'], { force: true })
      }
      callback()
    },
    compareToFirstPassword(rule, value, callback) {
      const form = this.form
      if (value && value !== form.getFieldValue('password')) {
        callback($t('user_two_pwd'))
      } else {
        callback()
      }
    },
    validatePhone(rule, value, callback) {
      if (!value) {
        callback()
      } else {
        if (new RegExp(/^1[3|4|5|7|8|9][0-9]\d{8}$/).test(value)) {

          var params = {
            tableName: 'sys_user',
            fieldName: 'phone',
            fieldVal: value,
            dataId: this.userId
          }
          duplicateCheck(params).then(res => {
            if (res.success) {
              callback()
            } else {
              callback(this.$t('user_phone_exists'))
            }
          })
        } else {
          callback(this.$t('user_enter_correct_phone'))
        }
      }
    },
    validateEmail(rule, value, callback) {
      if (!value) {
        callback()
      } else {
        if (
          new RegExp(
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          ).test(value)
        ) {
          var params = {
            tableName: 'sys_user',
            fieldName: 'email',
            fieldVal: value,
            dataId: this.userId
          }
          duplicateCheck(params).then(res => {
            console.log(res)
            if (res.success) {
              callback()
            } else {
              callback(this.$t('user_email_exists'))
            }
          })
        } else {
          callback(this.$t('user_enter_correct_email'))
        }
      }
    },
    validateUsername(rule, value, callback) {
      var params = {
        tableName: 'sys_user',
        fieldName: 'username',
        fieldVal: value,
        dataId: this.userId
      }
      duplicateCheck(params).then(res => {
        if (res.success) {
          callback()
        } else {
          callback(this.$t('user_name_exists'))
        }
      })
    },
    validateWorkNo(rule, value, callback) {
      var params = {
        tableName: 'sys_user',
        fieldName: 'work_no',
        fieldVal: value,
        dataId: this.userId
      }
      duplicateCheck(params).then(res => {
        if (res.success) {
          callback()
        } else {
          callback(this.$t('user_jobnum_exists'))
        }
      })
    },
    handleConfirmBlur(e) {
      const value = e.target.value
      this.confirmDirty = this.confirmDirty || !!value
    },

    normFile(e) {
      console.log('Upload event:', e)
      if (Array.isArray(e)) {
        return e
      }
      return e && e.fileList
    },
    beforeUpload: function(file) {
      var fileType = file.type
      if (fileType.indexOf('image') < 0) {
        this.$message.warning(this.$t('user_upload_img'))
        return false
      }
    },
    handleChange(info) {
      this.picUrl = ''
      if (info.file.status === 'uploading') {
        this.uploadLoading = true
        return
      }
      if (info.file.status === 'done') {
        var response = info.file.response
        this.uploadLoading = false
        console.log(response)
        if (response.success) {
          this.model.avatar = response.message
          this.picUrl = 'Has no pic url yet'
        } else {
          this.$message.warning(response.message)
        }
      }
    },
    getAvatarView() {
      return this.url.imgerver + '/' + this.model.avatar
    },
    onSearch() {
      this.$refs.departWindow.add(this.checkedDepartKeys, this.userId)
    },

    modalFormOk(formData) {
      this.checkedDepartNames = []
      this.selectedDepartKeys = []
      this.checkedDepartNameString = ''
      this.userId = formData.userId
      this.userDepartModel.userId = formData.userId
      for (let i = 0; i < formData.departIdList.length; i++) {
        this.selectedDepartKeys.push(formData.departIdList[i].key)
        this.checkedDepartNames.push(formData.departIdList[i].title)
        this.checkedDepartNameString = this.checkedDepartNames.join(',')
      }
      this.userDepartModel.departIdList = this.selectedDepartKeys
    },
    resetScreenSize() {
      let screenWidth = document.body.clientWidth
      if (screenWidth < 500) {
        this.drawerWidth = screenWidth
      } else {
        this.drawerWidth = 700
      }
    }
  }
}
</script>

<style scoped>
.avatar-uploader > .ant-upload {
  width: 104px;
  height: 104px;
}
.ant-upload-select-picture-card i {
  font-size: 49px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}

.ant-table-tbody .ant-table-row td {
  padding-top: 10px;
  padding-bottom: 10px;
}

.drawer-bootom-button {
  position: absolute;
  bottom: -8px;
  width: 100%;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  left: 0;
  background: #fff;
  border-radius: 0 0 2px 2px;
}
</style>