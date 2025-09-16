/*
 * @Author: guoxuan guoxuan@apexsoft.com.cn
 * @Date: 2024-06-26 09:38:08
 * @LastEditors: guoxuan
 * @LastEditTime: 2025-02-26 15:42:17
 * @FilePath: \invest-index-server-front\src\pages\app\assetOverview\OverView\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { moneyFormat } from 'iblive-base';
import { Descriptions } from 'antd-v5';
import styles from '../index.less';

export default function BaseMsg({ info }) {
  return (
    <div>
      <div
        // span={2}
        style={{
          fontSize: '16px',
          color: 'var(--text-color)',
          fontWeight: 'bold',
        }}
      >
        最新价：
        <span
          style={{
            fontSize: '16px',
            color: 'var(--text-color)',
            fontWeight: 'bold',
            lineHeight: '16px',
          }}
        >
          {moneyFormat({
            num: info?.lastPrice,
            needColor: true,
          })}
        </span>
        <span style={{ marginLeft: 12, fontSize: 13 }}>
          {moneyFormat({
            num: info?.todayPhase,
            needColor: true,
            unit: '%',
          })}
        </span>
      </div>
      <Descriptions
        column={2}
        size="small"
        className={styles.quote_descriptions}
      >
        <Descriptions.Item label="成交额">
          {moneyFormat({ num: info?.dealAmt / 10000 })}
          &nbsp;万元
        </Descriptions.Item>
        <Descriptions.Item label="成交量">
          {moneyFormat({ num: info?.dealQty / 10000 })}
          &nbsp;万手
        </Descriptions.Item>

        <Descriptions.Item label="总市值">
          {moneyFormat({
            num: info?.marketValue / 100000000,
            unit: '亿',
          })}
        </Descriptions.Item>
        <Descriptions.Item label="总股本">
          {moneyFormat({
            num: info?.totalAmount / 100000000,
            unit: '亿',
          })}
        </Descriptions.Item>
        <Descriptions.Item label="流通股">
          {moneyFormat({
            num: info?.turnoverAmount / 100000000,
            unit: '亿',
          })}
        </Descriptions.Item>

        <Descriptions.Item label="行业">{info?.indName}</Descriptions.Item>
        <Descriptions.Item label="市盈率">
          {moneyFormat({
            num: info?.peRatioTtm,
          })}
        </Descriptions.Item>
        <Descriptions.Item label="行业市盈率">
          {moneyFormat({
            num: info?.tem,
            unit: '%',
          })}
        </Descriptions.Item>

        <Descriptions.Item label="市净率">
          <span>{info?.pbRatio}</span>
        </Descriptions.Item>
        <Descriptions.Item label="行业市净率">
          <span>
            {moneyFormat({
              num: info?.tem,
              unit: '%',
            })}
          </span>
        </Descriptions.Item>
        <Descriptions.Item label="股息率">
          {moneyFormat({
            num: info?.tem,
            unit: '%',
          })}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
}
