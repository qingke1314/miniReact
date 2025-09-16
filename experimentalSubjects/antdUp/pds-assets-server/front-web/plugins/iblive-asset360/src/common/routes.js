/* eslint-disable react/jsx-key */
import Icon, {
  AppstoreOutlined,
  AreaChartOutlined,
  BankOutlined,
  DollarCircleOutlined,
  FundOutlined,
  RadarChartOutlined,
  StockOutlined,
} from '@ant-design/icons';
import { ReactComponent as incomeIcon } from '@asset360/assets/app/assetOverview/income.svg';
import { ReactComponent as quanyiriliIcon } from '@asset360/assets/app/assetOverview/quanyiriliIcon.svg';
import { ReactComponent as shishichicangIcon } from '@asset360/assets/app/assetOverview/shishichicangIcon.svg';
import { ReactComponent as zuhegailanIcon } from '@asset360/assets/app/assetOverview/zuhegailanIcon.svg';
import ProductAssetLayout from '@asset360/components/ProductAssetLayout';
import AppLayout from '../layouts/AppLayout';
import AssetInventory from '../pages/app/assetOverview/AssetInventory';
import AssetVariation from '../pages/app/assetOverview/AssetVariation';
import Combination from '../pages/app/assetOverview/Combination';
import ComparativeAnalysis from '../pages/app/assetOverview/ComparativeAnalysis';
import EquityVariation from '../pages/app/assetOverview/EquityVariation';
import FundOverview from '../pages/app/assetOverview/FundOverview';
import IncomeAnalysis from '../pages/app/assetOverview/IncomeAnalysis';
import MarketIndex from '../pages/app/assetOverview/MarketIndex';
import OperationalIncome from '../pages/app/assetOverview/OperationalIncome';
import OverView from '../pages/app/assetOverview/OverView';
import SecurityAnalysis from '../pages/app/assetOverview/SecurityAnalysis';
import StockAnalysis from '../pages/app/assetOverview/StockAnalysis';
import MomIncomeAnalysis from '../pages/app/assetOverview/MomIncomeAnalysis';

const routes = [
  {
    path: '/APP',
    name: '组合360',
    component: <AppLayout />,
    icon: <AppstoreOutlined />,
    routes: [
      {
        path: '/APP/assetOverview',
        name: '组合分析',
        routes: [
          {
            path: '/APP/assetOverview',
            redirect: '/APP/assetOverview/overview',
          },
          {
            path: '/APP/assetOverview/overview',
            name: '全部产品',
            component: <OverView />,
            icon: <AppstoreOutlined />,
          },
          {
            path: '/APP/assetOverview/product',
            name: '产品概览',
            component: <FundOverview />,
            wrappers: [<ProductAssetLayout />],
            icon: <Icon component={zuhegailanIcon} />,
          },
          {
            path: '/APP/assetOverview/assetInventory',
            name: '持仓中心',
            component: <AssetInventory />,
            wrappers: [<ProductAssetLayout needAssetType />],
            icon: <Icon component={shishichicangIcon} />,
          },
          {
            path: '/APP/assetOverview/incomeAnalysis',
            name: '收益中心',
            component: <IncomeAnalysis />,
            icon: <AreaChartOutlined />,
          },
          {
            path: '/APP/assetOverview/momIncomeAnalysis',
            name: 'MOM收益中心',
            component: <MomIncomeAnalysis />,
            icon: <AreaChartOutlined />,
          },
          {
            path: '/APP/assetOverview/assetVariation',
            name: '指令订单',
            wrappers: [<ProductAssetLayout />],
            component: <AssetVariation />,
            icon: <Icon component={incomeIcon} />,
          },
          {
            path: '/APP/assetOverview/equityVariation',
            name: '权益日历',
            wrappers: [<ProductAssetLayout />],
            component: <EquityVariation />,
            icon: <Icon component={quanyiriliIcon} />,
          },
          {
            path: '/APP/assetOverview/comparativeAnalysis',
            name: '产品对比分析',
            component: <ComparativeAnalysis />,
            icon: <RadarChartOutlined />,
          },
          {
            path: '/APP/assetOverview/securityAnalysis',
            name: '证券分析视图',
            component: <SecurityAnalysis />,
            icon: <FundOutlined />,
          },
          {
            path: '/APP/assetOverview/combination',
            name: '模拟组合管理',
            icon: <AppstoreOutlined />,
            component: <Combination />,
          },
          {
            path: '/APP/assetOverview/virtualCombination',
            name: '虚拟组合设置',
            icon: <AppstoreOutlined />,
            component: () =>
              import('../pages/app/assetOverview/VirtualCombination'),
          },
          {
            path: '/APP/assetOverview/operationalIncome',
            name: '操作盈亏',
            component: <OperationalIncome />,
            icon: <DollarCircleOutlined />,
          },
          {
            path: '/APP/assetOverview/marketIndex',
            name: '市场指数',
            component: <MarketIndex />,
            icon: <BankOutlined />,
          },
          {
            path: '/APP/assetOverview/secAnalysis',
            name: '个股研究跟踪',
            icon: <StockOutlined />,
            component: <StockAnalysis />,
          },
          // {
          //   path: '/APP/assetOverview/secResponse',
          //   name: '个股研究回复',
          //   icon: <MessageOutlined />,
          //   component: <StockResponse />,
          // },
        ],
      },
    ],
  },
];
export default routes;
