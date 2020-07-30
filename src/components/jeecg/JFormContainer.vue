<template>
  <div :class="disabled?'jeecg-form-container-disabled':''">
    <fieldset disabled>
      <slot name="detail"></slot>
    </fieldset>
    <slot name="edit"></slot>
    <fieldset disabled>
      <slot></slot>
    </fieldset>
  </div>
</template>

<script>
  /**
   * 使い方
   * このコンポーネントをフォームの下に直接書くだけで、
   *<a-form layout="inline" :form="form" >
   *     <j-form-container :disabled="true">
   *         <!-- 省略されたフォームの内容..... -->
   *     </j-form-container>
   *</a-form>
   */
  export default {
    name: 'JFormContainer',
    props:{
      disabled:{
        type:Boolean,
        default:false,
        required:false
      }
    },
    mounted(){
      console.log("私はフォームを無効にする特別なコンポーネントですが、フォーム内のiframeのコンテンツを無効にすることはサポートしていません")
    }
  }
</script>
<style>
  .jeecg-form-container-disabled{
    cursor: not-allowed;
  }
  .jeecg-form-container-disabled fieldset[disabled] {
    -ms-pointer-events: none;
    pointer-events: none;
  }
  .jeecg-form-container-disabled .ant-select{
    -ms-pointer-events: none;
    pointer-events: none;
  }
</style>