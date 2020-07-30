<!-- JEditableTable -->
<!-- @version 1.5.0 -->
<!-- @author sjlei -->
<template>
  <a-spin :spinning="loading">

    <a-row type="flex">
      <a-col>
        <slot name="buttonBefore" :target="getVM()"/>
      </a-col>
      <a-col>
        <!-- 操作ボタン -->
        <div v-if="actionButton" class="action-button">
          <a-button type="primary" icon="plus" @click="handleClickAdd">新規</a-button>
          <span class="gap"></span>
          <template v-if="selectedRowIds.length>0">
            <a-popconfirm
              :title="`「この$（selectedRowIds.length）アイテムを削除してもよろしいですか？」`"
              @confirm="handleConfirmDelete">
              <a-button type="primary" icon="minus">削除</a-button>
              <span class="gap"></span>
            </a-popconfirm>
            <template v-if="showClearSelectButton">
              <a-button icon="delete" @click="handleClickClearSelection">選択をクリア</a-button>
              <span class="gap"></span>
            </template>
          </template>
        </div>
      </a-col>
      <a-col>
        <slot name="buttonAfter" :target="getVM()"/>
      </a-col>
    </a-row>

    <div :id="`${caseId}inputTable`" class="input-table">
      <!-- レンダリングヘッダー -->
      <div class="thead" ref="thead">
        <div class="tr" :style="{width: this.realTrWidth}">
          <!-- 左固定td -->
          <div v-if="dragSort" class="td td-ds" :style="style.tdLeftDs">
            <span></span>
          </div>
          <div v-if="rowSelection" class="td td-cb" :style="style.tdLeft">
            <!--:indeterminate="true"-->
            <a-checkbox
              :checked="getSelectAll"
              :indeterminate="getSelectIndeterminate"
              @change="handleChangeCheckedAll"
            />
          </div>
          <div v-if="rowNumber" class="td td-num" :style="style.tdLeft">
            <span>#</span>
          </div>
          <!-- 右側のtdを動的に生成します -->
          <template v-for="col in columns">
            <div
              v-show="col.type !== formTypes.hidden"
              class="td"
              :key="col.key"
              :style="buildTdStyle(col)">

              <span>{{ col.title }}</span>
            </div>
          </template>
        </div>
      </div>

      <div class="scroll-view" ref="scrollView" :style="{'max-height':maxHeight+'px'}">


        <!-- ボディをレンダリングする body -->
        <div :id="`${caseId}tbody`" class="tbody" :style="tbodyStyle">
          <!-- 拡張された高さ -->
          <div class="tr-expand" :style="`height:${getExpandHeight}px; z-index:${loading?'11':'9'};`"></div>
          <!-- データがないときに表示する -->
          <div v-if="rows.length===0" class="tr-nodata">
            <span>データなし</span>
          </div>
