import CustomAnchor from '@asset360/components/CustomAnchor';
import { Col, Empty, Row } from 'antd-v5';
import { ResizableContainers, useGetHeight } from 'iblive-base';
import { useEffect, useRef, useState } from 'react';
import styles from './index.less';
import ProductTable from './views/ProductTable';
import StockRightCotent from './views/StockRightCotent';
import TopNTree from './views/TopNTree';

const anchorList = [
  {
    id: 'id-1',
    title: '公司产品持仓',
  },
  {
    id: 'id-2',
    title: '股票基本信息',
  },

  {
    id: 'id-3',
    title: '持有产品清单',
  },

  {
    id: 'id-4',
    title: '同行业比较',
  },
];

const SecurityAnalysis = () => {
  const contentRef = useRef();
  const height = useGetHeight(
    contentRef.current,
    100,
    8,
    document.getElementById('content_container'),
  );
  const [secType, setSecType] = useState('GP');
  const [detailInfo, setDetailInfo] = useState('');
  const onSelectIndex = (node) => {
    setDetailInfo(node);
  };
  const wrapperRef = useRef();
  useEffect(() => {}, [detailInfo]);
  return (
    <div
      id="content_container"
      style={{
        height: '100%',
      }}
    >
      <ResizableContainers
        containdersHeight={height}
        leftDefaultWidth={275}
        leftMinWidth={275}
        isAuto={false}
        leftMaxWidth="60vw"
        leftContent={
          <div ref={contentRef} className={styles.configs_left_content}>
            <TopNTree
              height={height}
              onSelectIndex={onSelectIndex}
              detailInfo={detailInfo}
              setType={setSecType}
              type={secType}
              setDetailInfo={setDetailInfo}
            />
          </div>
        }
        rightContent={
          detailInfo ? (
            detailInfo.secType === 'GP' ? (
              <Row wrap={false}>
                <Col flex={1}>
                  <StockRightCotent
                    detailInfo={detailInfo}
                    height={height}
                    wrapperRef={wrapperRef}
                  />
                </Col>

                <Col>
                  <CustomAnchor
                    items={anchorList}
                    getContainer={() => wrapperRef.current}
                  />
                </Col>
              </Row>
            ) : (
              <div className="blank-card-asset">
                <ProductTable
                  detailInfo={detailInfo}
                  secType={detailInfo?.secType}
                  height={height - 60}
                />
              </div>
            )
          ) : (
            <Empty />
          )
        }
      />
    </div>
  );
};

export default SecurityAnalysis;
