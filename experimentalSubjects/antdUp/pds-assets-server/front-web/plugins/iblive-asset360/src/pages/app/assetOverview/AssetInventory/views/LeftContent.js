/*
 * @Author: guoxuan guoxuan@apexsoft.com.cn
 * @Date: 2024-06-11 09:43:05
 * @LastEditors: liuxinmei liuxinmei@apexsoft.com.cn
 * @LastEditTime: 2025-02-05 09:04:40
 * @FilePath: \invest-index-server-front\src\pages\monitor\CashPosition\views\CatalogTree.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { executeApi } from '@asset360/apis/appCommon';
import CustomTree from '@asset360/components/CustomTree';
import { Spin } from 'antd';
import { moneyFormat } from 'iblive-base';
import { useEffect, useState } from 'react';
import styles from '../index.less';
import { configUtils } from 'iblive-base';

const TREE_DATA = [
  {
    key: 'zichan',
    parentCode: null,
    isLeaf: false,
    title: '资产',
    selectable: false,
    children: [
      {
        key: 'gupiao',
        parentCode: 'zichan',
        isLeaf: true,
        title: '股票',
        selectable: true,
        color: '#00AEFF',
      },
      {
        key: 'zhaiquan',
        parentCode: 'zichan',
        isLeaf: true,
        title: '债券',
        selectable: true,
        color: '#4ED2B9',
      },
      {
        key: 'jijinlicai',
        parentCode: 'zichan',
        isLeaf: true,
        title: '基金理财',
        selectable: true,
        color: '#FBBF47',
      },
      {
        key: 'huigou',
        parentCode: 'zichan',
        isLeaf: true,
        title: '回购',
        selectable: true,
        color: '#FF7B2C',
      },
      // {
      //   key: 'quanzheng',
      //   parentCode: 'zichan',
      //   isLeaf: true,
      //   title: '权证',
      //   selectable: true,
      //   total: 500,
      //   proportion: 5,
      // },
      {
        key: 'qihuo',
        parentCode: 'zichan',
        isLeaf: true,
        title: '期货',
        selectable: true,
        color: '#60CDF4',
      },
      {
        key: 'qiquan',
        parentCode: 'zichan',
        isLeaf: true,
        title: '期权',
        selectable: true,
        color: '#60CDF4',
      },
      {
        key: 'cunkuan',
        parentCode: 'zichan',
        isLeaf: true,
        title: '存款',
        selectable: true,
        color: '#397BFF',
      },
      {
        key: 'qita',
        parentCode: 'zichan',
        isLeaf: true,
        title: '其他',
        selectable: true,
        color: '#8B85ED',
      },
    ],
  },

  {
    key: 'xianjin',
    parentCode: 'zichan',
    isLeaf: true,
    title: '现金',
    selectable: true,
  },
  {
    key: 'yingshou',
    parentCode: null,
    isLeaf: true,
    title: '应收',
    selectable: true,
  },
  {
    key: 'yingfu',
    parentCode: null,
    isLeaf: true,
    title: '应付',
    selectable: true,
  },
];

const assetDetailObj = {
  gupiao: 'stockAsset',
  zhaiquan: 'bondAsset',
  jijinlicai: 'fundAsset',
  huigou: 'repoAsset',
  qihuo: 'futuresAsset',
  qita: 'otherAsset',
  cunkuan: 'depositAsset',
};

const LeftContent = ({
  height,
  selectTreeKey,
  setSelectTreeKey,
  productCode,
  astUnitId,
}) => {
  const { envConfig } = configUtils.getConfig();
  const finalTreeData = envConfig.HXOMS_AUTO_HIDE
    ? TREE_DATA.slice(0, -3)
    : TREE_DATA;
  const [expandedKeys, setExpandedKeys] = useState(['zichan']);
  const [assetDetail, setAssetDetail] = useState({});
  const [loading, setLoading] = useState(false);

  const getAssetDetail = async (isNeedLoading) => {
    isNeedLoading && setLoading(true);
    const res = await executeApi({
      serviceId: 'DD_API_COMBI_ASSET_DETAILS',
      data: {
        fundCode: productCode,
        astUnitId,
      },
    });
    const data = res?.data || {};
    setAssetDetail(data);
    isNeedLoading && setLoading(false);
  };

  useEffect(() => {
    if (productCode) {
      getAssetDetail(true);
    }
  }, [productCode, astUnitId]);
  return (
    <div className={styles.configs_left_content}>
      <Spin spinning={loading}>
        <CustomTree
          height={height}
          treeData={finalTreeData}
          blockNode
          showIcon={false}
          expandedKeys={expandedKeys}
          selectedKeys={[selectTreeKey]}
          onSelect={(keys) => setSelectTreeKey(keys[0])}
          onExpand={(e) => {
            setExpandedKeys(e);
          }}
          titleRender={(record) => {
            return (
              <div className={styles.tree_title_wrap}>
                <div className={styles.title_content}>
                  <span style={{ fontWeight: 'bold' }}>{record?.title}</span>
                  {!['现金', '应收', '应付', '资产'].includes(record?.title) &&
                    !!assetDetail[assetDetailObj[record?.key]] && (
                      <div style={{ textAlign: 'right' }}>
                        <span>
                          {moneyFormat({
                            num:
                              assetDetail[assetDetailObj[record?.key]] /
                              100000000,
                            decimal: 2,
                            unit: '亿',
                          })}
                        </span>
                        &nbsp;&nbsp;
                        <span
                          className="small-text"
                          style={{
                            color: 'var(--primary-color)',
                            display: 'inline-block',
                            width: 40,
                          }}
                        >
                          {`${moneyFormat({
                            num:
                              (assetDetail[assetDetailObj[record?.key]] /
                                assetDetail?.netAsset) *
                              100,
                            decimal: 2,
                          })}%`}
                        </span>
                      </div>
                    )}
                </div>
              </div>
            );
          }}
        />
      </Spin>
    </div>
  );
};
export default LeftContent;
