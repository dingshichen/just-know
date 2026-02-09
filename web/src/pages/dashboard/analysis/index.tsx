import { EllipsisOutlined } from '@ant-design/icons';
import { GridContent } from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { Col, Dropdown, Modal, Row, Tabs, Typography } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker';
import type { Dayjs } from 'dayjs';
import type { FC } from 'react';
import { Suspense, useEffect, useState } from 'react';
import type { NoticeDetail } from '@/services/notice';
import { listUnreadNotices, readNotice } from '@/services/notice';
import IntroduceRow from './components/IntroduceRow';
import OfflineData from './components/OfflineData';
import PageLoading from './components/PageLoading';
import ProportionSales from './components/ProportionSales';
import type { TimeType } from './components/SalesCard';
import SalesCard from './components/SalesCard';
import TopSearch from './components/TopSearch';
import type { AnalysisData } from './data.d';
import { fakeChartData } from './service';
import useStyles from './style.style';
import { getTimeDistance } from './utils/utils';

type RangePickerValue = RangePickerProps['value'];
type AnalysisProps = {
  dashboardAndanalysis: AnalysisData;
  loading: boolean;
};
type SalesType = 'all' | 'online' | 'stores';
const Analysis: FC<AnalysisProps> = () => {
  const { styles } = useStyles();
  const [salesType, setSalesType] = useState<SalesType>('all');
  const [currentTabKey, setCurrentTabKey] = useState<string>('');
  const [rangePickerValue, setRangePickerValue] = useState<RangePickerValue>(
    getTimeDistance('year'),
  );
  const [unreadNotices, setUnreadNotices] = useState<NoticeDetail[]>([]);
  const [noticeModalOpen, setNoticeModalOpen] = useState(false);
  const [activeNoticeId, setActiveNoticeId] = useState<string>();
  const { loading, data } = useRequest(fakeChartData);

  useEffect(() => {
    const fetchUnreadNotices = async () => {
      try {
        const res = await listUnreadNotices();
        const list = res?.data || [];
        if (list.length > 0) {
          setUnreadNotices(list);
          setActiveNoticeId(list[0].noticeId);
          setNoticeModalOpen(true);
          // 首条公告视为已阅读
          if (list[0].noticeId) {
            readNotice(list[0].noticeId);
          }
        }
      } catch (e) {
        // ignore
      }
    };
    fetchUnreadNotices();
  }, []);
  const selectDate = (type: TimeType) => {
    setRangePickerValue(getTimeDistance(type));
  };
  const handleRangePickerChange = (value: RangePickerValue) => {
    setRangePickerValue(value);
  };
  const isActive = (type: TimeType) => {
    if (!rangePickerValue) {
      return '';
    }
    const value = getTimeDistance(type);
    if (!value) {
      return '';
    }
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return '';
    }
    if (
      rangePickerValue[0].isSame(value[0] as Dayjs, 'day') &&
      rangePickerValue[1].isSame(value[1] as Dayjs, 'day')
    ) {
      return styles.currentDate;
    }
    return '';
  };

  let salesPieData: any;
  if (salesType === 'all') {
    salesPieData = data?.salesTypeData;
  } else {
    salesPieData =
      salesType === 'online'
        ? data?.salesTypeDataOnline
        : data?.salesTypeDataOffline;
  }

  const dropdownGroup = (
    <span className={styles.iconGroup}>
      <Dropdown
        menu={{
          items: [
            {
              key: '1',
              label: '操作一',
            },
            {
              key: '2',
              label: '操作二',
            },
          ],
        }}
        placement="bottomRight"
      >
        <EllipsisOutlined />
      </Dropdown>
    </span>
  );
  const handleChangeSalesType = (value: SalesType) => {
    setSalesType(value);
  };
  const handleTabChange = (key: string) => {
    setCurrentTabKey(key);
  };
  const activeKey = currentTabKey || data?.offlineData[0]?.name || '';
  const handleNoticeTabChange = (key: string) => {
    setActiveNoticeId(key);
    readNotice(key);
  };
  const activeNotice = unreadNotices.find((n) => n.noticeId === activeNoticeId);
  return (
    <GridContent>
      <Suspense fallback={<PageLoading />}>
        <IntroduceRow loading={loading} visitData={data?.visitData || []} />
      </Suspense>

      <Suspense fallback={null}>
        <SalesCard
          rangePickerValue={rangePickerValue}
          salesData={data?.salesData || []}
          isActive={isActive}
          handleRangePickerChange={handleRangePickerChange}
          loading={loading}
          selectDate={selectDate}
        />
      </Suspense>

      <Row
        gutter={24}
        style={{
          marginTop: 24,
        }}
      >
        <Col xl={12} lg={24} md={24} sm={24} xs={24}>
          <Suspense fallback={null}>
            <TopSearch
              loading={loading}
              visitData2={data?.visitData2 || []}
              searchData={data?.searchData || []}
              dropdownGroup={dropdownGroup}
            />
          </Suspense>
        </Col>
        <Col xl={12} lg={24} md={24} sm={24} xs={24}>
          <Suspense fallback={null}>
            <ProportionSales
              dropdownGroup={dropdownGroup}
              salesType={salesType}
              loading={loading}
              salesPieData={salesPieData || []}
              handleChangeSalesType={handleChangeSalesType}
            />
          </Suspense>
        </Col>
      </Row>

      <Suspense fallback={null}>
        <OfflineData
          activeKey={activeKey}
          loading={loading}
          offlineData={data?.offlineData || []}
          offlineChartData={data?.offlineChartData || []}
          handleTabChange={handleTabChange}
        />
      </Suspense>
      {noticeModalOpen && unreadNotices.length > 0 && (
        <Modal
          open={noticeModalOpen}
          title="系统公告"
          footer={null}
          width={800}
          onCancel={() => setNoticeModalOpen(false)}
          destroyOnClose
        >
          <Tabs
            tabPosition="left"
            activeKey={activeNoticeId}
            onChange={handleNoticeTabChange}
            items={unreadNotices.map((n) => ({
              key: n.noticeId,
              label: n.title || '未命名公告',
              children: (
                <div>
                  <Typography.Title level={4}>{n.title}</Typography.Title>
                  <Typography.Paragraph>
                    {n.content || '暂无内容'}
                  </Typography.Paragraph>
                </div>
              ),
            }))}
          />
        </Modal>
      )}
    </GridContent>
  );
};
export default Analysis;
