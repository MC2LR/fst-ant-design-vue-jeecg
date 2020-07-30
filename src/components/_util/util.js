/**
 * components util
 */

/**
 * 空の値、オブジェクトを消去する
 * @param children
 * @returns {*[]}
 */
export function filterEmpty (children = []) {
  return children.filter(c => c.tag || (c.text && c.text.trim() !== ''))
}