/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2024-12-12 16:48:11
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 * @LastEditTime: 2024-12-13 11:06:16
 * @Description: 头寸特殊需求，>=0 黑色，<0红色
 */
export default ({ number, children }) => {
  return (
    <span
      style={{
        color: parseFloat(number || 0) >= 0 ? 'inherit' : 'var(--red-color)',
      }}
    >
      {children}
    </span>
  );
};
