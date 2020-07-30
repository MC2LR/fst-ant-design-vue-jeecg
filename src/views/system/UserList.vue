<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper" v-has="'user:add'">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="12">
            <a-form-item :label="$t('user_account')">
              <!--<a-input placeholder="请输入账号查询" v-model="queryParam.username"></a-input>-->
              <j-input placeholder=" " v-model="queryParam.username"></j-input>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <!-- <a-form-item :label="$t('user_real_name')">
              <a-select v-model="queryParam.sex" :placeholder="$t('user_query_bysex')">
                <a-select-option value>{{$t('user_query_bysex')}}</a-select-option>
                <a-select-option value="1">{{$t('male')}}</a-select-option>
                <a-select-option value="2">{{$t('female')}}</a-select-option>
              </a-select>
            </a-form-item> -->
            <a-form-item :label="$t('user_real_name')">
              <!--<a-input placeholder="请输入账号查询" v-model="queryParam.username"></a-input>-->
              <j-input placeholder=" " v-model="queryParam.realname"></j-input>
            </a-form-item>
          </a-col>

          <!-- <template v-if="toggleSearchStatus"> -->
            <!-- <a-col :md="6" :sm="8">
              <a-form-item :label="$t('email')">
                <a-input :placeholder="$t('query_by_email')" v-model="queryParam.email"></a-input>
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="8">
              <a-form-item :label="$t('phone_number')">
                <a-input :placeholder="$t('phone_num_inputtitle')" v-model="queryParam.phone"></a-input>
              </a-form-item>
            </a-col> -->

            <a-col :md="6" :sm="8" v-has="'user:admin'">
              <a-form-item :label="$t('user_store_company')">
                <!-- <a-select v-model="queryParam.status" :placeholder="$t('user_query_bystatus')">
                  <a-select-option value>{{$t('user_select_userstatus')}}</a-select-option>
                  <a-select-option value="1">{{$t('normal')}}</a-select-option>
                  <a-select-option value="2">{{$t('thaw')}}</a-select-option>
                </a-select> -->
                <a-tree-select
            style="width: 100%"
            :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
            :treeData="bankList"
            placeholder="Please select"
            v-model="selectedBank"
            allowClear
          ></a-tree-select>
              </a-form-item>
            </a-col>
          <!-- </template> -->

          <a-col :md="6" :sm="8" >
            <!-- <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons"> -->
              <a-button type="primary" @click="searchQuery(selectedBank)" icon="search">{{$t('query')}}</a-button>
              <a-button
                type="primary"
                @click="searchReset"
                icon="reload"
                style="margin-left: 8px"
              >{{$t('reset')}}</a-button>
              <!-- <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? $t('takein') : $t('deploy') }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
              </a> -->
            <!-- </span> -->
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator" style="border-top: 5px">
      <a-button @click="handleAdd" type="primary" icon="plus" v-has="'user:add'">{{$t('add_user')}}</a-button>
      <a-button
        type="primary"
        icon="download"
        @click="handleExportXls($t('user_info'))"
        v-has="'user:deleteBatch'"
      >{{$t('export')}}</a-button>
      <a-upload
        name="file"
        :showUploadList="false"
        :multiple="false"
        :headers="tokenHeader"
        :action="importExcelUrl"
        @change="handleImportExcel"
        v-has="'user:deleteBatch'"
      >
        <a-button type="primary" icon="import" v-has="'user:deleteBatch'">{{$t('import')}}</a-button>
      </a-upload>
      <a-button
      v-has="'user:deleteBatch'"
        @click="batchDel"
        v-if="selectedRowKeys.length > 0"
        ghost
        type="primary"
        icon="delete"
        
        >{{$t('deleteBatch')}}
      </a-button>
      <!-- <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay" @click="handleMenuClick">
          <a-menu-item key="1">
            <a-icon type="delete" @click="batchDel" />
            {{$t('delete')}}
          </a-menu-item>
          <a-menu-item key="2">
            <a-icon type="lock" @click="batchFrozen('2')" />
            {{$t('freez')}}
          </a-menu-item>
          <a-menu-item key="3">
            <a-icon type="unlock" @click="batchFrozen('1')" />
            {{$t('thaw')}}
          </a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">
          {{$t('batchop')}}
          <a-icon type="down" />
        </a-button>
      </a-dropdown> -->
    </div>

    <!-- table区域-begin -->
    <div >
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;" v-has="'user:deleteBatch'">
        <i class="anticon anticon-info-circle ant-alert-icon"></i>
        {{$t('selected')}}&nbsp;
        <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>
        {{$t('item')}}&nbsp;&nbsp;
        <a
          style="margin-left: 24px"
          @click="onClearSelected"
        >{{$t('clear')}}</a>
      </div>

      <a-table
        ref="table"
        bordered
        size="middle"
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange"
      >
        <template slot="avatarslot" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <a-avatar shape="square" :src="getAvatarView(record.avatar)" icon="user" />
          </div>
        </template>

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)" v-has="'user:edit'">{{$t('edit')}}</a>

          <a-divider type="vertical" v-has="'user:edit'"/>
          <a href="javascript:;" @click="handleDetail(record)" v-has="'user:all'">{{$t('detail')}}</a>
          <a-dropdown v-has="'user:edit'">
            <a class="ant-dropdown-link">
              {{$t('more')}}
              <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a href="javascript:;" @click="handleDetail(record)">{{$t('detail')}}</a>
              </a-menu-item>

              <a-menu-item v-has="'user:changePWD'">
                <a
                  href="javascript:;"
                  @click="handleChangePassword(record.username)"
                >{{$t('password')}}</a>
              </a-menu-item>

              <a-menu-item v-has="'user:delete'">
                <a-popconfirm
                  :title="$t('num_comfire_delete')"
                  @confirm="() => handleDelete(record.id)"
                >
                  <a>{{$t('delete')}}</a>
                </a-popconfirm>
              </a-menu-item>

              <!-- <a-menu-item v-if="record.status==1">
                <a-popconfirm
                  :title="$t('user_comfire_freez')"
                  @confirm="() => handleFrozen(record.id,2,record.username)"
                >
                  <a>{{$t('freez')}}</a>
                </a-popconfirm>
              </a-menu-item>

              <a-menu-item v-if="record.status==2">
                <a-popconfirm
                  :title="$t('user_comfire_unfreez')"
                  @confirm="() => handleFrozen(record.id,1,record.username)"
                >
                  <a>{{$t('thaw')}}</a>
                </a-popconfirm>
              </a-menu-item> -->

              <!-- <a-menu-item>
                <a
                  href="javascript:;"
                  @click="handleAgentSettings(record.username)"
                >{{$t('user_gen')}}</a>
              </a-menu-item> -->
            </a-menu>
          </a-dropdown>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <user-modal ref="modalForm" @ok="modalFormOk"></user-modal>

    <password-modal ref="passwordmodal" @ok="passwordModalOk"></password-modal>

    <sys-user-agent-modal ref="sysUserAgentModal"></sys-user-agent-modal>
  </a-card>
