/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2024-11-13 11:52:43
 * @LastEditors: guoxuan
 * @LastEditTime: 2025-02-17 14:23:36
 * @Description:
 */
import CustomAnchor from '@asset360/components/CustomAnchor';
import ProductRecordHistorySelector from '@asset360/components/ProductRecordHistorySelector';
import { Button, Col, Row } from 'antd';
import { useGetHeight } from 'iblive-base';
import { useRef, useState } from 'react';
import { setProductCode } from '../../../../store/assetLayoutSlice';
import Asset from './views/Asset';
import BaseInfo from './views/BaseInfo';
import Performance from './views/Performance';
import TrendCharts from './views/TrendCharts';

const anchorList = [
  {
    title: '比对列表',
    id: 'base_info',
  },
  {
    title: '业绩比对',
    id: 'performance_table',
  },
  {
    title: '资产比对',
    id: 'asset_table',
  },
  {
    title: '走势比对',
    id: 'trend_charts',
  },
];

const initProductList = [
  {
    fundName: '华泰柏瑞行业严选混合A',
    fundCode: '011111',
  },
  {
    fundName: '景顺长城景颐尊利债券A',
    fundCode: '015805',
  },
];
export default () => {
  const [productList] = useState(initProductList);
  const contentRef = useRef();
  const contentHeight = useGetHeight(
    contentRef.current,
    100,
    8,
    document.getElementById('content_container'),
  );

  // const onSearch = (code) => {
  //   // if (productList?.length === 10) return;
  //   // setProductList((pre) => {
  //   //   let list = [...(pre || [])];
  //   //   list.unshift(code);
  //   //   list = Array.from(new Set(list));
  //   //   return list;
  //   // });
  // };

  return (
    <div style={{ height: '100%' }} id="content_container">
      <Row className="blank-card-asset m-b-8" gutter={[8, 8]}>
        <Col>
          <ProductRecordHistorySelector
            bordered={true}
            setProductCode={setProductCode}
          />
        </Col>
        <Col>
          <Button>清空列表</Button>（最多同时比较10只基金）
        </Col>
      </Row>
      <Row wrap={false}>
        <Col flex={1}>
          <div
            ref={contentRef}
            style={{ height: contentHeight, overflowY: 'auto' }}
          >
            <div className="blank-card-asset m-b-8" id="base_info">
              <BaseInfo productList={productList} />
            </div>

            <div className="blank-card-asset" id="trend_charts">
              <TrendCharts productList={productList} />
            </div>

            <div className="blank-card-asset m-b-8" id="performance_table">
              <Performance productList={productList} />
            </div>

            <div className="blank-card-asset m-b-8" id="asset_table">
              <Asset productList={productList} />
            </div>
          </div>
        </Col>
        <Col>
          <CustomAnchor
            items={anchorList}
            getContainer={() => contentRef.current}
          />
        </Col>
      </Row>
    </div>
  );
};
