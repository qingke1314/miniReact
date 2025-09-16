/*
 * @Description: 文件内容描述
 * @Author: chenzongjun chenzongjun@apexsoft.com.cn
 * @Date: 2024-06-14 12:54:31
 * @LastEditTime: 2024-07-30 14:58:44
 * @LastEditors: chenzongjun chenzongjun@apexsoft.com.cn
 */
import { getFundTreeByAuth } from '@asset360/apis/position';
import {
  queryTemplateRef,
  updateTemplateRef,
} from '@asset360/apis/positionTemplate';
import CustomButtonGroup from '@asset360/components/CustomButtonGroup';
import CustomModal from '@asset360/components/CustomModal';
import { Button, message, TreeSelect } from 'antd-v5';
import { useEffect, useState } from 'react';
export default ({ visible, onCancel, node }) => {
  const [selectedFunds, setSelectedFunds] = useState([]);

  const [funds, setFunds] = useState([]);

  const [isSelectedAll, setIsSelectedAll] = useState(false);

  const initData = async () => {
    const fundsRes = await getFundTreeByAuth();
    setFunds(
      fundsRes?.records.map((item) => ({
        title: item.objectName,
        value: item.objectCode,
        fundCode: item.objectCode,
        // children: item.childrenObjects?.map((child) => ({
        //   title: child.objectName,
        //   value: child.objectCode,
        //   fundCode: item.objectCode,
        //   astUnitId: child.objectCode,
        // })),
      })) || [],
    );

    const detailRes = await queryTemplateRef({
      templateId: node.templateId,
    });
    setSelectedFunds(
      detailRes?.records?.map((item) => ({
        fundCode: item.fundCode,
        value: item.astUnitId || item.fundCode,
        astUnitId: item.astUnitId,
      })) || [],
    );
    if (detailRes?.records?.length == fundsRes?.records.length) {
      setIsSelectedAll(true);
    }
  };

  useEffect(() => {
    if (visible) {
      initData();
    }
  }, [visible]);

  return (
    <CustomModal
      title={'选择关联产品'}
      width="45vw"
      footer={
        <CustomButtonGroup
          onConfirm={async (setSaving) => {
            setSaving(true);
            const res = await updateTemplateRef({
              refList: selectedFunds.map((item) => ({
                fundCode: item.fundCode,
                astUnitId: item.astUnitId,
              })),
              templateId: node.templateId,
            });
            if (res?.code > 0) {
              message.success('关联成功');
              onCancel();
            }
            setSaving(false);
          }}
          onCancel={onCancel}
        />
      }
      visible={visible}
      onCancel={onCancel}
      maskClosable={false}
      afterClose={() => {
        setSelectedFunds([]);
        setIsSelectedAll(false);
      }}
      destroyOnClose
    >
      <div style={{ display: 'flex' }}>
        <TreeSelect
          showSearch
          maxTagCount="responsive"
          value={selectedFunds.map((item) => item.value)}
          dropdownStyle={{ maxHeight: 325, overflow: 'auto' }}
          style={{ width: '90%' }}
          placeholder="请选择关联产品"
          allowClear
          filterTreeNode={(inputValue, node) =>
            node.title?.indexOf(inputValue) > -1 ||
            node.value?.indexOf(inputValue) > -1
          }
          multiple
          treeDefaultExpandAll
          showCheckedStrategy
          onSelect={(e, option) => {
            const array = [...selectedFunds];
            const { fundCode, astUnitId, value } = option;
            array.push({
              fundCode,
              astUnitId,
              value,
            });
            setSelectedFunds(array);
          }}
          onChange={(e) => {
            const array = [];
            e.map((item) => {
              selectedFunds.map((fund) => {
                if (fund.value == item) {
                  array.push(fund);
                }
              });
            });
            setSelectedFunds(array);
          }}
          onClear={() => {
            setSelectedFunds([]);
          }}
          treeData={funds}
        />
        <Button
          onClick={() => {
            if (isSelectedAll) {
              setSelectedFunds([]);
              setIsSelectedAll(false);
            } else {
              setSelectedFunds(
                funds?.map((item) => ({
                  fundCode: item.fundCode,
                  value: item.astUnitId || item.fundCode,
                  astUnitId: item.astUnitId,
                })),
              );
              setIsSelectedAll(true);
            }
          }}
          style={{ marginLeft: 8 }}
          type="dashed"
        >
          {isSelectedAll ? '清空' : '全选'}
        </Button>
      </div>
    </CustomModal>
  );
};
