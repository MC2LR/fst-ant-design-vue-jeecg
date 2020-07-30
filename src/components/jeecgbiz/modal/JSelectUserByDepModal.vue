<template>
  <a-modal
    :width="modalWidth"
    :visible="visible"
    :title="title"
    @ok="handleSubmit"
    @cancel="close"
    cancelText="閉じる"
    style="margin-top: -70px"
    wrapClassName="ant-modal-cust-warp"
  >
    <a-row :gutter="10" style="background-color: #ececec; padding: 10px; margin: -10px">
      <a-col :md="6" :sm="24">
        <a-card :bordered="false">
          <!--組織-->
          <a-directory-tree
            selectable
            :selectedKeys="selectedDepIds"
            :checkStrictly="true"
            @select="onDepSelect"
            :dropdownStyle="{maxHeight:'200px',overflow:'auto'}"
            :treeData="departTree"
          />
        </a-card>
      </a-col>
      <a-col :md="18" :sm="24">
        <a-card :bordered="false">
          ユーザー：
          <a-input-search
            :style="{width:'150px',marginBottom:'15px'}"
            placeholder="ユーザーを入力してください"
            v-model="queryParam.username"
            @search="onSearch"
          ></a-input-search>
          <a-button @click="searchReset(1)" style="margin-left: 20px" icon="redo">リセット</a-button>
          <!--ユーザー一覧-->
          <a-table
            ref="table"
            :scroll="scrollTrigger"
            size="middle"
            rowKey="id"
            :columns="columns"
            :dataSource="dataSource"
            :pagination="ipagination"
            :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange,type: getType}"
            @change="handleTableChange">
          </a-table>
        </a-card>
      </a-col>
    </a-row>
  </a-modal>
</template>