<!--           v-model="rows"-->
          <draggable :value="rows" handle=".td-ds-icons" @end="handleDragMoveEnd">

            <!-- trを動的に生成します -->
            <template v-for="(row,rowIndex) in rows">
              <!-- trは、表示およびプリロードされた合計10個のデータのみをロードします -->
              <div
                v-if="
                rowIndex >= parseInt(`${(scrollTop-rowHeight) / rowHeight}`) &&
                  (parseInt(`${scrollTop / rowHeight}`) + 9) > rowIndex
              "
                :id="`${caseId}tbody-tr-${rowIndex}`"
                :data-idx="rowIndex"
                class="tr"
                :class="selectedRowIds.indexOf(row.id) !== -1 ? 'tr-checked' : ''"
                :style="buildTrStyle(rowIndex)"
                :key="row.id">
                <!-- 左固定td  -->

                <div v-if="dragSort" class="td td-ds" :style="style.tdLeftDs">
                  <div class="td-ds-icons">
                    <a-icon type="align-left"/>
                    <a-icon type="align-right"/>
                  </div>
                </div>

                <div v-if="rowSelection" class="td td-cb" :style="style.tdLeft">
                  <!-- このv-forは、単にID文字列を連結するためのものです -->
                  <template v-for="(id,i) in [`${row.id}`]">
                    <a-checkbox
                      :id="id"
                      :key="i"
                      :checked="selectedRowIds.indexOf(id) !== -1"
                      @change="handleChangeLeftCheckbox"/>
                  </template>
                </div>
                <div v-if="rowNumber" class="td td-num" :style="style.tdLeft">
                  <span>{{ rowIndex+1 }}</span>
                </div>
                <!-- 右側のtdを動的に生成します -->
                <div
                  class="td"
                  v-for="col in columns"
                  v-show="col.type !== formTypes.hidden"
                  :key="col.key"
                  :style="buildTdStyle(col)">

                  <!-- このv-forは、単にID文字列を連結するためのものです -->
                  <template v-for="(id,i) in [`${col.key}${row.id}`]">

                    <!-- native input -->
                    <label :key="i" v-if="col.type === formTypes.input || col.type === formTypes.inputNumber">
                      <a-tooltip
                        :id="id"
                        placement="top"
                        :title="(tooltips[id] || {}).title"
                        :visible="(tooltips[id] || {}).visible || false"
                        :autoAdjustOverflow="true">

                        <input
                          :id="id"
                          v-bind="buildProps(row,col)"
                          :data-input-number="col.type === formTypes.inputNumber"
                          :placeholder="replaceProps(col, col.placeholder)"
                          @blur="(e)=>{handleBlurCommono(e.target,rowIndex,row,col)}"
                          @input="(e)=>{handleInputCommono(e.target,rowIndex,row,col)}"
                          @mouseover="()=>{handleMouseoverCommono(row,col)}"
                          @mouseout="()=>{handleMouseoutCommono(row,col)}"/>

                      </a-tooltip>

                    </label>
                    <!-- checkbox -->
                    <template v-else-if="col.type === formTypes.checkbox">
                      <a-checkbox
                        :key="i"
                        :id="id"
                        v-bind="buildProps(row,col)"
                        :checked="checkboxValues[id]"
                        @change="(e)=>handleChangeCheckboxCommon(e,row,col)"
                      />
                    </template>
                    <!-- select -->
                    <template v-else-if="col.type === formTypes.select">
                      <a-tooltip
                        :key="i"
                        :id="id"
                        placement="top"
                        :title="(tooltips[id] || {}).title"
                        :visible="(tooltips[id] || {}).visible || false"
                        :autoAdjustOverflow="true">

                      <span
                        @mouseover="()=>{handleMouseoverCommono(row,col)}"
                        @mouseout="()=>{handleMouseoutCommono(row,col)}">

                        <a-select
                          :id="id"
                          :key="i"
                          v-bind="buildProps(row,col)"
                          style="width: 100%;"
                          :value="selectValues[id]"
                          :options="col.options"
                          :getPopupContainer="getParentContainer"
                          :placeholder="replaceProps(col, col.placeholder)"
                          :filterOption="(i,o)=>handleSelectFilterOption(i,o,col)"
                          @change="(v)=>handleChangeSelectCommon(v,id,row,col)"
                          @search="(v)=>handleSearchSelect(v,id,row,col)"
                          @blur="(v)=>handleBlurSearch(v,id,row,col)"
                        >

                          <!--<template v-for="(opt,optKey) in col.options">-->
                          <!--<a-select-option :value="opt.value" :key="optKey">{{ opt.title }}</a-select-option>-->
                          <!--</template>-->
                        </a-select>
                      </span>
                      </a-tooltip>
                    </template>
                    <!-- date -->
                    <template v-else-if="col.type === formTypes.date || col.type === formTypes.datetime">
                      <a-tooltip
                        :key="i"
                        :id="id"
                        placement="top"
                        :title="(tooltips[id] || {}).title"
                        :visible="(tooltips[id] || {}).visible || false"
                        :autoAdjustOverflow="true">

                      <span
                        @mouseover="()=>{handleMouseoverCommono(row,col)}"
                        @mouseout="()=>{handleMouseoutCommono(row,col)}">

                        <j-date
                          :id="id"
                          :key="i"
                          v-bind="buildProps(row,col)"
                          style="width: 100%;"
                          :value="jdateValues[id]"
                          :getCalendarContainer="getParentContainer"
                          :placeholder="replaceProps(col, col.placeholder)"
                          :trigger-change="true"
                          :showTime="col.type === formTypes.datetime"
                          :dateFormat="col.type === formTypes.date? 'YYYY-MM-DD':'YYYY-MM-DD HH:mm:ss'"
                          @change="(v)=>handleChangeJDateCommon(v,id,row,col,col.type === formTypes.datetime)"/>

                      </span>
                      </a-tooltip>
                    </template>

                    <div v-else-if="col.type === formTypes.upload" :key="i">
                      <template v-if="uploadValues[id] != null" v-for="(file,fileKey) of [(uploadValues[id]||{})]">
                        <a-input
                          :key="fileKey"
                          :readOnly="true"
                          :value="file.name"
                        >

                          <template slot="addonBefore" style="width: 30px">
                            <a-tooltip v-if="file.status==='uploading'" :title="`アップロード中(${Math.floor(file.percent)}%)`">
                              <a-icon type="loading"/>
                            </a-tooltip>
                            <a-tooltip v-else-if="file.status==='done'" title="アップロード完了">
                              <a-icon type="check-circle" style="color:#00DB00;"/>
                            </a-tooltip>
                            <a-tooltip v-else title="アップロードに失敗しました">
                              <a-icon type="exclamation-circle" style="color:red;"/>
                            </a-tooltip>
                          </template>

                          <template slot="addonAfter" style="width: 30px">
                            <a-tooltip title="削除して再アップロード">
                              <a-icon
                                v-if="file.status!=='uploading'"
                                type="close-circle"
                                style="cursor: pointer;"
                                @click="()=>handleClickDelFile(id)"/>
                            </a-tooltip>
                          </template>

                        </a-input>
                      </template>

                      <div :hidden="uploadValues[id] != null">

                        <a-upload
                          name="file"
                          :data="{'isup':1}"
                          :multiple="false"
                          :action="col.action"
                          :headers="uploadGetHeaders(row,col)"
                          :showUploadList="false"
                          v-bind="buildProps(row,col)"
                          @change="(v)=>handleChangeUpload(v,id,row,col)"
                        >
                          <a-button icon="upload">{{ col.placeholder }}</a-button>
                        </a-upload>
                      </div>

                    </div>

                    <!-- update-begin-author:taoyan date:0827 for：popup -->
                    <template v-else-if="col.type === formTypes.popup">
                      <a-tooltip
                        :key="i"
                        :id="id"
                        placement="top"
                        :title="(tooltips[id] || {}).title"
                        :visible="(tooltips[id] || {}).visible || false"
                        :autoAdjustOverflow="true">
                        <span
                          @mouseover="()=>{handleMouseoverCommono(row,col)}"
                          @mouseout="()=>{handleMouseoutCommono(row,col)}">

                          <j-popup
                            :id="id"
                            :key="i"
                            v-bind="buildProps(row,col)"
                            :placeholder="replaceProps(col, col.placeholder)"
                            style="width: 100%;"
                            :value="getPopupValue(id)"
                            :field="col.key"
                            :org-fields="col.orgFieldse"
                            :dest-fields="col.destFields"
                            :code="col.popupCode"
                            @input="(value,others)=>popupCallback(value,others,id,row,col,rowIndex)"/>
                        </span>
                      </a-tooltip>
                    </template>
                    <!-- update-end-author:taoyan date:0827 for：popup -->

                    <!-- update-beign-author:taoyan date:0827 for：ファイル/画像ロジックが追加されました -->
                    <div v-else-if="col.type === formTypes.file" :key="i">
                      <template v-if="uploadValues[id] != null" v-for="(file,fileKey) of [(uploadValues[id]||{})]">
                        <a-input
                          :key="fileKey"
                          :readOnly="true"
                          :value="file.name"
                        >
                          <template slot="addonBefore" style="width: 30px">
                            <a-tooltip v-if="file.status==='uploading'" :title="`アップロード中(${Math.floor(file.percent)}%)`">
                              <a-icon type="loading"/>
                            </a-tooltip>
                            <a-tooltip v-else-if="file.status==='done'" title="アップロード完了">
                              <a-icon type="check-circle" style="color:#00DB00;"/>
                            </a-tooltip>
                            <a-tooltip v-else title="アップロードに失敗しました">
                              <a-icon type="exclamation-circle" style="color:red;"/>
                            </a-tooltip>
                          </template>

                          <template slot="addonAfter" style="width: 30px">
                            <a-tooltip title="削除して再アップロード">
                              <a-icon
                                v-if="file.status!=='uploading'"
                                type="close-circle"
                                style="cursor: pointer;"
                                @click="()=>handleClickDelFile(id)"/>
                            </a-tooltip>
                          </template>

                        </a-input>
                      </template>

                      <div :hidden="uploadValues[id] != null">

                        <a-upload
                          name="file"
                          :data="{'isup':1}"
                          :multiple="false"
                          :action="getUploadAction(col.action)"
                          :headers="uploadGetHeaders(row,col)"
                          :showUploadList="false"
                          v-bind="buildProps(row,col)"
                          @change="(v)=>handleChangeUpload(v,id,row,col)"
                        >
                          <a-button icon="upload">{{ col.placeholder }}</a-button>
                        </a-upload>
                      </div>

                    </div>

                    <div v-else-if="col.type === formTypes.image" :key="i">
                      <template v-if="uploadValues[id] != null" v-for="(file,fileKey) of [(uploadValues[id]||{})]">
                        <div :key="fileKey" style="position: relative;">
                          <img :src="getCellImageView(id)" style="height:32px;max-width:100px !important;" alt="写真なし"/>
                          <template slot="addonBefore" style="width: 30px">
                            <a-tooltip v-if="file.status==='uploading'" :title="`アップロード中(${Math.floor(file.percent)}%)`">
                              <a-icon type="loading"/>
                            </a-tooltip>
                            <a-tooltip v-else-if="file.status==='done'" title="アップロード完了">
                              <a-icon type="check-circle" style="color:#00DB00;"/>
                            </a-tooltip>
                            <a-tooltip v-else title="アップロードに失敗しました">
                              <a-icon type="exclamation-circle" style="color:red;"/>
                            </a-tooltip>
                          </template>

                          <template style="width: 30px">
                            <a-tooltip title="削除して再アップロード" style="margin-left:5px">
                              <a-icon
                                v-if="file.status!=='uploading'"
                                type="close-circle"
                                style="cursor: pointer;"
                                @click="()=>handleClickDelFile(id)"/>
                            </a-tooltip>
                          </template>

                        </div>
                      </template>

                      <div :hidden="uploadValues[id] != null">

                        <a-upload
                          name="file"
                          :data="{'isup':1}"
                          :multiple="false"
                          :action="getUploadAction(col.action)"
                          :headers="uploadGetHeaders(row,col)"
                          :showUploadList="false"
                          v-bind="buildProps(row,col)"
                          @change="(v)=>handleChangeUpload(v,id,row,col)"
                        >
                          <a-button icon="upload">写真をアップロードしてください</a-button>
                        </a-upload>
                      </div>

                    </div>
                    <!-- update-end-author:taoyan date:0827 for：画像ロジックが追加されました -->


                    <!-- radio-begin -->
                    <template v-else-if="col.type === formTypes.radio">
                      <a-tooltip
                        :key="i"
                        :id="id"
                        placement="top"
                        :title="(tooltips[id] || {}).title"
                        :visible="(tooltips[id] || {}).visible || false"
                        :autoAdjustOverflow="true">
                        <span
                          @mouseover="()=>{handleMouseoverCommono(row,col)}"
                          @mouseout="()=>{handleMouseoutCommono(row,col)}">
                          <a-radio-group
                            :id="id"
                            :key="i"
                            v-bind="buildProps(row,col)"
                            :value="radioValues[id]"
                            @change="(e)=>handleRadioChange(e.target.value,id,row,col)">
                            <a-radio v-for="(item, key) in col.options" :key="key" :value="item.value">{{ item.text }}</a-radio>
                          </a-radio-group>
                        </span>
                      </a-tooltip>
                    </template>
                    <!-- radio-end -->


                    <!-- select複数選択 -begin -->
                    <template v-else-if="col.type === formTypes.list_multi">
                      <a-tooltip
                        :key="i"
                        :id="id"
                        placement="top"
                        :title="(tooltips[id] || {}).title"
                        :visible="(tooltips[id] || {}).visible || false"
                        :autoAdjustOverflow="true">

                        <span
                          @mouseover="()=>{handleMouseoverCommono(row,col)}"
                          @mouseout="()=>{handleMouseoutCommono(row,col)}">

                          <a-select
                            :id="id"
                            :key="i"
                            mode="multiple"
                            :maxTagCount="1"
                            v-bind="buildProps(row,col)"
                            style="width: 100%;"
                            :value="multiSelectValues[id]"
                            :options="col.options"
                            :getPopupContainer="getParentContainer"
                            :placeholder="replaceProps(col, col.placeholder)"
                            @change="(v)=>handleMultiSelectChange(v,id,row,col)"
                            allowClear>
                          </a-select>
                        </span>
                      </a-tooltip>
                    </template>
                    <!-- select複数選択 -end -->

                    <!-- select検索 -begin -->
                    <template v-else-if="col.type === formTypes.sel_search">
                      <a-tooltip
                        :key="i"
                        :id="id"
                        placement="top"
                        :title="(tooltips[id] || {}).title"
                        :visible="(tooltips[id] || {}).visible || false"
                        :autoAdjustOverflow="true">

                        <span
                          @mouseover="()=>{handleMouseoverCommono(row,col)}"
                          @mouseout="()=>{handleMouseoutCommono(row,col)}">

                          <a-select
                            :id="id"
                            :key="i"
                            showSearch
                            optionFilterProp="children"
                            :filterOption="filterOption"
                            v-bind="buildProps(row,col)"
                            style="width: 100%;"
                            :value="searchSelectValues[id]"
                            :options="col.options"
                            :getPopupContainer="getParentContainer"
                            :placeholder="replaceProps(col, col.placeholder)"
                            @change="(v)=>handleSearchSelectChange(v,id,row,col)"
                            allowClear>
                          </a-select>
                        </span>
                      </a-tooltip>
                    </template>
                    <!-- select検索 -end -->


                    <div v-else-if="col.type === formTypes.slot" :key="i">
                      <slot
                        :name="(col.slot || col.slotName) || col.key"
                        :index="rowIndex"
                        :text="inputValues[rowIndex][col.key]"
                        :column="col"
                        :rowId="removeCaseId(row.id)"
                        :getValue="()=>_getValueForSlot(row.id)"
                        :caseId="caseId"
                        :allValues="_getAllValuesForSlot()"
                        :target="getVM()"
                      />
                    </div>

                    <!-- else (normal) -->
                    <span v-else :key="i" v-bind="buildProps(row,col)">{{ inputValues[rowIndex][col.key] }}</span>
                  </template>
                </div>
              </div>
              <!-- -- tr end -- -->

            </template>
          </draggable>

        </div>
      </div>
    </div>
  </a-spin>
