<template>
  <a-popover
    trigger="click"
    placement="bottomRight"
    :autoAdjustOverflow="true"
    :arrowPointAtCenter="true"
    overlayClassName="header-notice-wrapper"
    @visibleChange="handleHoverChange"
    :overlayStyle="{ width: '300px', top: '50px' }">
    <template slot="content">
      <a-spin :spinning="loadding">
        <a-tabs>
          <a-tab-pane :tab="msg1Title" key="1">
            <!--<a-list>
              <a-list-item>
                <a-list-item-meta title="あなたは新しい週報を14通受け取った" description="一年前">
                  <a-avatar style="background-color: white" slot="avatar" src="https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png"/>
                </a-list-item-meta>
              </a-list-item>
              <a-list-item>
                <a-list-item-meta title="あなたが推薦したIT大牛は3次面接に合格した" description="一年前">
                  <a-avatar style="background-color: white" slot="avatar" src="https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png"/>
                </a-list-item-meta>
              </a-list-item>
              <a-list-item>
                <a-list-item-meta title=" このテンプレートは、複数の通知の種類を区別することができます" description="一年前">
                  <a-avatar style="background-color: white" slot="avatar" src="https://gw.alipayobjects.com/zos/rmsportal/kISTdvpyTAhtGxpovNWd.png"/>
                </a-list-item-meta>
              </a-list-item>
            </a-list>-->
            <a-list>
              <a-list-item :key="index" v-for="(record, index) in announcement1">
                <div style="margin-left: 5%;width: 80%">
                  <p><a @click="showAnnouncement(record)">表題：{{ record.titile }}</a></p>
                  <p style="color: rgba(0,0,0,.45);margin-bottom: 0px">{{ record.createTime }} 公表する</p>
                </div>
                <div style="text-align: right">
                  <a-tag @click="showAnnouncement(record)" v-if="record.priority === 'L'" color="blue">一般ニュース</a-tag>
                  <a-tag @click="showAnnouncement(record)" v-if="record.priority === 'M'" color="orange">重要なニュース</a-tag>
                  <a-tag @click="showAnnouncement(record)" v-if="record.priority === 'H'" color="red">緊急ニュース</a-tag>
                </div>
              </a-list-item>
              <div style="margin-top: 5px;text-align: center">
                <a-button @click="toMyAnnouncement()" type="dashed" block>もっと調べて</a-button>
              </div>
            </a-list>
          </a-tab-pane>
          <a-tab-pane :tab="msg2Title" key="2">
            <a-list>
              <a-list-item :key="index" v-for="(record, index) in announcement2">
                <div style="margin-left: 5%;width: 80%">
                  <p><a @click="showAnnouncement(record)">表題：{{ record.titile }}</a></p>
                  <p style="color: rgba(0,0,0,.45);margin-bottom: 0px">{{ record.createTime }} 公表する</p>
                </div>
                <div style="text-align: right">
                  <a-tag @click="showAnnouncement(record)" v-if="record.priority === 'L'" color="blue">一般ニュース</a-tag>
                  <a-tag @click="showAnnouncement(record)" v-if="record.priority === 'M'" color="orange">重要なニュース</a-tag>
                  <a-tag @click="showAnnouncement(record)" v-if="record.priority === 'H'" color="red">緊急ニュース</a-tag>
                </div>
              </a-list-item>
              <div style="margin-top: 5px;text-align: center">
                <a-button @click="toMyAnnouncement()" type="dashed" block>もっと調べて</a-button>
              </div>
            </a-list>
          </a-tab-pane>
        </a-tabs>
      </a-spin>
    </template>
    <span @click="fetchNotice" class="header-notice">
      <a-badge :count="msgTotal">
        <a-icon style="font-size: 16px; padding: 4px" type="bell" />
      </a-badge>
    </span>
    <show-announcement ref="ShowAnnouncement" @ok="modalFormOk"></show-announcement>
  </a-popover>
</template>

