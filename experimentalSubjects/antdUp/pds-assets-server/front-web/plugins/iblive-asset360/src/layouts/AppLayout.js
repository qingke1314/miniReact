/*
 * @Author: liuxinmei liuxinmei@apexsoft.com.cn
 * @Date: 2023-07-27 13:43:12
 * @LastEditors: wenyiqian
 * @LastEditTime: 2025-02-18 10:41:11
 * @Description: 应用管理Layout
 */
import { Outlet } from '@umijs/max';
import { CustomLayout } from 'iblive-base';
// const iconMap = {
//   风控大屏: <RadarChartOutlined />,
//   风险试算: <AimOutlined />,
//   风险设置: <SettingOutlined />,
//   合规项管理: <FolderOpenOutlined />,
//   公司概况: getImg(companyResume),
//   管理产品: getImg(products),
//   业绩表现: getImg(performance),
//   基金经理: getImg(fundManager),
//   风险绩效: getImg(risk),
//   资产簿记: getImg(positions),
//   交易流水: getImg(trade),
//   // 实时头寸: getImg(asset),
//   风险预警查询: <AlertOutlined />,
//   交易行为监控: <AccountBookOutlined />,
//   静态风控监控: <AimOutlined />,
//   系统参数维护: <AppstoreOutlined />,
//   风控报告: <FileTextOutlined />,
//   调用监控: <MonitorOutlined />,
//   风控审核: <IdcardOutlined />,
//   指令信息: <InfoCircleOutlined />,
//   产品信息: <CodepenOutlined />,
//   主体池: <BankOutlined />,
//   基础设置: <FormOutlined />,
//   产品组设置: <PartitionOutlined />,
//   风险监控: <BranchesOutlined />,
//   调度监控: <ClockCircleOutlined />,
//   调度配置: <FieldTimeOutlined />,
//   产品设置: <SettingOutlined />,
//   交易日维护: <CalendarOutlined />,
//   市场参数: <ControlOutlined />,
//   业务参数: <CodeSandboxOutlined />,
//   头寸概览: <AppstoreOutlined />,
//   现金流预测: <AimOutlined />,
//   日初头寸测算: <CalculatorOutlined />,
//   O32头寸: <TransactionOutlined />,
//   日终头寸: <CarryOutOutlined />,
//   单产品头寸: <LineChartOutlined />,
//   交易市场维护: <BankOutlined />,
//   指令下达: <TransactionOutlined />,
//   组合维护: <ApartmentOutlined />,
//   账户管理: <TeamOutlined />,
//   指令管理: <AuditOutlined />,
// };

export default () => {
  return (
    <CustomLayout
      padding={'8px'} //首页边距小
    >
      <Outlet />
    </CustomLayout>
  );
};