</template>

<script>
import UserModal from './modules/UserModal'
import PasswordModal from './modules/PasswordModal'
import { putAction } from '@/api/manage'
import { getAction } from '@/api/manage'
import { frozenBatch } from '@/api/api'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import SysUserAgentModal from './modules/SysUserAgentModal'
import JInput from '@/components/jeecg/JInput'


export default {
  name: 'UserList',
  mixins: [JeecgListMixin],
  components: {
    SysUserAgentModal,
    UserModal,
    PasswordModal,
    JInput
  },
  data() {
    return {

      description: this.$t('user_manager_page'),
      queryParam: {},
       bankList: [],
      selectedBank: [],
      columns: [
        /*{
            title: '#',
            dataIndex: '',
            key:'rowIndex',
            width:60,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
          },*/
        {
          title: this.$t('user_real_name'),
          align: 'center',
          width: 100,
          dataIndex: 'realname'
        },
        {
          title: this.$t('user_account'),
          align: 'center',
          dataIndex: 'username',
          width: 120
        },
        {
          title: this.$t('user_business'),
          align: 'center',
          dataIndex: 'userBusiness',
          width: 120
        },
        {
          title: this.$t('user_windows'),
          align: 'center',
          dataIndex: 'userWindows',
          width: 120
        },
          {
          title: this.$t('user_company'),
          align: 'center',
          dataIndex: 'userCompany',
          width: 120
        },
        {
          title: this.$t('user_store'),
          align: 'center',
          dataIndex: 'userStore',
          width: 120
        },
        // {
        //   title: this.$t('user_icon'),
        //   align: 'center',
        //   width: 120,
        //   dataIndex: 'avatar',
        //   scopedSlots: { customRender: 'avatarslot' }
        // },

        // {
        //   title: this.$t('sex'),
        //   align: 'center',
        //   width: 80,
        //   dataIndex: 'sex_dictText',
        //   sorter: true
        // },
        // {
        //   title: this.$t('user_birthday'),
        //   align: 'center',
        //   width: 180,
        //   dataIndex: 'birthday'
        // },
        // {
        //   title: this.$t('phone_number'),
        //   align: 'center',
        //   width: 100,
        //   dataIndex: 'phone'
        // },
        // {
        //   title: this.$t('email'),
        //   align: 'center',
        //   dataIndex: 'email'
        // },
        // {
        //   title: this.$t('status'),
        //   align: 'center',
        //   width: 80,
        //   dataIndex: 'status_dictText'
        // },
        /* {
            title: '创建时间',
            align: "center",
            width: 150,
            dataIndex: 'createTime',
            sorter: true
          },*/
        {
          title: this.$t('num_perations'),
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          align: 'center',
          width: 170
        }
      ],
      url: {
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
        syncUser: '/process/extActProcess/doSyncUser',
        list: '/sys/user/list',
        delete: '/sys/user/delete',
        deleteBatch: '/sys/user/deleteBatch',
        exportXlsUrl: '/sys/user/exportXls',
        importExcelUrl: 'sys/user/importExcel',
        listBank: '/sys/user/listStoreByUser',
        listByCompany: '/sys/user/listByCompany',
      }
    }
  },
  created() {
    this.loadBanks()
    
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
     loadBanks() {
       console.log('这只是一个测试')
      getAction(this.url.listBank, {}).then(res => {
        console.log(res)
        this.bankList = res.result
      })
       console.log('这只是一个测试')
    },
    getAvatarView: function(avatar) {
      return this.url.imgerver + '/' + avatar
    },

    batchFrozen: function(status) {
      if (this.selectedRowKeys.length <= 0) {
        this.$message.warning(this.$t('user_select_one'))
        return false
      } else {
        let ids = ''
        let that = this
        let isAdmin = false
        that.selectionRows.forEach(function(row) {
          if (row.username == 'admin') {
            isAdmin = true
          }
        })
        if (isAdmin) {
          that.$message.warning(this.$t('user_admin_forrbed'))
          return
        }
        that.selectedRowKeys.forEach(function(val) {
          ids += val + ','
        })
        that.$confirm({
          title: this.$t('user_ok_op'),
          content:
            this.$t('user_is_no') + (status == 1 ? this.$t('thaw') : this.$t('freez')) + this.$t('user_check_account'),
          onOk: function() {
            frozenBatch({ ids: ids, status: status }).then(res => {
              if (res.success) {
                that.$message.success(res.message)
                that.loadData()
                that.onClearSelected()
              } else {
                that.$message.warning(res.message)
              }
            })
          }
        })
      }
    },
    handleMenuClick(e) {
      if (e.key == 1) {
        this.batchDel()
      } else if (e.key == 2) {
        this.batchFrozen(2)
      } else if (e.key == 3) {
        this.batchFrozen(1)
      }
    },
    handleFrozen: function(id, status, username) {
      let that = this
      //TODO 后台校验管理员角色
      if ('admin' == username) {
        that.$message.warning(this.$t('user_admin_no_pr'))
        return
      }
      frozenBatch({ ids: id, status: status }).then(res => {
        if (res.success) {
          that.$message.success(res.message)
          that.loadData()
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    handleChangePassword(username) {
      this.$refs.passwordmodal.show(username)
    },
    handleAgentSettings(username) {
      this.$refs.sysUserAgentModal.agentSettings(username)
      this.$refs.sysUserAgentModal.title = this.$t('user_agent_settings')
    },
    passwordModalOk() {
      //TODO 密码修改完成 不需要刷新页面，可以把datasource中的数据更新一下
    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>