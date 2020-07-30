const FormTypes = {
  normal: 'normal',
  input: 'input',
  inputNumber: 'inputNumber',
  checkbox: 'checkbox',
  select: 'select',
  date: 'date',
  datetime: 'datetime',
  upload: 'upload',
  file: 'file',
  image: 'image',
  popup:'popup',
  list_multi:"list_multi",
  sel_search:"sel_search",
  radio:'radio',
  checkbox_meta:"checkbox_meta",

  slot: 'slot',
  hidden: 'hidden'
}
const VALIDATE_NO_PASSED = Symbol()
export { FormTypes, VALIDATE_NO_PASSED }

/**
 * 指定された$refsオブジェクトを取得する
 * コンポーネントがページにサスペンションされていない場合には,$refsのあるオブジェクトを取得できない場合がある
 * この方法は,サスペンドが完了するのを待ってから$refsのオブジェクトを返し,ミスを回避することができる
 * @author sunjianlei
 **/
export function getRefPromise(vm, name) {
  return new Promise((resolve) => {
    (function next() {
      let ref = vm.$refs[name]
      if (ref) {
        resolve(ref)
      } else {
        setTimeout(() => {
          next()
        }, 10)
      }
    })()
  })
}

/**
 * メイン・フォームとすべてのサブ・フォームを一括して検証する
 * @param form メイン・フォームはformオブジェクトである
 * @param cases 配列を受信すると、各項目はJEditableの例です
 * @returns {Promise<any>}
 * @author sunjianlei
 */
export function validateFormAndTables(form, cases) {

  if (!(form && typeof form.validateFields === 'function')) {
    throw `form パラメータはformオブジェクトを必要とするが、入力はである${typeof form}`
  }

  let options = {}
  return new Promise((resolve, reject) => {
    // マスタ・フォームを検証する
    form.validateFields((err, values) => {
      err ? reject({ error: VALIDATE_NO_PASSED }) : resolve(values)
    })
  }).then(values => {
    Object.assign(options, { formValue: values })
    // すべてのサブリストのフォームを検証する
    return validateTables(cases)
  }).then(all => {
    Object.assign(options, { tablesValue: all })
    return Promise.resolve(options)
  }).catch(error => {
    return Promise.reject(error)
  })

}

/**
 * 1つ以上のテーブルのすべての値を検証して取得する
 * @param cases 配列を受信すると、各項目はJEditableの例です
 * @author sunjianlei
 */
export function validateTables(cases) {
  if (!(cases instanceof Array)) {
    throw `'validateTables'関数の'cases'パラメータが必要なのは1つの配列で、入力したのは${typeof cases}`
  }
  return new Promise((resolve, reject) => {
    let tables = []
    let index = 0;
    (function next() {
      let vm = cases[index]
      vm.getAll(true).then(all => {
        tables[index] = all
        // チェックがすべて完了したかどうかを判断し,リターン成功をしなければ,次のチェックを続行する
        if (++index === cases.length) {
          resolve(tables)
        } else (
          next()
        )
      }, error => {
        // 未検証パスのフォームが現れ,次のチェックを行わず,そのまま失敗を返してそのフォームにジャンプする
        if (error === VALIDATE_NO_PASSED) {
          reject({ error: VALIDATE_NO_PASSED, index })
        }
        reject(error)
      })
    })()
  })
}