<script>
  import {filterObj} from '@/utils/util'
  import {queryDepartTreeList, getUserList, queryUserByDepId} from '@/api/api'

  export default {
    name: 'JSelectUserByDepModal',
    components: {},
    props: ['modalWidth', 'multi', 'userIds'],
    data() {
      return {
        queryParam: {
          username: "",
        },
        columns: [
          {
            title: 'ユーザー',
            align: 'center',
            dataIndex: 'username'
          },
          {
            title: '姓名',
            align: 'center',
            dataIndex: 'realname'
          },
          {
            title: 'ロール名',
            align: 'center',
            dataIndex: 'roleName'
          },
          {
            title: '性別',
            align: 'center',
            dataIndex: 'sex',
            customRender: function (text) {
              if (text === 1) {
                return '男性'
              } else if (text === 2) {
                return '女性'
              } else {
                return text
              }
            }
          },
          {
            title: '電話番号',
            align: 'center',
            dataIndex: 'phone'
          },
          {
            title: 'メール',
            align: 'center',
            dataIndex: 'email'
          }
        ],
        scrollTrigger: {},
        dataSource: [],
        selectedRowKeys: [],
        selectUserRows: [],
        selectUserIds: [],
        title: '部門別にユーザーを選択する',
        ipagination: {
          current: 1,
          pageSize: 10,
          pageSizeOptions: ['10', '20', '30'],
          showTotal: (total, range) => {
            return range[0] + '-' + range[1] + ' 合計' + total + '件'
          },
          showQuickJumper: true,
          showSizeChanger: true,
          total: 0
        },
        isorter: {
          column: 'createTime',
          order: 'desc'
        },
        selectedDepIds: [],
        departTree: [],
        visible: false,
        form: this.$form.createForm(this)
      }
    },
    computed: {
      // 計算されたプロパティのゲッター
      getType: function () {
        console.log("multi: ", this.multi);
        return this.multi == true ? 'checkbox' : 'radio';
      }
    },
    watch: {
      userIds() {
        this.initUserNames()
      }
    },
    created() {
      // このメソッドは画面適応をトリガーします
      this.resetScreenSize();
      this.loadData().then((res) => {
        this.initUserNames();
      })
    },
    methods: {
      initUserNames() {
        let names = ''
        console.log("props userIds: ", this.userIds)
        if (this.userIds) {
          let currUserIds = this.userIds
          let userIdsArr = currUserIds.split(',');
          for (let item of this.dataSource) {
            if (userIdsArr.includes(item.username)) {
              names += "," + item.realname
            }
          }
          if (names) {
            names = names.substring(1)
          }
          this.$emit("initComp", names)
        }
      },
      async loadData(arg) {
        if (arg === 1) {
          this.ipagination.current = 1;
        }
        let params = this.getQueryParams();//検索条件
        await getUserList(params).then((res) => {
          if (res.success) {
            this.dataSource = res.result.records;
            this.ipagination.total = res.result.total;
          }
        })
      },
      // トリガー画面の適応
      resetScreenSize() {
        let screenWidth = document.body.clientWidth;
        if (screenWidth < 500) {
          this.scrollTrigger = {x: 800};
        } else {
          this.scrollTrigger = {};
        }
      },
      showModal() {
        this.visible = true;
        this.queryDepartTree();
        this.loadData();
        this.form.resetFields();
      },
      getQueryParams() {
        let param = Object.assign({}, this.queryParam, this.isorter);
        param.field = this.getQueryField();
        param.pageNo = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        return filterObj(param);
      },
      getQueryField() {
        let str = 'id,';
        for (let a = 0; a < this.columns.length; a++) {
          str += ',' + this.columns[a].dataIndex;
        }
        return str;
      },
      searchReset(num) {
        let that = this;
        if (num !== 0) {
          that.queryParam = {};
          that.loadData(1);
        }
        that.selectedRowKeys = [];
        that.selectUserIds = [];
        that.selectedDepIds = [];
      },
      close() {
        this.searchReset(0);
        this.visible = false;
      },
      handleTableChange(pagination, filters, sorter) {
        //TODO スクリーニング
        if (Object.keys(sorter).length > 0) {
          this.isorter.column = sorter.field;
          this.isorter.order = 'ascend' === sorter.order ? 'asc' : 'desc';
        }
        this.ipagination = pagination;
        this.loadData();
      },
      handleSubmit() {
        let that = this;
        this.getSelectUserRows();
        console.log(that.selectUserRows)
        that.$emit('ok', that.selectUserRows, that.selectUserIds);
        that.searchReset(0)
        that.close();
      },
      //選択したユーザー情報を取得する
      getSelectUserRows(rowId) {
        let dataSource = this.dataSource;
        let userIds = "";
        this.selectUserRows = [];
        for (let i = 0, len = dataSource.length; i < len; i++) {
          if (this.selectedRowKeys.includes(dataSource[i].id)) {
            this.selectUserRows.push(dataSource[i]);
            userIds = userIds + "," + dataSource[i].username
          }
        }
        this.selectUserIds = userIds.substring(1);
      },
      // ツリーノードをクリックして、対応するユーザーを除外します
      onDepSelect(selectedDepIds) {
        if (selectedDepIds[0] != null) {
          this.initQueryUserByDepId(selectedDepIds); // メソッドを呼び出して、選択したIDに従ってユーザー情報を照会します
          if (this.selectedDepIds[0] !== selectedDepIds[0]) {
            this.selectedDepIds = [selectedDepIds[0]];
          }
        }
      },
      onSelectChange(selectedRowKeys, selectionRows) {
        this.selectedRowKeys = selectedRowKeys;
        this.selectionRows = selectionRows;
      },
      onSearch() {
        this.loadData(1);
      },
      // 選択したIDに基づいてユーザー情報を照会する
      initQueryUserByDepId(selectedDepIds) {
        queryUserByDepId({id: selectedDepIds.toString()}).then((res) => {
          if (res.success) {
            this.dataSource = res.result;
            this.ipagination.total = res.result.length;
          }
        })
      },
      queryDepartTree() {
        queryDepartTreeList().then((res) => {
          if (res.success) {
            this.departTree = res.result;
          }
        })
      },
      modalFormOk() {
        this.loadData();
      }
    }
  }
</script>

<style scoped>
  .ant-table-tbody .ant-table-row td {
    padding-top: 10px;
    padding-bottom: 10px;
  }

  #components-layout-demo-custom-trigger .trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color .3s;
  }
</style>