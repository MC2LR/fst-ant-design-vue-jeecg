<template>
  <a-locale-provider  :locale="locale">
    <div id="app">
       <div class="change-locale" v-show="flag">
        <a-radio-group :defaultValue="jp" @change="changeLocale" ref="sxx">
          <a-radio-button key="jp" :value="jp">日本語</a-radio-button>
          <a-radio-button key="cn" :value="cn">中文</a-radio-button>
          <a-radio-button key="en" :value="en">English</a-radio-button>
          <a-radio-button key="ko" :value="ko">한국어</a-radio-button>
        </a-radio-group>
      </div>
      <router-view />
    </div>
  </a-locale-provider>
</template>
<script>
  import enquireScreen from '@/utils/device'
  import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN';
  import en_US from 'ant-design-vue/lib/locale-provider/en_US';
  import ja_Jp from 'ant-design-vue/lib/locale-provider/ja_JP';
  import ko_KR from 'ant-design-vue/lib/locale-provider/ko_KR';
  import moment from 'moment';
  import 'moment/locale/zh-cn';
  import 'moment/locale/en-gb';
  import 'moment/locale/ja';
  import 'moment/locale/ko';
  import Vue from 'vue'
  moment.locale('zh-cn');
  
  export default {
    data () {
      return {
         locale:zh_CN,
        cn:{
          a:'zh-CN',
          b:zh_CN,
          c:'zh-cn',
        },
        jp: {
          a:'ja-Jp',
          b:ja_Jp,
          c:'ja',
        },
        en:{
          a:'en-US',
          b:en_US,
          c:'en-gb',
        },
        ko:{
          a:'ko-KR',
          b:ko_KR,
          c:'ko',
        },
        flag:true,
      }
    },
    methods:{
      changeLocale(e) {
      this.locale=e.target.value.b;
      moment.locale(e.target.value.c);
      this.$i18n.locale = e.target.value.a; 
      Vue.ls.set("language", e.target.value);//localStorage
      },
    },
    watch:{
      $route(to,from){
        if(to.path!='/user/login'){
          this.flag=false;
          this.locale= Vue.ls.get("language").b;
          moment.locale(Vue.ls.get("language").c);
          this.$i18n.locale = Vue.ls.get("language").a;
        }else{
          this.flag=true;
          this.locale=ja_Jp;
          moment.locale('ja');
          this.$i18n.locale = 'ja-Jp';
          Vue.ls.set("language", this.jp)
          this.$refs.sxx.stateValue=this.jp
        }
      }
    },
    mounted () {
      document.body.classList.add('userLayout');
    },
    created () {
      let that = this
      enquireScreen(deviceType => {
        // tablet
        if (deviceType === 0) {
          that.$store.commit('TOGGLE_DEVICE', 'mobile')
          that.$store.dispatch('setSidebar', false)
        }
        // mobile
        else if (deviceType === 1) {
          that.$store.commit('TOGGLE_DEVICE', 'mobile')
          that.$store.dispatch('setSidebar', false)
        }
        else {
          that.$store.commit('TOGGLE_DEVICE', 'desktop')
          that.$store.dispatch('setSidebar', true)
        }

      })
    }
    
  }
</script>
<style>
  #app {
    height: 100%;
  }
  .change-locale{
        position: fixed;
        top:0;
        right: 0;
        z-index: 2;
      }
</style>