</template>

<script>
  import Vue from 'vue'
  import Draggable from 'vuedraggable'
  import { ACCESS_TOKEN } from '@/store/mutation-types'
  import { FormTypes, VALIDATE_NO_PASSED } from '@/utils/JEditableTableUtil'
  import { cloneObject, randomString } from '@/utils/util'
  import JDate from '@/components/jeecg/JDate'
  import { initDictOptions } from '@/components/dict/JDictSelectUtil'


  // 行の高さ。インスタンスをロードする前に使用する必要があります
  let rowHeight = 61

  export default {
    name: 'JEditableTable',
    components: { JDate, Draggable },
    props: {
      // 列情報
      columns: {
        type: Array,
        required: true
      },
      // データソース
      dataSource: {
        type: Array,
        required: true,
        default: () => []
      },
      // 操作ボタンを表示するかどうか
      actionButton: {
        type: Boolean,
        default: false
      },
      // 行番号を表示するかどうか
      rowNumber: {
        type: Boolean,
        default: false
      },
      // 選ぶかどうか
      rowSelection: {
        type: Boolean,
        default: false
      },
      // ページがロードされているかどうか
      loading: {
        type: Boolean,
        default: false
      },
      // ページがロードされているかどうか
      maxHeight: {
        type: Number,
        default: 400
      },
      // 無効にする行
      disabledRows: {
        type: Object,
        default() {
          return {}
        }
      },
      // すべてのコンポーネントを無効にするかどうか
      disabled: {
        type: Boolean,
        default: false
      },
      // ドラッグ可能なソートかどうか
      dragSort: {
        type: Boolean,
        default: false
      },
      dragSortKey: {
        type: String,
        default: 'orderNum'
      },
    },
    data() {
      return {
        // caseId，複数のインスタンスがある場合の競合を防ぐために使用されます
        caseId: `_jet-${randomString(6)}-`,
        // 保存document element 対象
        el: {
          inputTable: null,
          tbody: null
        },
        // 各divのスタイルを保存します
        style: {
          // 'max-height': '400px'
          tbody: { left: '0px' },
          // 左側のtdスタイルを修正
          tdLeft: { 'min-width': '4%', 'max-width': '45px' },
          tdLeftDs: { 'min-width': '30px', 'max-width': '35px' },
        },
        // フォームタイプ
        formTypes: FormTypes,
        // 行データ
        rows: [],
        // 行の高さ，height + padding + border
        rowHeight,
        // スクロールバーの上部からの距離
        scrollTop: 0,
        // 選択値のバインド
        selectValues: {},
        // バインドチェックボックス値
        checkboxValues: {},
        // jdate値をバインド
        jdateValues: {},
        // ファイル情報
        uploadValues: {},
        //ポップアップ情報
        popupValues:{},

        radioValues:{},
        metaCheckboxValues:{},
        multiSelectValues:{},
        searchSelectValues:{},
        // 左側の選択ボックスで選択したIDをバインドします
        selectedRowIds: [],
        // 削除された行のIDを格納します
        deleteIds: [],
        // ツールチップ情報を保存および表示する
        tooltips: {},
        // 検証に失敗したinputIdを保存します
        notPassedIds: []
      }
    },
    created() {
      // 現在表示されているtr
      this.visibleTrEls = []
      this.disabledRowIds = (this.disabledRowIds || [])
    },
    // 計算された属性
    computed: {
      // expandHeight = rows.length * rowHeight
      getExpandHeight() {
        return this.rows.length * this.rowHeight
      },
      // パーツが選択されているかどうかを取得します
      getSelectIndeterminate() {
        return (this.selectedRowIds.length > 0 &&
          this.selectedRowIds.length < this.rows.length)
      },
      // すべてが選択されているかどうかを取得します
      getSelectAll() {
        return (this.selectedRowIds.length === this.rows.length) && this.rows.length > 0
      },
      tbodyStyle() {
        let style = Object.assign({}, this.style.tbody)
        // style['max-height'] = `${this.maxHeight}px`
        style['width'] = this.realTrWidth
        return style
      },
      showClearSelectButton() {
        let count = 0
        for (let key in this.disabledRows) {
          if (this.disabledRows.hasOwnProperty(key)) count++
        }
        return count > 0
      },
      accessToken() {
        return Vue.ls.get(ACCESS_TOKEN)
      },
      realTrWidth() {
        let calcWidth = 'calc('
        this.columns.forEach((column, i) => {
          let { type, width } = column
          // 非表示フィールドは計算に関与しません
          if (type !== FormTypes.hidden) {
            if (typeof width === 'number') {
              calcWidth += width + 'px'
            } else if (typeof width === 'string') {
              calcWidth += width
            } else {
              calcWidth += '120px'
            }

            if (i < this.columns.length - 1) {
              calcWidth += ' + '
            }
          }
        })
        calcWidth += ')'
        // console.log('calcWidth: ', calcWidth)
        return calcWidth
      }
    },
    // リスナー
    watch: {
      rows:{
        immediate:true,
        handler(val,old) {
          // val.forEach(item => {
          //   for (let inputValue of  this.inputValues) {
          //     if (inputValue.id === item.id) {
          //       item['dbFieldName'] = inputValue['dbFieldName']
          //       break
          //     }
          //   }
          // })
          // console.log('watch.rows:', cloneObject({ val, old }))
        }
      },
      dataSource: {
        immediate: true,
        handler: function (newValue) {
          this.initialize()

          let rows = []
          let checkboxValues = {}
          let selectValues = {}
          let jdateValues = {}
          let uploadValues = {}
          let popupValues={}
          let radioValues = {}
          let multiSelectValues = {}
          let searchSelectValues = {}

          // 行IDを無効にする
          let disabledRowIds = (this.disabledRowIds || [])
          newValue.forEach((data, newValueIndex) => {
            // ソースデータにIDがあるかどうかを判別
            if (data.id == null || data.id === '') {
              data.id = this.removeCaseId(this.generateId() + newValueIndex)
            }

            let value = { id: this.caseId + data.id }
            let row = { id: value.id }
            let disabled = false
            this.columns.forEach(column => {
              let inputId = column.key + value.id
              let sourceValue = (data[column.key] == null ? '' : data[column.key]).toString()
              if (column.type === FormTypes.checkbox) {

                // customValueが設定されているかどうかを判別
                if (column.customValue instanceof Array) {
                  let customValue = (column.customValue[0] || '').toString()
                  checkboxValues[inputId] = (sourceValue === customValue)
                } else {
                  checkboxValues[inputId] = sourceValue
                }

              } else if (column.type === FormTypes.select) {
                if (sourceValue) {
                  // 多肢選択かどうかを判断する
                  selectValues[inputId] = (column.props || {})['mode'] === 'multiple' ? sourceValue.split(',') : sourceValue
                } else {
                  selectValues[inputId] = undefined
                }

              } else if (column.type === FormTypes.date || column.type === FormTypes.datetime) {
                jdateValues[inputId] = sourceValue

              } else if (column.type === FormTypes.slot) {
                if (sourceValue !== 0 && !sourceValue) {
                  value[column.key] = column.defaultValue
                } else {
                  value[column.key] = sourceValue
                }

              } else if (column.type === FormTypes.popup) {
                popupValues[inputId] = sourceValue
              } else if (column.type === FormTypes.radio) {
                radioValues[inputId] = sourceValue
              } else if (column.type === FormTypes.sel_search) {
                searchSelectValues[inputId] = sourceValue
              } else if (column.type === FormTypes.list_multi) {
                if(sourceValue.length>0){
                  multiSelectValues[inputId] = sourceValue.split(",")
                }else{
                  multiSelectValues[inputId] = []
                }
              } else if (column.type === FormTypes.file || column.type === FormTypes.image) {
                if(sourceValue){
                  let fileName = sourceValue.substring(sourceValue.lastIndexOf("/")+1)
                  uploadValues[inputId] = {
                    name: fileName,
                    status: 'done',
                    path:sourceValue
                  }
                }
              } else {
                value[column.key] = sourceValue
              }

              // 解析disabledRows
              for (let columnKey in this.disabledRows) {
                // この属性が存在するかどうかを判別
                if (this.disabledRows.hasOwnProperty(columnKey) && data.hasOwnProperty(columnKey)) {
                  if (disabled !== true) {
                    let temp = this.disabledRows[columnKey]
                    // 無効化ルールは配列にすることができます
                    if (temp instanceof Array) {
                      disabled = temp.includes(data[columnKey])
                    } else {
                      disabled = (temp === data[columnKey])
                    }
                    if (disabled) {
                      disabledRowIds.push(row.id)
                    }
                  }
                }
              }
            })
            this.inputValues.push(value)
            rows.push(row)
          })
          this.disabledRowIds = disabledRowIds
          this.checkboxValues = checkboxValues
          this.selectValues = selectValues
          this.jdateValues = jdateValues
          this.rows = rows
          this.uploadValues = uploadValues
          this.popupValues = popupValues
          this.radioValues = radioValues
          this.multiSelectValues = multiSelectValues
          this.searchSelectValues = searchSelectValues

          // フォーム値を更新する
          this.$nextTick(() => {
            this.updateFormValues()
          })

        }
      },
      columns: {
        immediate: true,
        handler(columns) {
          columns.forEach(column => {
            if (column.type === FormTypes.select || column.type === FormTypes.list_multi || column.type === FormTypes.sel_search) {
              //古いバージョンとの互換性options
              if (column.options instanceof Array) {
                column.options = column.options.map(item => {
                  if (item) {
                    return {
                      ...item,
                      text: item.text || item.title,
                      title: item.text || item.title
                    }
                  }
                  return {}
                })
              }
              if (column.dictCode) {
                this._loadDictConcatToOptions(column)
              }
            }
          })
        }
      },
      // selectRowIdsが変更されたときに発生します
      selectedRowIds(newValue) {
        this.$emit('selectRowChange', cloneObject(newValue).map(i => this.removeCaseId(i)))
      }
    },
    mounted() {
      // ドキュメント要素オブジェクトを取得する
      let elements = {};
      ['inputTable', 'tbody'].forEach(id => {
        elements[id] = document.getElementById(this.caseId + id)
      })
      this.el = elements

      let vm = this
      /** スクロールバーイベントをリッスンする */
      this.el.inputTable.onscroll = function (event) {
        vm.syncScrollBar(event.target.scrollLeft)
      }
      this.el.tbody.onscroll = function (event) {
        // vm.recalcTrHiddenItem(event.target.scrollTop)
      }

      let { thead, scrollView } = this.$refs
      scrollView.onscroll = function (event) {

        // console.log(event.target.scrollTop, ' - ', event.target.scrollLeft)

        thead.scrollLeft = event.target.scrollLeft

        // vm.recalcTrHiddenItem(event.target.scrollTop)

        vm.recalcTrHiddenItem(event.target.scrollTop)

      }

    },
    methods: {

      /** 初期化リスト */
      initialize() {
        // inputValues：入力フォームの値を保存するために使用されます
        // 配列内の各アイテムはオブジェクト、オブジェクト内の各キーは入力のrowKey、値は入力の値、それを区別するためのidフィールドがあります。
        // 例：
        // [{
        //    id: "_jet-4sp0iu-15541771111770"
        //    dbDefaultVal: "aaa",
        //    dbFieldName: "bbb",
        //    dbFieldTxt: "ccc",
        //    dbLength: 32
        // }]
        this.inputValues = []
        this.visibleTrEls = []
        this.rows = []
        this.deleteIds = []
        this.selectValues = {}
        this.checkboxValues = {}
        this.jdateValues = {}
        this.selectedRowIds = []
        this.tooltips = {}
        this.notPassedIds = []
        this.uploadValues=[]
        this.popupValues=[]
        this.radioValues=[]
        this.multiSelectValues = []
        this.searchSelectValues = []
        this.scrollTop = 0
        this.$nextTick(() => {
          this.el.tbody.scrollTop = 0
        })
      },

      /** 同期されたスクロールバーのステータス */
      syncScrollBar(scrollLeft) {
        // this.style.tbody.left = `${scrollLeft}px`
        // this.el.tbody.scrollLeft = scrollLeft
      },
      /** スクロールバーの位置をリセットし、パラメーターを空白のままにして、最後に記録された位置までスクロールします */
      resetScrollTop(top) {
        let { scrollView } = this.$refs
        if (top != null && typeof top === 'number') {
          scrollView.scrollTop = top
        } else {
          scrollView.scrollTop = this.scrollTop
        }
      },
      /** 非表示または表示する必要があるtrを再計算します */
      recalcTrHiddenItem(top) {
        let diff = top - this.scrollTop
        if (diff < 0) {
          diff = this.scrollTop - top
        }
        // 行の高さの30％スクロールされた場合のみ更新する
        if (diff >= this.rowHeight * 0.3) {
          this.scrollTop = top
          // フォーム値を更新する
          this.$nextTick(() => {
            this.updateFormValues()
          })
        }
      },
      /** IDを生成 */
      generateId(rows) {
        if (!(rows instanceof Array)) {
          rows = this.rows || []
        }
        let timestamp = new Date().getTime()
        return `${this.caseId}${timestamp}${rows.length}`
      },
      /** push データの一部 */
      push(record, update = true, rows) {
        if (!(rows instanceof Array)) {
          rows = cloneObject(this.rows) || []
        }

        if (record.id == null) {
          record.id = this.generateId(rows)
          // let timestamp = new Date().getTime()
          // record.id = `${this.caseId}${timestamp}${rows.length}`
        }
        if (record.id.indexOf(this.caseId) === -1) {
          record.id = this.caseId + record.id
        }
        let row = { id: record.id }
        let value = { id: row.id }
        let checkboxValues = Object.assign({}, this.checkboxValues)
        let selectValues = Object.assign({}, this.selectValues)
        let jdateValues = Object.assign({}, this.jdateValues)
        this.columns.forEach(column => {
          let key = column.key
          let inputId = key + row.id
          // レコードにこの列の値はありますか
          let recordHasValue = record[key] != null
          if (column.type === FormTypes.input) {
            value[key] = recordHasValue ? record[key] : (column.defaultValue || (column.defaultValue === 0 ? 0 : ''))

          } else if (column.type === FormTypes.inputNumber) {
            // ソートフィールドであるかどうかを判断し、ソートフィールドであれば、最大値を割り当てます
            if (column.isOrder === true) {
              value[key] = this.getInputNumberMaxValue(column) + 1
            } else {
              value[key] = recordHasValue ? record[key] : (column.defaultValue || (column.defaultValue === 0 ? 0 : ''))
            }

          } else if (column.type === FormTypes.checkbox) {
            checkboxValues[inputId] = recordHasValue ? record[key] : column.defaultChecked

          } else if (column.type === FormTypes.select) {
            let selected = column.defaultValue
            if (selected !== 0 && !selected) {
              selected = undefined
            }
            // 複数の選択肢を判断する
            if (typeof selected === 'string' && (column.props || {})['mode'] === 'multiple') {
              selected = selected.split(',')
            }
            selectValues[inputId] = recordHasValue ? record[key] : selected

          } else if (column.type === FormTypes.date || column.type === FormTypes.datetime) {
            jdateValues[inputId] = recordHasValue ? record[key] : column.defaultValue

          } else if (column.type === FormTypes.slot) {
            value[key] = recordHasValue ? record[key] : (column.defaultValue || '')

          } else {
            value[key] = recordHasValue ? record[key] : ''
          }
        })
        rows.push(row)
        this.inputValues.push(value)
        this.checkboxValues = checkboxValues
        this.selectValues = selectValues
        this.jdateValues = jdateValues

        if (this.dragSort) {
          this.inputValues.forEach((item, index) => {
            item[this.dragSortKey] = (index + 1)
          })
        }

        if (update) {
          this.rows = rows
          this.$nextTick(() => {
            this.updateFormValues()
          })
        }
        return rows
      },
      /** 数値入力ボックスの列の最大値を取得します */
      getInputNumberMaxValue(column) {
        let maxNum = 0
        this.inputValues.forEach((item, index) => {
          let val = item[column.key], num
          try {
            num = parseInt(val)
          } catch {
            num = 0
          }
          // 最初のサイクルの結果を最大値として扱います
          if (index === 0) {
            maxNum = num
          } else {
            maxNum = (num > maxNum) ? num : maxNum
          }
        })
        return maxNum
      },
      /** 行を追加する */
      add(num = 1, forceScrollToBottom = false) {
        if (num < 1) return
        // let timestamp = new Date().getTime()
        let rows = this.rows
        let row
        for (let i = 0; i < num; i++) {
          // row = { id: `${this.caseId}${timestamp}${rows.length}` }
          row = { id: this.generateId(rows) }
          rows = this.push(row, false, rows)
        }
        this.rows = rows

        let rowValue = this.getValuesSync({
          validate: false,
          rowIds: [this.removeCaseId(row.id)]
        }).values[0]

        this.$nextTick(() => {
          this.updateFormValues()
        })
        // トリガー追加イベント
        this.$emit('added', {
          row: rowValue,
          target: this
        })
        // スクロールバーの位置を設定する
        let tbody = this.el.tbody
        let offsetHeight = tbody.offsetHeight
        let realScrollTop = tbody.scrollTop + offsetHeight
        if (forceScrollToBottom === false) {
          // スクロールバーが下部にある場合のみ自動スクロール
          if (!((tbody.scrollHeight - realScrollTop) <= 10)) {
            return
          }
        }
        this.$nextTick(() => {
          tbody.scrollTop = tbody.scrollHeight
        })
      },
      /** 選択した行を削除 */
      removeSelectedRows() {
        this.removeRows(this.selectedRowIds)
        this.selectedRowIds = []
      },
      /** 1つ以上の行を削除します */
      removeRows(id) {
        let ids = id
        if (!(id instanceof Array)) {
          if (typeof id === 'string') {
            ids = [id]
          } else {
            throw  `JEditableTable.removeRows() 関数は文字列または配列を取ることができますが、$ {typeof id}を提供します`
          }
        }

        let rows = cloneObject(this.rows)
        ids.forEach(removeId => {
          // 各IDに対応する実際のインデックスを見つけて削除します
          const findAndDelete = (arr) => {
            for (let i = 0; i < arr.length; i++) {
              if (arr[i].id === removeId || arr[i].id === this.caseId + removeId) {
                arr.splice(i, 1)
                return true
              }
            }
          }
          //行に対応するインデックスを見つけて削除する
          if (findAndDelete(rows)) {
            // 値に対応するインデックスを見つけて削除します
            findAndDelete(this.inputValues)
            // caseIdを削除
            let id = this.removeCaseId(removeId)
            this.deleteIds.push(id)
          }
        })
        this.rows = rows
        this.$emit('deleted', this.getDeleteIds())
        this.$nextTick(() => {
          // 更新formValues
          this.updateFormValues()
        })
        return true
      },

      /**フォームの値を取得する（同期バージョン） */
      getValuesSync(options = {}) {
        let { validate, rowIds } = options
        if (typeof validate !== 'boolean') validate = true
        if (!(rowIds instanceof Array)) rowIds = null
        // console.log('options:', { validate, rowIds })

        let error = 0
        let inputValues = cloneObject(this.inputValues)
        let tooltips = Object.assign({}, this.tooltips)
        let notPassedIds = cloneObject(this.notPassedIds)
        // マージされた値を保存するために使用されます
        let values = []
        // inputValuesを走査して各行の値を取得します
        for (let value of inputValues) {
          let rowIdsFlag = false
          // rowIdがある場合、これらの数行のデータのみが保存されます
          if (rowIds == null) {
            rowIdsFlag = true
          } else {
            for (let rowId of rowIds) {
              if (rowId === value.id || `${this.caseId}${rowId}` === value.id) {
                rowIdsFlag = true
                break
              }
            }
          }

          if (!rowIdsFlag) continue

          this.columns.forEach(column => {
            let inputId = column.key + value.id
            if (column.type === FormTypes.checkbox) {
              let checked = this.checkboxValues[inputId]
              if (column.customValue instanceof Array) {
                value[column.key] = checked ? column.customValue[0] : column.customValue[1]
              } else {
                value[column.key] = checked
              }

            } else if (column.type === FormTypes.select) {
              let selected = this.selectValues[inputId]
              if (selected instanceof Array) {
                value[column.key] = cloneObject(selected)
              } else {
                value[column.key] = selected
              }

            } else if (column.type === FormTypes.date || column.type === FormTypes.datetime) {
              value[column.key] = this.jdateValues[inputId]

            } else if (column.type === FormTypes.upload) {
              value[column.key] = cloneObject(this.uploadValues[inputId] || null)

            } else if (column.type === FormTypes.image || column.type === FormTypes.file) {
              let currUploadObj = cloneObject(this.uploadValues[inputId] || null)
              if(currUploadObj){
                value[column.key] = currUploadObj['path'] || null
              }

            } else if (column.type === FormTypes.popup) {
              if(!value[column.key]){
                value[column.key] = this.popupValues[inputId] || null
              }
            } else if (column.type === FormTypes.radio) {
              value[column.key] = this.radioValues[inputId]
            }else if (column.type === FormTypes.sel_search) {
              value[column.key] = this.searchSelectValues[inputId]
            }else if (column.type === FormTypes.list_multi) {
              if(!this.multiSelectValues[inputId] || this.multiSelectValues[inputId].length==0){
                value[column.key] = ''
              }else{
                value[column.key] = this.multiSelectValues[inputId].join(",")
              }
            }


            // フォーム検証を確認する
            if (validate === true) {
              let results = this.validateOneInput(value[column.key], value, column, notPassedIds, false, 'getValues')
              tooltips[inputId] = results[0]
              if (tooltips[inputId].passed === false) {
                error++
                // if (error++ === 0) {
                // let element = document.getElementById(inputId)
                // while (element.className !== 'tr') {
                //   element = element.parentElement
                // }
                // this.jumpToId(inputId, element)
                // }
              }
              tooltips[inputId].visible = false
              notPassedIds = results[1]
            }
          })
          // caseIdを削除
          value.id = this.removeCaseId(value.id)
          values.push(value)

        }

        if (validate === true) {
          this.tooltips = tooltips
          this.notPassedIds = notPassedIds
        }
        return { error, values }
      },

      /** 表形式で値を取得する */
      getValues(callback, validate = true, rowIds) {
        let result = this.getValuesSync({ validate, rowIds })
        if (typeof callback === 'function') {
          callback(result.error, result.values)
        }
      },
      /** getValuesのPromiseバージョン */
      getValuesPromise(validate = true, rowIds) {
        return new Promise((resolve, reject) => {
          let { error, values } = this.getValuesSync({ validate, rowIds })
          if (error === 0) {
            resolve(values)
          } else {
            reject(VALIDATE_NO_PASSED)
          }
        })
      },
      /** 削除されたアイテムのIDを取得します */
      getDeleteIds() {
        return cloneObject(this.deleteIds)
      },
      /** values、deleteIdsを含むすべてのデータを取得します */
      getAll(validate) {
        return new Promise((resolve, reject) => {
          let deleteIds = this.getDeleteIds()
          this.getValuesPromise(validate).then((values) => {
            resolve({ values, deleteIds })
          }).catch(error => {
            reject(error)
          })
        })
      },
      /** 同期は、values、deleteIdsを含むすべてのデータを取得します */
      getAllSync(validate, rowIds) {
        let result = this.getValuesSync({ validate, rowIds })
        result.deleteIds = this.getDeleteIds()
        return result
      },
      // スロット値を取得
      _getValueForSlot(rowId) {
        return this.getValuesSync({ rowIds: [rowId] }).values[0]
      },
      _getAllValuesForSlot() {
        return cloneObject({
          inputValues: this.inputValues,
          selectValues: this.selectValues,
          checkboxValues: this.checkboxValues,
          jdateValues: this.jdateValues,
          uploadValues: this.uploadValues,
          popupValues: this.popupValues,
          radioValues: this.radioValues,
          multiSelectValues: this.multiSelectValues,
          searchSelectValues: this.searchSelectValues,
        })
      },
      /** 行と列の値を設定する */
      setValues(values) {

        values.forEach(item => {
          let { rowKey, values: newValues } = item
          for (let newValueKey in newValues) {
            if (newValues.hasOwnProperty(newValueKey)) {
              let newValue = newValues[newValueKey]
              let edited = false // 変更されました
              this.inputValues.forEach(value => {
                // inputValuesにフィールドが見つかりました
                if (`${this.caseId}${rowKey}` === value.id) {
                  if (value.hasOwnProperty(newValueKey)) {
                    edited = true
                    value[newValueKey] = newValue
                  }
                }
              })
              let modelKey = `${newValueKey}${this.caseId}${rowKey}`
              // selectValuesで値を見つける
              if (!edited && this.selectValues.hasOwnProperty(modelKey)) {
                if (newValue !== 0 && !newValue) {
                  this.selectValues[modelKey] = undefined
                } else {
                  this.selectValues[modelKey] = newValue
                }
                edited = true
              }
              // checkboxValuesで値を見つける
              if (!edited && this.checkboxValues.hasOwnProperty(modelKey)) {
                this.checkboxValues[modelKey] = newValue
                edited = true
              }
              // jdateValuesで値を見つける
              if (!edited && this.jdateValues.hasOwnProperty(modelKey)) {
                this.jdateValues[modelKey] = newValue
                edited = true
              }
            }
          }
        })
        // 強制更新formValues
        this.forceUpdateFormValues()
      },

      /** 指定した位置にジャンプします */
      // jumpToId(id, element) {
      //   if (element == null) {
      //     element = document.getElementById(id)
      //   }
      //   if (element != null) {
      //     console.log(this.el.tbody.scrollTop, element.offsetTop)
      //     this.el.tbody.scrollTop = element.offsetTop
      //     console.log(this.el.tbody.scrollTop, element.offsetTop)
      //   }
      // },

      /** 単一のフォームを検証する */
      validateOneInput(value, row, column, notPassedIds, update = false, validType = 'input') {
        let tooltips = Object.assign({}, this.tooltips)
        // let notPassedIds = cloneObject(this.notPassedIds)
        let inputId = column.key + row.id
        tooltips[inputId] = tooltips[inputId] ? tooltips[inputId] : {}

        let [passed, message] = this.validateValue(column.validateRules, value)

        const nextThen = res => {
          let [passed, message] = res
          if (passed == null) {
            // debugger
          }
          if (passed == null && tooltips[inputId].visible != null) {
            return
          }
          passed = passed == null ? true : passed
          tooltips[inputId].visible = !passed
          tooltips[inputId].passed = passed
          let index = notPassedIds.indexOf(inputId)
          let borderColor = null, boxShadow = null
          if (!passed) {
            tooltips[inputId].title = this.replaceProps(column, message)
            borderColor = 'red'
            boxShadow = `0 0 0 2px rgba(255, 0, 0, 0.2)`
            if (index === -1) notPassedIds.push(inputId)
          } else {
            if (index !== -1) notPassedIds.splice(index, 1)
          }

          let element = document.getElementById(inputId)
          if (element != null) {
            // 選択.ant-select-selectionの境界線の色を設定
            if (column.type === FormTypes.select) {
              element = element.getElementsByClassName('ant-select-selection')[0]
            }
            // jdateは入力時に境界線の色を設定します
            if (column.type === FormTypes.date || column.type === FormTypes.datetime) {
              element = element.getElementsByTagName('input')[0]
            }
            element.style.borderColor = borderColor
            element.style.boxShadow = boxShadow
          }
          // データを更新するかどうか
          if (update) {
            this.tooltips = tooltips
            this.notPassedIds = notPassedIds
          }

        }

        if (typeof passed === 'function') {
          let executed = false
          passed(validType, value, row, column, (flag, msg) => {
            if (executed) return
            executed = true
            if (typeof msg === 'string') {
              message = msg
            }
            if (flag == null) {
              nextThen([null, message])
            }else  if (typeof flag === 'boolean' && flag) {
              nextThen([true, message])
            } else {
              nextThen([false, message])
            }

          }, this)
        } else {
          nextThen([passed, message])
        }

        return [tooltips[inputId], notPassedIds]
      },
      /** ルールを介して値が正しいことを確認します */
      validateValue(rules, value) {
        let passed = true, message = ''
        // 検証ルールがあるかどうか、または検証ルールの形式が間違っているかどうかを判断し、条件が満たされない場合、デフォルトで合格します。
        if (rules instanceof Array) {
          for (let rule of rules) {
            // 現在の値が空かどうか
            let isNull = (value == null || value === '')
            // 検証ルール：空ではない
            if (rule.required === true && isNull) {
              passed = false
            } else // else-ifを使用して、ルールに2つのルールが表示されないようにします
            //検証ルール：正規表現
            if (!!rule.pattern && !isNull) {

              //オンラインルールに対応
              let foo = [
                { title: 'ユニークなチェック', value: 'only', pattern: null },
                { title: '6から16桁', value: 'n6-16', pattern: /\d{6,18}/ },
                { title: '6〜16の任意の文字', value: '*6-16', pattern: /^.{6,16}$/ },
                { title: 'URL', value: 'url', pattern: /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/ },
                { title: 'Mail', value: 'e', pattern: /^([\w]+\.*)([\w]+)@[\w]+\.\w{3}(\.\w{2}|)$/ },
                { title: '電話番号', value: 'm', pattern: /^1[3456789]\d{9}$/ },
                { title: '郵便番号', value: 'p', pattern: /^[1-9]\d{5}$/ },
                { title: 'アルファベット', value: 's', pattern: /^[A-Z|a-z]+$/ },
                { title: '数字', value: 'n', pattern: /^-?\d+\.?\d*$/ },
                { title: '整数', value: 'z', pattern: /^[1-9]\d*$/ },
                { title: '空ではない', value: '*', pattern: /^.+$/ },
                { title: '6〜18ビットの文字列', value: 's6-18', pattern: /^.{6,18}$/ },
                { title: '金額', value: 'money', pattern: /^(([1-9][0-9]*)|([0]\.\d{0,2}|[1-9][0-9]*\.\d{0,2}))$/ },
              ]
              let flag = false
              for (let item of foo) {
                if (rule.pattern === item.value && item.pattern) {
                  passed = new RegExp(item.pattern).test(value)
                  flag = true
                  break
                }
              }
              if (!flag) passed = new RegExp(rule.pattern).test(value)
            } else if (typeof rule.handler === 'function') {
              return [rule.handler, rule.message]
            }
            // 検証が失敗した場合、ループは壊れています。 検証に合格したら、次のルールに進みます
            if (!passed) {
              message = rule.message
              break
            }
          }
        }
        return [passed, message]
      },

      /** フォーム値を動的に更新する */
      updateFormValues() {
        let trs = this.el.tbody.getElementsByClassName('tr')
        let trEls = []
        for (let tr of trs) {
          trEls.push(tr)
        }
        // 新しいtrを取得
        let newTrEls = trEls
        if (this.visibleTrEls.length > 0) {
          newTrEls = []
          for (let tr of trEls) {
            let isNewest = true
            for (let vtr of this.visibleTrEls) {
              if (vtr.id === tr.id) {
                isNewest = false
                break
              }
            }
            if (isNewest) {
              newTrEls.push(tr)
            }
          }
        }
        this.visibleTrEls = trEls
        // 新しいtrへの割り当て
        newTrEls.forEach(tr => {
          let { idx } = tr.dataset
          let value = this.inputValues[idx]
          for (let key in value) {
            if (value.hasOwnProperty(key)) {
              let elid = `${key}${value.id}`
              let el = document.getElementById(elid)
              if (el) {
                el.value = value[key]
              }
            }
          }
        })
      },
      /** FormValuesの強制更新 */
      forceUpdateFormValues() {
        this.visibleTrEls = []
        this.updateFormValues()
      },

      /** すべて選択またはすべて選択解除 */
      handleChangeCheckedAll() {
        let selectedRowIds = []
        if (!this.getSelectAll) {
          this.rows.forEach(row => {
            if ((this.disabledRowIds || []).indexOf(row.id) === -1) {
              selectedRowIds.push(row.id)
            }
          })
        }
        this.selectedRowIds = selectedRowIds
      },
      /** 左列選択ボックス変更イベント */
      handleChangeLeftCheckbox(event) {
        let { id } = event.target

        if ((this.disabledRowIds || []).indexOf(id) !== -1) {
          return
        }

        let index = this.selectedRowIds.indexOf(id)
        if (index !== -1) {
          this.selectedRowIds.splice(index, 1)
        } else {
          this.selectedRowIds.push(id)
        }

      },
      handleClickAdd() {
        this.add()
      },
      handleConfirmDelete() {
        this.removeSelectedRows()
      },
      handleClickClearSelection() {
        this.clearSelection()
      },
      clearSelection() {
        this.selectedRowIds = []
      },
      /** ドロップダウンボックスの内容を検索するために使用されます */
      handleSelectFilterOption(input, option, column) {
        if (column.allowSearch === true) {
          return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        return true
      },
      /** オプションを動的に追加するための検索イベントを選択します*/
      handleSearchSelect(value, id, row, col) {
        if (col.allowSearch !== true && col.allowInput === true) {
          // 対応するアイテムが見つかったかどうか、追加します
          let flag = false
          for (let option of col.options) {
            if (option.value.toLocaleString() === value.toLocaleString()) {
              flag = true
              break
            }
          }
          // !!value ：null値を追加しないでください
          if (!flag && !!value) {
            // searchAdd 検索によって追加されたかどうか
            col.options.push({ title: value, value: value, searchAdd: true })
          }

        }
      },
      // blur フォーカスを失う
      handleBlurSearch(value, id, row, col) {
        if (col.allowInput === true) {
          // 検索によって作成された不要なアイテムを削除する（ユーザー入力）
          if (typeof value === 'string') {
            let indexs = []
            col.options.forEach((option, index) => {
              if (option.value.toLocaleString() === value.toLocaleString()) {
                delete option.searchAdd
              } else if (option.searchAdd === true) {
                indexs.push(index)
              }
            })
            // 配列からアイテムを削除する
            for (let index of indexs.reverse()) {
              col.options.splice(index, 1)
            }
          }

        }
      },

      /** ドラッグ後、inputValueの値を交換します */
      handleDragMoveEnd(event) {
        let { oldIndex, newIndex, item: { dataset: { idx: dataIdx } } } = event

        // 非表示行の動的表示によるインデックス表示のエラーのため、実際のインデックスを計算する必要があります
        let diff = Number.parseInt(dataIdx) - oldIndex
        oldIndex += diff
        newIndex += diff

        this.rowResort(oldIndex, newIndex)

        // トリガーされたイベントをトリガー
        this.$emit('dragged', {
          oldIndex,
          newIndex,
          target: this
        })
      },

      /** 行の並べ替え */
      rowResort(oldIndex, newIndex) {
        const sort = (array) => {
          // 古いデータを保存し、古いアイテムを削除する
          let temp = array[oldIndex]
          array.splice(oldIndex, 1)
          // 古いデータを新しいプロジェクトに追加する
          array.splice(newIndex, 0, temp)
        }

        sort(this.rows)
        sort(this.inputValues)

        // ソートフィールドをリセット
        this.inputValues.forEach((val, idx) => val[this.dragSortKey] = (idx + 1))

        this.forceUpdateFormValues()
      },

      /* --- common function begin --- */

      /** マウスオーバー */
      handleMouseoverCommono(row, column) {
        let inputId = column.key + row.id
        if (this.notPassedIds.indexOf(inputId) !== -1) {
          this.showOrHideTooltip(inputId, true, true)
        }
      },
      /** マウスアウト */
      handleMouseoutCommono(row, column) {
        let inputId = column.key + row.id
        this.showOrHideTooltip(inputId, false)
      },
      /** inputイベント */
      handleInputCommono(target, index, row, column) {
        let { value, dataset, selectionStart } = target
        let type = FormTypes.input
        let change = true
        if (`${dataset.inputNumber}` === 'true') {
          type = FormTypes.inputNumber
          let replace = value.replace(/[^0-9]/g, '')
          if (value !== replace) {
            change = false
            value = replace
            target.value = replace
            if (typeof selectionStart === 'number') {
              target.selectionStart = selectionStart - 1
              target.selectionEnd = selectionStart - 1
            }
          }
        }
        // 入力した値を保存する
        this.inputValues[index][column.key] = value
        // 単一フォームの検証を行う
        this.validateOneInput(value, row, column, this.notPassedIds, true, 'input')

        // トリガーvalueChange イベント
        if (change) {
          this.elemValueChange(type, row, column, value)
        }
      },
      handleBlurCommono(target, index, row, column) {
        let { value } = target
        // 単一フォームの検証を行う
        this.validateOneInput(value, row, column, this.notPassedIds, true, 'blur')
      },
      handleChangeCheckboxCommon(event, row, column) {
        let { id, checked } = event.target
        this.checkboxValues = this.bindValuesChange(checked, id, 'checkboxValues')

        // トリガーvalueChange イベント
        this.elemValueChange(FormTypes.checkbox, row, column, checked)
      },
      handleChangeSelectCommon(value, id, row, column) {
        this.selectValues = this.bindValuesChange(value, id, 'selectValues')
        // 単一フォームの検証を行う
        this.validateOneInput(value, row, column, this.notPassedIds, true, 'change')

        // トリガーvalueChange イベント
        this.elemValueChange(FormTypes.select, row, column, value)
      },
      handleChangeJDateCommon(value, id, row, column, showTime) {
        this.jdateValues = this.bindValuesChange(value, id, 'jdateValues')
        this.validateOneInput(value, row, column, this.notPassedIds, true, 'change')

        // トリガーvalueChange イベント
        if (showTime) {
          this.elemValueChange(FormTypes.datetime, row, column, value)
        } else {
          this.elemValueChange(FormTypes.date, row, column, value)
        }
      },
      handleChangeUpload(info, id, row, column) {
        let { file } = info
        let value = {
          name: file.name,
          type: file.type,
          size: file.size,
          status: file.status,
          percent: file.percent
        }
        if (column.responseName && file.response) {
          value['responseName'] = file.response[column.responseName]
        }
        if(file.status =='done'){
          value['path'] = file.response[column.responseName]
        }
        this.uploadValues = this.bindValuesChange(value, id, 'uploadValues')
      },
      /** データバインディングを使用するコンポーネントの値を記録する */
      bindValuesChange(value, id, key) {
        let values = Object.assign({}, this[key])
        values[id] = value
        return values
      },

      /** ツールチップの表示または非表示 */
      showOrHideTooltip(inputId, show, force = false) {
        if (!this.tooltips[inputId] && !force) {
          return
        }

        let tooltip = this.tooltips[inputId] || {}
        if (tooltip.visible !== show) {
          tooltip.visible = show
          this.$set(this.tooltips, inputId, tooltip)
        }
      },

      /** value トリガーvalueChange イベント */
      elemValueChange(type, rowSource, columnSource, value) {
        let column = Object.assign({}, columnSource)
        // caseIdを削除
        let row = Object.assign({}, rowSource)
        row.id = this.removeCaseId(row.id)
        // データの行全体を取得する
        let { values } = this.getValuesSync({ validate: false, rowIds: [row.id] })
        if (values.length > 0) {
          Object.assign(row, values[0])
        }
        this.$emit('valueChange', { type, row, column, value, target: this })
      },

      /** caseIdを削除 */
      removeCaseId(id) {
        let remove = id.split(this.caseId)[1]
        return remove ? remove : id
      },

      handleClickDelFile(id) {
        this.uploadValues[id] = null
      },

      /** データディクショナリを読み込み、オプションにマージする */
      _loadDictConcatToOptions(column) {
        initDictOptions(column.dictCode).then((res) => {
          if (res.success) {
            let newOptions = (column.options || [])// .concat(res.result)
            res.result.forEach(item => {
              for (let option of newOptions) if (option.value === item.value) return
              newOptions.push(item)
            })
            column.options = newOptions
          } else {
            console.group(`JEditableTable クエリ辞書（$（column.dictCode））例外`)
            console.log(res.message)
            console.groupEnd()
          }
        })
      },

      /* --- common function end --- */

      /* --- 以下は、主にページ内のデータを動的に構築するために使用されるヘルパーメソッドです --- */

      /** ヘルパーメソッド：ログの印刷*/
      log: console.log,

      getVM() {
        return this
      },

      /** ヘルパーメソッド：a-selectおよびj-dataの親コンテナーを指定する */
      getParentContainer(node) {
        let element = (() => {
          // nodeType 8	: Comment	:ノート
          if (this.$el && this.$el.nodeType !== 8) {
            return this.$el
          }
          let doc = document.getElementById(this.caseId + 'inputTable')
          if (doc != null) {
            return doc
          }
          return node.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
        })()

        // 親要素にオーバーフローがあるかどうかを再帰的に判断します。
        const ifParent = (child) => {
          let currentOverflow = null
          if (child['currentStyle']) {
            currentOverflow = child['currentStyle']['overflow']
          } else if (window.getComputedStyle) {
            currentOverflow = window.getComputedStyle(child)['overflow']
          }
          if (currentOverflow != null) {
            if (currentOverflow === 'hidden') {
              // 非表示のラベルを見つけ、親がまだ非表示になっているかどうかを判断し、非表示または本文がまったく表示されなくなるまで再帰を停止します
              let temp = ifParent(child.parentNode)
              return temp != null ? temp : child.parentNode
            } else
            //現在のラベルには非表示がありません。親が存在し、親がボディでない場合、親を再帰的に判断し続けます
            if (child.parentNode && child.parentNode.tagName.toLocaleLowerCase() !== 'body') {
              return ifParent(child.parentNode)
            } else {
              // ボディに非表示のタグがなくなるまで
              return null
            }
          } else {
            return child
          }
        }

        let temp = ifParent(element)
        return (temp != null) ? temp : element
      },

      /** ヘルパーメソッド：$ {...}変数を置換 */
      replaceProps(col, value) {
        if (value && typeof value === 'string') {
          value = value.replace(/\${title}/g, col.title)
          value = value.replace(/\${key}/g, col.key)
          value = value.replace(/\${defaultValue}/g, col.defaultValue)
        }
        return value
      },

      /** ヘルパーの表示：trスタイルの構築 */
      buildTrStyle(index) {
        return {
          'top': `${rowHeight * index}px`
        }
      },
      /** ヘルパーの表示：tdスタイルの構築 */
      buildTdStyle(col) {
        const isEmptyWidth = (column) => (column.type === FormTypes.hidden || column.width === '0px' || column.width === '0' || column.width === 0)

        let style = {}
        // 計算された幅
        if (col.width) {
          style['width'] = col.width
        } else if (this.columns) {
          style['width'] = `${(100 - 4 * 2) / (this.columns.filter(column => !isEmptyWidth(column))).length}%`
        } else {
          style['width'] = '120px'
        }
        // checkbox センターディスプレイ
        let isCheckbox = col.type === FormTypes.checkbox
        if (isCheckbox) {
          style['align-items'] = 'center'
          style['text-align'] = 'center'
          style['padding-left'] = '0'
          style['padding-right'] = '0'
        }
        if (isEmptyWidth(col)) {
          style['padding-left'] = '0'
          style['padding-right'] = '0'
        }
        return style
      },
      /** ヘルパーの表示：小道具の作成 */
      buildProps(row, col) {
        let props = {}
        // 解析props
        if (typeof col.props === 'object') {
          for (let prop in col.props) {
            if (col.props.hasOwnProperty(prop)) {
              props[prop] = this.replaceProps(col, col.props[prop])
            }
          }
        }
        // selectが入力を許可するかどうかを決定します
        if (col.type === FormTypes.select && (col.allowInput === true || col.allowSearch === true)) {
          props['showSearch'] = true
        }

        // 無効な列かどうかを判別
        props['disabled'] = (typeof col['disabled'] === 'boolean' ? col['disabled'] : props['disabled'])

        // 回線が無効になっているかどうかを判別
        if (props['disabled'] !== true) {
          props['disabled'] = ((this.disabledRowIds || []).indexOf(row.id) !== -1)
        }

        // すべてのコンポーネントを無効にするかどうかを決定します
        if (this.disabled === true) {
          props['disabled'] = true
        }

        return props
      },
      /** upload ヘルパーメソッド：Get headers */
      uploadGetHeaders(row, column) {
        let headers = {}
        if (column.token === true) {
          headers['X-Access-Token'] = this.accessToken
        }
        return headers
      },
      /** アップロードリクエストアドレス */
      getUploadAction(value){
        if(!value){
          return window._CONFIG['domianURL']+"/sys/common/upload"
        }else{
          return value
        }
      },
      /** プレビュー画像アドレス */
      getCellImageView(id){
        let currUploadObj = this.uploadValues[id] || null
        if(currUploadObj && currUploadObj['path']){
          return window._CONFIG['domianURL']+"/sys/common/view/"+currUploadObj['path']
        }else{
          return ''
        }
      },
      /** popupコールバック */
      popupCallback(value,others,id,row,column,index){
        // 入力した値を保存する
        this.popupValues[id]=value
        if(others){
          Object.keys(others).map((key)=>{
            this.inputValues[index][key] = others[key]
          })
        }
        // 単一フォームの検証を行う
        this.validateOneInput(value, row, column, this.notPassedIds, true, 'change')
        // トリガーvalueChangeイベント
        this.elemValueChange("input", row, column, value)
        // フォーム値を更新する
        this.$nextTick(() => {
          this.forceUpdateFormValues()
        })
      },
      /** popup入力ボックスバックショー */
      getPopupValue(id){
        return this.popupValues[id]
      },
      handleRadioChange(value, id, row, column) {
        this.radioValues = this.bindValuesChange(value, id, 'radioValues')
        // 単一フォームの検証を行う
        this.validateOneInput(value, row, column, this.notPassedIds, true, 'change')
        // トリガーvalueChangeイベント
        this.elemValueChange(FormTypes.radio, row, column, value)
      },
      handleMultiSelectChange(value, id, row, column) {
        this.multiSelectValues = this.bindValuesChange(value, id, 'multiSelectValues')
        // 単一フォームの検証を行う
        this.validateOneInput(value, row, column, this.notPassedIds, true, 'change')
        // トリガーvalueChangeイベント
        this.elemValueChange(FormTypes.list_multi, row, column, value)
      },
      handleSearchSelectChange(value, id, row, column) {
        this.searchSelectValues = this.bindValuesChange(value, id, 'searchSelectValues')
        this.validateOneInput(value, row, column, this.notPassedIds, true, 'change')
        this.elemValueChange(FormTypes.sel_search, row, column, value)
      },
      filterOption(input, option) {
        return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      },


    }
  }
</script>

<style lang="less" scoped>

  .action-button {
    margin-bottom: 8px;

    .gap {
      padding-left: 8px;
    }

  }

  /* 境界線パラメーターの設定 */
  @borderColor: #e8e8e8;
  @border: 1px solid @borderColor;
  /* tr & td 間隔 */
  @spacing: 8px;

  .input-table {
    max-width: 100%;
    overflow-x: hidden;
    overflow-y: hidden;
    position: relative;
    border: @border;

    .thead, .tbody {

      .tr, .td {
        display: flex;
      }

      .td {

        /*border-right: 1px solid red;*/
        /*color: white;*/
        /*background-color: black;*/
        /*margin-right: @spacing !important;*/

        padding-left: @spacing;
        flex-direction: column;

        &.td-cb, &.td-num {
          min-width: 4%;
          max-width: 45px;
          margin-right: 0;
          padding-left: 0;
          padding-right: 0;
          justify-content: center;
          align-items: center;
        }

        &.td-ds {
          margin-right: 0;
          padding-left: 0;
          padding-right: 0;
          justify-content: center;
          align-items: center;

          .td-ds-icons {
            position: relative;
            cursor: move;
            width: 100%;
            /*padding: 25% 0;*/
            height: 100%;

            .anticon-align-left,
            .anticon-align-right {
              position: absolute;
              top: 30%;
            }

            .anticon-align-left {
              left: 25%;
            }

            .anticon-align-right {
              right: 25%;
            }
          }


        }

      }

    }

    .thead {
      overflow-y: scroll;
      overflow-x: hidden;
      border-bottom: @border;

      /**スライダーを非表示   */

      &::-webkit-scrollbar-thumb {
        box-shadow: none !important;
        background-color: transparent !important;
      }

      .tr {
        min-width: 100%;
        overflow-y: scroll;
      }

      .td {
        /*flex: 1;*/
        padding: 8px @spacing;
        justify-content: center;
      }

    }

    .tbody {
      position: relative;
      top: 0;
      left: 0;
      overflow-x: hidden;
      overflow-y: hidden;
      min-height: 61px;
      /*max-height: 400px;*/
      min-width: 100%;

      .tr-nodata {
        color: #999;
        line-height: 61px;
        text-align: center;
      }

      .tr {
        /*line-height: 50px;*/

        border-bottom: @border;
        transition: background-color 300ms;
        width: 100%;
        position: absolute;
        left: 0;
        z-index: 10;

        &.tr-checked {
          background-color: #fafafa;
        }

        &:hover {
          background-color: #E6F7FF;
        }

      }

      .tr-expand {
        position: relative;
        z-index: 9;
        background-color: white;
      }

      .td {
        /*flex: 1;*/
        padding: 14px 0 14px @spacing;
        justify-content: center;

        &:last-child {
          padding-right: @spacing;
        }

        input {
          font-variant: tabular-nums;
          box-sizing: border-box;
          margin: 0;
          list-style: none;
          position: relative;
          display: inline-block;
          padding: 4px 11px;
          width: 100%;
          height: 32px;
          font-size: 14px;
          line-height: 1.5;
          color: rgba(0, 0, 0, 0.65);
          background-color: #fff;
          border: 1px solid #d9d9d9;
          border-radius: 4px;
          transition: all 0.3s;
          outline: none;

          &:hover {
            border-color: #4D90FE
          }

          &:focus {
            border-color: #40a9ff;
            box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
            border-right-width: 1px !important;
          }

          &:disabled {
            color: rgba(0, 0, 0, 0.25);
            background: #f5f5f5;
            cursor: not-allowed;
          }

          /* プレースホルダーの色を設定します */

          &::-webkit-input-placeholder { /* WebKit browsers */
            color: #ccc;
          }

          &:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
            color: #ccc;
          }

          &::-moz-placeholder { /* Mozilla Firefox 19+ */
            color: #ccc;
          }

          &:-ms-input-placeholder { /* Internet Explorer 10+ */
            color: #ccc;
          }

        }

      }

    }

    .scroll-view {
      overflow: auto;
      overflow-y: scroll;
    }

    .thead, .thead .tr, .scroll-view {
      @scrollBarSize: 6px;
      /* スクロールバーと背景の高さと幅を定義する*/

      &::-webkit-scrollbar {
        width: @scrollBarSize;
        height: @scrollBarSize;
        background-color: transparent;
      }

      /* スクロールバートラックを定義する */

      &::-webkit-scrollbar-track {
        background-color: #f0f0f0;
      }

      /* スライダーを定義 */

      &::-webkit-scrollbar-thumb {
        background-color: #eee;
        box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);

        &:hover {
          background-color: #bbb;
        }

        &:active {
          background-color: #888;
        }
      }

    }

    .thead .tr {

      &::-webkit-scrollbar-track {
        background-color: transparent;
      }

      /* IEモードで非表示 */
      -ms-overflow-style: none;
      -ms-scroll-chaining: chained;
      -ms-content-zooming: zoom;
      -ms-scroll-rails: none;
      -ms-content-zoom-limit-min: 100%;
      -ms-content-zoom-limit-max: 500%;
      -ms-scroll-snap-type: proximity;
      -ms-scroll-snap-points-x: snapList(100%, 200%, 300%, 400%, 500%);
    }

  }

</style>