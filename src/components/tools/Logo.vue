<template>
  <div class="logo">
    <router-link :to="{name:'dashboard'}">

      <!-- update-begin- author:sunjianlei --- date:20190814 --- for: logo色はテーマによって変化する -->
      <img v-if="navTheme === 'dark'" src="~@/assets/logo-white.png" alt="logo">
      <img v-else src="~@/assets/logo.svg" alt="logo">
      <!-- update-begin- author:sunjianlei --- date:20190814 --- for: logo色はテーマによって変化する -->

      <h1 v-if="showTitle">{{ title }}</h1>
    </router-link>
  </div>
</template>

<script>
  import { mixin } from '@/utils/mixin.js'

  export default {
    name: 'Logo',
    mixins: [mixin],
    props: {
      title: {
        type: String,
        default: 'Jeecg-Boot Pro',
        required: false
      },
      showTitle: {
        type: Boolean,
        default: true,
        required: false
      }
    }
  }
</script>
<style lang="scss" scoped>
  /*トップの高さを縮小*/
  $height: 59px;

  .sider {
    box-shadow: none !important;
    .logo {
      height: $height !important;
      line-height: $height !important;
      box-shadow: none !important;
      transition: background 300ms;

      a {
        color: white;
        &:hover {
          color: rgba(255, 255, 255, 0.8);
        }
      }
    }

    &.light .logo {
      background-color: #1890ff;
    }
  }
</style>