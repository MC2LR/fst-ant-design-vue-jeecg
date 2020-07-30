/**
 * 追加修正済み呼び出しmodalFormOkメソッド編集用のテキストボックス・コンポーネントrefをmodalFormと定義する
 * 高度な問合せボタン呼び出しsuperQueryメソッド高度な問合せコンポーネントrefは,superQueryModalとして定義される
 * data中のurl定義listは,クエリーリストdeleteは削除シングルレコードdeleteBatchは一括削除である
 */
import { filterObj } from '@/utils/util';
import { deleteAction, getAction,downFile } from '@/api/manage'
import Vue from 'vue'
import { ACCESS_TOKEN } from "@/store/mutation-types"

export const JeecgListMixin = {
  data(){
    return {
      //token header
      tokenHeader: {'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)},
      /* クエリ条件——queryParamでは非文字列値の属性を宣言しないでください */
      queryParam: {},
      /* でーたそうしんそうち */
      dataSource:[],
      /* ページ別パラメータ */
      ipagination:{
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30'],
        showTotal: (total, range) => {
          return range[0] + "-" + range[1] + "共に" + total + "条"
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
      },
      /* 整列化パラメータ */
      isorter:{
        column: 'createTime',
        order: 'desc',
      },
      /* パラメータのスクリーニング */
      filters: {},
      /*テーブルロード状態 */
      loading:false,
      /* テーブル選択のkeys*/
      selectedRowKeys: [],
      /* テーブル選択records*/
      selectionRows: [],
      /* クエリー折りたたみ */
      toggleSearchStatus:false,
      /* アドバンストクエリ条件の有効状態*/
      superQueryFlag:false,
      /* 詳細なクエリー条件 */
      superQueryParams:""
    }
  },
  created() {
    if(!this.disableMixinCreated){
      console.log(' -- mixin created -- ')
      this.loadData();
      //初期化辞書の設定は自分のページで定義されます
      this.initDictConfig();
    }
  },
  methods:{
    loadData(arg,res) {
      if(!this.url.list){
        this.$message.error("url.list属性を設定してください。!")
        return
      }
      //ロードデータがパラメータ1に入力されると、1ページ目のコンテンツがロードされる
      if (arg === 1) {
        this.ipagination.current = 1;
      }
      var params = this.getQueryParams();//問い合わせ条件
     
      this.loading = true;
      // if(res !="" && res !=null ){
      //   console.log(params)
      //   console.log(res)
      //   getAction(this.url.listByCompany, {realname:params.realname,username:params.username,companyId:res}).then((res) => {
      //     if (res.success) {
      //       this.dataSource = res.result.records;
      //       this.ipagination.total = res.result.total;
      //     }
      //     if(res.code===510){
      //       this.$message.warning(res.message)
      //     }
      //     this.loading = false;
      //   })
      // }else{
      //   getAction(this.url.list, params).then((res) => {
      //     if (res.success) {
      //       this.dataSource = res.result.records;
      //       this.ipagination.total = res.result.total;
      //     }
      //     if(res.code===510){
      //       this.$message.warning(res.message)
      //     }
      //     this.loading = false;
      //   })
      // }
      getAction(this.url.list, params).then((res) => {
        if (res.success) {
          this.dataSource = res.result.records;
          this.ipagination.total = res.result.total;
        }
        if(res.code===510){
          this.$message.warning(res.message)
        }
        this.loading = false;
      })
    },
    initDictConfig(){
      console.log("--これは偽の方法です!")
    },
    handleSuperQuery(arg) {
      //上位検索方法
      if(!arg){
        this.superQueryParams=''
        this.superQueryFlag = false
      }else{
        this.superQueryFlag = true
        this.superQueryParams=JSON.stringify(arg)
      }
      this.loadData()
    },
    getQueryParams() {
      //問合せ条件の取得
      let sqp = {}
      if(this.superQueryParams){
        sqp['superQueryParams']=encodeURI(this.superQueryParams)
      }
      var param = Object.assign(sqp, this.queryParam, this.isorter ,this.filters);
      param.field = this.getQueryField();
      param.pageNo = this.ipagination.current;
      param.pageSize = this.ipagination.pageSize;
      return filterObj(param);
    },
    getQueryField() {
      //TODO フィールド権限制御
      var str = "id,";
      this.columns.forEach(function (value) {
        str += "," + value.dataIndex;
      });
      return str;
    },

    onSelectChange(selectedRowKeys, selectionRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectionRows = selectionRows;
    },
    onClearSelected() {
      this.selectedRowKeys = [];
      this.selectionRows = [];
    },
    searchQuery(res) {
      this.loadData(1,res);
    },
    superQuery() {
      this.$refs.superQueryModal.show();
    },
    searchReset() {
      this.queryParam = {}
      this.loadData(1);
    },
    batchDel: function () {
      if(!this.url.deleteBatch){
        this.$message.error("url.deleteBatchのプロパティを設定してください!")
        return
      }
      if (this.selectedRowKeys.length <= 0) {
        this.$message.warning('記録を1つ選んでください！');
        return;
      } else {
        var ids = "";
        for (var a = 0; a < this.selectedRowKeys.length; a++) {
          ids += this.selectedRowKeys[a] + ",";
        }
        var that = this;
        this.$confirm({
          title: "削除を確認する",
          content: "データを削除するかどうか?",
          onOk: function () {
            that.loading = true;
            deleteAction(that.url.deleteBatch, {ids: ids}).then((res) => {
              if (res.success) {
                that.$message.success(res.message);
                that.loadData();
                that.onClearSelected();
              } else {
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.loading = false;
            });
          }
        });
      }
    },
    handleDelete: function (id) {
      if(!this.url.delete){
        this.$message.error("url.delete属性を設定してください。!")
        return
      }
      var that = this;
      deleteAction(that.url.delete, {id: id}).then((res) => {
        if (res.success) {
          that.$message.success(res.message);
          that.loadData();
        } else {
          that.$message.warning(res.message);
        }
      });
    },
    handleEdit: function (record) {
      this.$refs.modalForm.edit(record);
      this.$refs.modalForm.title = this.$t('edit');
      this.$refs.modalForm.disableSubmit = false;
    },
    handleAdd: function () {
      this.$refs.modalForm.add();
      this.$refs.modalForm.title = this.$t('add');
      this.$refs.modalForm.disableSubmit = false;
    },
    handleTableChange(pagination, filters, sorter) {
      //ページング,ランキング,フィルタリングが変化したときにトリガする
      //TODO ふるいわけ
      if (Object.keys(sorter).length > 0) {
        this.isorter.column = sorter.field;
        this.isorter.order = "ascend" == sorter.order ? "asc" : "desc"
      }
      this.ipagination = pagination;
      this.loadData();
    },
    handleToggleSearch(){
      this.toggleSearchStatus = !this.toggleSearchStatus;
    },
    modalFormOk() {
      // 新規/修正が成功した場合,リストをオーバロードする
      this.loadData();
    },
    handleDetail:function(record){
      this.$refs.modalForm.edit(record);
      this.$refs.modalForm.title="詳しい情況。";
      this.$refs.modalForm.disableSubmit = true;
    },
    /* りーどあうと クスポート*/
    handleExportXls2(){
      let paramsStr = encodeURI(JSON.stringify(this.getQueryParams()));
      let url = `${window._CONFIG['domianURL']}/${this.url.exportXlsUrl}?paramsStr=${paramsStr}`;
      window.location.href = url;
    },
    handleExportXls(fileName){
      if(!fileName || typeof fileName != "string"){
        fileName = "導出ファイル"
      }
      let param = {...this.queryParam};
      if(this.selectedRowKeys && this.selectedRowKeys.length>0){
        param['selections'] = this.selectedRowKeys.join(",")
      }
      console.log("導出パラメータ",param)
      downFile(this.url.exportXlsUrl,param).then((data)=>{
        if (!data) {
          this.$message.warning("ファイルダウンロードに失敗")
          return
        }
        if (typeof window.navigator.msSaveBlob !== 'undefined') {
          window.navigator.msSaveBlob(new Blob([data]), fileName+'.xls')
        }else{
          let url = window.URL.createObjectURL(new Blob([data]))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', fileName+'.xls')
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link); //ダウンロードが完了した
          window.URL.revokeObjectURL(url); //blobオブジェクトをリリース
        }
      })
    },
    /* おりえんてーしょん */
    handleImportExcel(info){
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        if (info.file.response.success) {
          // this.$message.success(`${info.file.name} ファイルアップロードに成功`);
          if (info.file.response.code === 201) {
            let { message, result: { msg, fileUrl, fileName } } = info.file.response
            let href = window._CONFIG['domianURL'] + fileUrl
            this.$warning({
              title: message,
              content: (
                <div>
                  <span>{msg}</span><br/>
                  <span>詳細はどうぞ <a href={href} target="_blank" download={fileName}>ダウンロード</a> </span>
                </div>
              )
            })
          } else {
            this.$message.success(info.file.response.message || `${info.file.name} ファイルアップロードに成功`)
          }
          this.loadData()
        } else {
          this.$message.error(`${info.file.name} ${info.file.response.message}.`);
        }
      } else if (info.file.status === 'error') {
        this.$message.error(`ファイルのアップロードに失敗: ${info.file.msg} `);
      }
    },
    /* 画像プレビュー */
    getImgView(text){
      if(text && text.indexOf(",")>0){
        text = text.substring(0,text.indexOf(","))
      }
      return window._CONFIG['imgDomainURL']+"/"+text
    },
    /* ファイルダウンロード */
    uploadFile(text){
      if(!text){
        this.$message.warning("未知のファイル")
        return;
      }
      if(text.indexOf(",")>0){
        text = text.substring(0,text.indexOf(","))
      }
      window.open(window._CONFIG['domianURL'] + "/sys/common/download/"+text);
    },
  }

}