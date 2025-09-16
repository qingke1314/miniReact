/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2024-07-26 09:34:05
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 * @LastEditTime: 2024-07-26 15:39:31
 * @Description:
 */

import styles from '../index.less';

const ListObj = {
  产品代码: '${fundCode}',
  产品名称: '${fundName}',
  资产单元序号: '${unitId}',
  资产单元名称: '${unitName}',
  'T+0指令可用': '${t0InstAmount}',
  'T+1指令可用': '${t1InstAmount}',
  'T+0可用头寸': '${t0Amount}',
  'T+1可用头寸': '${t1Amount}',
  现金比例: '${cashScale}',
};
class PlaceholderSelectMenu {
  constructor() {
    this.title = '快捷占位符';
    this.tag = 'button';
    this.showDropPanel = true;
  }
  getValue() {
    return '';
  }
  isActive() {
    return false;
  }
  isDisabled() {
    return false;
  }
  exec() {}
  getPanelContentElem(editor) {
    const dom = document.createElement('ul');
    dom.setAttribute('class', styles.tool_ul);
    dom.innerHTML = `${Object.keys(ListObj)
      .map((item) => `<li  key=${item}>${item}</li>`)
      .join('\n')}`;
    dom.onclick = (e) => {
      const target = e.target;
      if (target.tagName.toLowerCase() === 'li') {
        editor.insertText(ListObj[target.innerHTML]);
        editor.hidePanelOrModal();
      }
    };
    return dom;
  }
}

export default PlaceholderSelectMenu;
