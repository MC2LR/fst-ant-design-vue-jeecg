/**
 * LunarFullCalendar 公共 js
 *
 * @version 1.0.0
 * @author sunjianlei
 *
 * */

import { getRefPromise } from '@/utils/JEditableTableUtil'

/* カレンダーのビューの種類 */
const calendarViewType = {
  month: 'month', // 月間ビュー
  basicWeek: 'basicWeek',  // ベースウィークビュー
  basicDay: 'basicDay',// ベーステンビュー
  agendaWeek: 'agendaWeek', // アジェンダ周辺ビュー
  agendaDay: 'agendaDay', // アジェンダ・天図
}

/* デフォルトのビューを定義する */
const defaultView = calendarViewType.month

/*カレンダーのデフォルト設定を定義する */
const defaultSettings = {
  locale: 'zh-cn',
  // ボタン文字
  buttonText: {
    today: '今日',
    month: '月',
    week: '周',
    day: '日'
  },
  // 頭部配列
  header: {
    left: 'prev,next, today',
    center: 'title',
    right: 'hide, custom, month,agendaWeek,agendaDay'
  },
  //今日の日一覧図をクリックします
  eventLimitClick: 'day',
  //超えた事件を隠す
  eventLimit: true,
  // 毎週開始日を日曜日とする
  firstDay: 0,
  // デフォルトの表示ビュー
  defaultView,
  timeFormat: 'H:mm',
  axisFormat: 'H:mm',
  // アジェンダビューでall-dayが表示されますか
  allDaySlot: true,
  // アジェンダビューでall-dayの表示テキスト
  allDayText: '全天',
  // タイムゾーンは地元の
  timezone: 'local',
  // 周ビューと日ビューの左側の時間表示
  slotLabelFormat: 'HH:mm',
  // 翌日閾値を設定
  nextDayThreshold: '00:00:00',
}

/** いくつかの拡張方法が提供されている */
const CalendarMixins = {
  data() {
    return {
      calenderCurrentViewType: defaultView
    }
  },
  methods: {

    getCalendarConfigEventHandler() {
      return {
        // view changedイベントを処理する
        viewRender: (view, element) => {
          let { type } = view

          let lastViewType = this.calenderCurrentViewType
          this.calenderCurrentViewType = type

          if (typeof this.handleViewRender === 'function') {
            this.handleViewRender(type, view, element)
          }

          if (lastViewType !== this.calenderCurrentViewType && typeof this.handleViewChanged === 'function') {
            this.handleViewChanged(type, view, element)
          }

        },
      }
    },

    /** LunarFullCalendarインスタンスを取得し,ref = baseCalendarとする*/
    getCalendar(fn) {
      return getRefPromise(this, 'baseCalendar').then(fn)
    },

    calendarEmit(name, data) {
      this.getCalendar(ref => ref.$emit(name, data))
    },

    /** すべてのイベント(スケジュール)の強制リロード*/
    calendarReloadEvents() {
      this.calendarEmit('reload-events')
    }
  }
}

export { defaultSettings, calendarViewType, CalendarMixins }