<script>
  import { getAction,putAction } from '@/api/manage'
  import ShowAnnouncement from './ShowAnnouncement'
  import store from '@/store/'


  export default {
    name: "HeaderNotice",
    components: {
      ShowAnnouncement,
    },
    data () {
      return {
        loadding: false,
        url:{
          listCementByUser:"/sys/annountCement/listByUser",
          editCementSend:"/sys/sysAnnouncementSend/editByAnntIdAndUserId",
          queryById:"/sys/annountCement/queryById",
        },
        hovered: false,
        announcement1:[],
        announcement2:[],
        msg1Count:"0",
        msg2Count:"0",
        msg1Title:"通知する(0)",
        msg2Title:"",
        stopTimer:false,
        websock: null,
        lockReconnect:false,
        heartCheck:null,
      }
    },
    computed:{
      msgTotal () {
        return parseInt(this.msg1Count)+parseInt(this.msg2Count);
      }
    },
    mounted() {
      this.loadData();
      //this.timerFun();
      this.initWebSocket();
      this.heartCheckFun();
    },
    destroyed: function () { // ページのライフサイクル関数から離れる
      this.websocketclose();
    },
    methods: {
      timerFun() {
        this.stopTimer = false;
        let myTimer = setInterval(()=>{
          // タイマーを止める
          if (this.stopTimer == true) {
            clearInterval(myTimer);
            return;
          }
          this.loadData()
        },6000)
      },
      loadData (){
        try {
          // システムメッセージを取得する
          getAction(this.url.listCementByUser).then((res) => {
            if (res.success) {
              this.announcement1 = res.result.anntMsgList;
              this.msg1Count = res.result.anntMsgTotal;
              this.msg1Title = "通知する(" + res.result.anntMsgTotal + ")";
              this.announcement2 = res.result.sysMsgList;
              this.msg2Count = res.result.sysMsgTotal;
              this.msg2Title = "システムメッセージ(" + res.result.sysMsgTotal + ")";
            }
          }).catch(error => {
            console.log("システムメッセージ通知異常",error);//这行打印permissionName is undefined
            this.stopTimer = true;
            console.log("清算するtimer");
          });
        } catch (err) {
          this.stopTimer = true;
          console.log("異常を知らせる",err);
        }
      },
      fetchNotice () {
        if (this.loadding) {
          this.loadding = false
          return
        }
        this.loadding = true
        setTimeout(() => {
          this.loadding = false
        }, 200)
      },
      showAnnouncement(record){
        putAction(this.url.editCementSend,{anntId:record.id}).then((res)=>{
          if(res.success){
            this.loadData();
          }
        });
        this.hovered = false;
        this.$refs.ShowAnnouncement.detail(record);
      },
      toMyAnnouncement(){

        this.$router.push({
          path: '/isps/userAnnouncement',
          name: 'isps-userAnnouncement'
        });
      },
      modalFormOk(){
      },
      handleHoverChange (visible) {
        this.hovered = visible;
      },

      initWebSocket: function () {
        // WebSocketは普通の要求とは違って、wsはhttpに相当し、wsはhttpsに相当する。
        var userId = store.getters.userInfo.id;
        var url = window._CONFIG['domianURL'].replace("https://","wss://").replace("http://","ws://")+"/websocket/"+userId;
        //console.log(url);
        this.websock = new WebSocket(url);
        this.websock.onopen = this.websocketonopen;
        this.websock.onerror = this.websocketonerror;
        this.websock.onmessage = this.websocketonmessage;
        this.websock.onclose = this.websocketclose;
      },
      websocketonopen: function () {
        console.log("WebSocket接続に成功しました");
        //心跳检测重置
        this.heartCheck.reset().start();
      },
      websocketonerror: function (e) {
        console.log("WebSocket接続にエラーが発生しました");
        this.reconnect();
      },
      websocketonmessage: function (e) {
        //console.log("-----メッセージを受信する-------",e.data);
        var data = eval("(" + e.data + ")"); //解析対象
        if(data.cmd == "topic"){
            //システム通知
          this.loadData();
        }else if(data.cmd == "user"){
            //ユーザーメッセージ
          this.loadData();
        }

        //心拍数検出リセット
        this.heartCheck.reset().start();

      },
      websocketsend(text) { // データ送信
        try {
          this.websock.send(text);
        } catch (err) {
          console.log("send failed (" + err.code + ")");
        }
      },
      websocketclose: function (e) {
        console.log("connection closed (" + e.code + ")");
        this.reconnect();
      },

      openNotification (data) {
        var text = data.msgTxt;
        const key = `open${Date.now()}`;
        this.$notification.open({
          message: 'メッセージが聞こえる',
          placement:'bottomRight',
          description: text,
          key,
          btn: (h)=>{
            return h('a-button', {
              props: {
                type: 'primary',
                size: 'small',
              },
              on: {
                click: () => this.showDetail(key,data)
              }
            }, '詳細を調べる')
          },
        });
      },

      reconnect() {
        var that = this;
        if(that.lockReconnect) return;
        that.lockReconnect = true;
        //未接続ではずっと重連し,遅延を設けて要求を過剰にしない
        setTimeout(function () {
          console.info("重連を試みる...");
          that.initWebSocket();
          that.lockReconnect = false;
        }, 5000);
      },
      heartCheckFun(){
        var that = this;
        //心拍数は20sごとに測定します
        that.heartCheck = {
          timeout: 20000,
          timeoutObj: null,
          serverTimeoutObj: null,
          reset: function(){
            clearTimeout(this.timeoutObj);
            //clearTimeout(this.serverTimeoutObj);
            return this;
          },
          start: function(){
            var self = this;
            this.timeoutObj = setTimeout(function(){
              //ここで心拍数を送信した後に心拍数メッセージを返します
              //onmessageが戻ってきたときの心拍数を受け取ると,接続が正常であることを示す
              that.websocketsend("HeartBeat");
              console.info("客户端发送心跳");
              //self.serverTimeoutObj = setTimeout(function(){//一定時間が経過してもリセットされない場合は、バックエンドが自発的に切断される
              // that.websock.close()///もしoncloseがreconnectを実行するなら、私達はws.closeを実行すればいいです。直接reconnectを実行すれば、Ocloseをトリガして、2回連続して重いです。
              //}, self.timeout)
            }, this.timeout)
          }
        }
      },


      showDetail(key,data){
        this.$notification.close(key);
        var id = data.msgId;
        getAction(this.url.queryById,{id:id}).then((res) => {
          if (res.success) {
            var record = res.result;
            this.showAnnouncement(record);
          }
        })

      },
    }
  }
</script>

<style lang="css">
  .header-notice-wrapper {
    top: 50px !important;
  }
</style>
<style lang="scss" scoped>
  .header-notice{
    display: inline-block;
    transition: all 0.3s;

    span {
      vertical-align: initial;
    }
  }
</style>