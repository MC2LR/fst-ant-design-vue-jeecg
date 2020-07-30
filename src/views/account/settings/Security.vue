<template>
  <a-list
    itemLayout="horizontal"
    :dataSource="data"
  >
    <a-list-item slot="renderItem" slot-scope="item, index" :key="index">
      <a-list-item-meta>
        <a slot="title">{{ item.title }}</a>
        <span slot="description">
          <span class="security-list-description">{{ item.description }}</span>
          <span v-if="item.value"> : </span>
          <span class="security-list-value">{{ item.value }}</span>
        </span>
      </a-list-item-meta>
      <template v-if="item.actions">
        <a slot="actions" @click="item.actions.callback">{{ item.actions.title }}</a>
      </template>

    </a-list-item>
  </a-list>
</template>

<script>
  export default {
    data () {
      return {
        data: [
          { title: ' アカウントのパスワード' , description: '現在のパスワードの強度', value: '強い', actions: { title: '変更', callback: () => { this.$message.info('This is a normal message'); } } },
          { title: '携帯電話のロック' , description: '携帯電話をバインドしました', value: '138****8293', actions: { title: '変更', callback: () => { this.$message.success('This is a message of success'); } }  },
          { title: '秘密保護の問題' , description: 'セキュリティ問題が設定されていません。セキュリティ問題はアカウントの安全を効果的に保護します', value: '', actions: { title: '設定', callback: () => { this.$message.error('This is a message of error'); } }  },
          { title: 'バックアップメールボックス' , description: 'バインドされたメールボックス', value: 'ant***sign.com', actions: { title: '変更', callback: () => { this.$message.warning('This is message of warning'); } }  },
          { title: 'MFA デバイス' , description: 'MFAデバイスをバインドしていません。バインディング後、二回確認できます', value: '', actions: { title: '結合', callback: () => { this.$message.info('This is a normal message'); } }  },
        ]
      }
    }
  }
</script>

<style scoped>

</style>