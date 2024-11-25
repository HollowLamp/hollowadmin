import PageHeader from "@/components/pageheader/PageHeader";
import {
  Card,
  Grid,
  Text,
  Group,
  ThemeIcon,
  Button,
  Title,
  Loader,
  Flex,
  SegmentedControl,
} from "@mantine/core";
import {
  IconEye,
  IconMessage,
  IconHeart,
  IconArticle,
  IconRefresh,
} from "@tabler/icons-react";
import {
  useGetStatistics,
  useGetDailyViews,
  useGetViewsStatistics,
  useGetContentWordCount,
  useGetMonthlyViews,
} from "@/hooks/use-statistics";
import { useEffect, useState } from "react";
import { LineChart, PieChart, BarChart } from "@mantine/charts";
import dayjs from "dayjs";
import style from "./style.module.css";
import { Link } from "react-router-dom";

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  footer: React.ReactNode;
  isLoading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  value,
  label,
  footer,
  isLoading = false,
}) => {
  return (
    <Card
      shadow="sm"
      radius="md"
      p="lg"
      classNames={{
        root: style.card,
      }}
    >
      <Group p="apart">
        <ThemeIcon variant="light" size="xl">
          {icon}
        </ThemeIcon>
        <Text size="sm" c="dimmed" pl={10}>
          {label}
        </Text>
        <div>
          {isLoading ? (
            <Loader size="sm" />
          ) : (
            <Title size="xl" fw={700} pl={5} w={700}>
              {value}
            </Title>
          )}
        </div>
      </Group>
      <Text size="xs" mt="sm" c="gray">
        {footer}
      </Text>
    </Card>
  );
};

const Home: React.FC = () => {
  const {
    data: statistics,
    refetch: refetchStatistics,
    isLoading: isStatisticsLoading,
  } = useGetStatistics();

  const { data: viewsStatistics, refetch: refetchViewsStatistics } =
    useGetViewsStatistics();

  const {
    data: wordCounts,
    refetch: refetchWordCounts,
    isLoading: isWordCountsLoading,
  } = useGetContentWordCount();

  const [timeRange, setTimeRange] = useState<string>("7d");
  const { startDate, endDate } = (() => {
    const now = dayjs();
    if (timeRange === "7d") {
      return {
        startDate: now.subtract(7, "day").format("YYYY-MM-DD"),
        endDate: now.format("YYYY-MM-DD"),
      };
    } else if (timeRange === "1m") {
      return {
        startDate: now.subtract(1, "month").format("YYYY-MM-DD"),
        endDate: now.format("YYYY-MM-DD"),
      };
    } else if (timeRange === "1y") {
      return {
        startDate: now
          .subtract(1, "year")
          .startOf("month")
          .format("YYYY-MM-DD"),
        endDate: now.format("YYYY-MM-DD"),
      };
    }
    return {
      startDate: now.format("YYYY-MM-DD"),
      endDate: now.format("YYYY-MM-DD"),
    };
  })();

  const isYearlyView = timeRange === "1y";

  const {
    data: dailyViewsRange,
    refetch: refetchDailyRange,
    isLoading: isDailyRangeLoading,
  } = useGetDailyViews(startDate, endDate);

  const { data: monthlyViewsRange, refetch: refetchMonthlyRange } =
    useGetMonthlyViews(startDate, endDate);

  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>(
    dayjs().format("YYYY年MM月DD日 HH:mm:ss")
  );

  const refetchAll = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refetchStatistics(),
        refetchViewsStatistics(),
        isYearlyView ? refetchMonthlyRange() : refetchDailyRange(),
        refetchWordCounts(),
      ]);
      setLastUpdated(dayjs().format("YYYY年MM月DD日 HH:mm:ss"));
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isYearlyView) {
      refetchMonthlyRange();
    } else {
      refetchDailyRange();
    }
  }, [timeRange, refetchDailyRange, refetchMonthlyRange, isYearlyView]);

  const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");

  const yesterdayViews = dailyViewsRange?.find(
    (entry) => entry.date === yesterday
  );

  const dailyViewChartData = !isYearlyView
    ? dailyViewsRange?.map((entry) => ({
        date: entry.date,
        articleViews: entry.articleViews || 0,
        noteViews: entry.noteViews || 0,
        totalViews: (entry.articleViews || 0) + (entry.noteViews || 0),
      })) || []
    : [];

  const monthlyViewChartData = isYearlyView
    ? monthlyViewsRange?.map((entry) => ({
        month: entry.month,
        articleViews: entry.articleViews || 0,
        noteViews: entry.noteViews || 0,
        totalViews: (entry.articleViews || 0) + (entry.noteViews || 0),
      })) || []
    : [];

  const wordCountData = wordCounts
    ? [
        {
          name: "文章",
          value: wordCounts.articleWordCount || 0,
          color: "primary.6",
        },
        {
          name: "随笔",
          value: wordCounts.noteWordCount || 0,
          color: "secondary.6",
        },
        {
          name: "说说",
          value: wordCounts.thoughtWordCount || 0,
          color: "tertiary.6",
        },
      ]
    : [];

  const barChartData = viewsStatistics
    ? [
        {
          total: "阅读总量",
          aritcle: viewsStatistics.articleViews || 0,
          note: viewsStatistics.noteViews || 0,
        },
      ]
    : [];

  return (
    <>
      <PageHeader title="主页" />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "20px",
        }}
      >
        <Button
          onClick={refetchAll}
          disabled={refreshing}
          variant="subtle"
          styles={{
            root: {
              padding: 0,
              height: "auto",
            },
          }}
        >
          <IconRefresh size="1rem" />
        </Button>
        <Text size="sm" c="gray" style={{ marginLeft: "10px" }}>
          数据更新于：{lastUpdated}
        </Text>
      </div>
      <Grid gutter="lg" mt={10}>
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          <StatCard
            icon={<IconEye size={24} />}
            value={
              yesterdayViews
                ? (yesterdayViews.articleViews || 0) +
                  (yesterdayViews.noteViews || 0)
                : 0
            }
            label="昨日阅读量"
            footer={
              <Text size="xs" c="dimmed">
                总阅读量{" "}
                {viewsStatistics &&
                  viewsStatistics.articleViews + viewsStatistics.noteViews}
              </Text>
            }
            isLoading={isDailyRangeLoading}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          <StatCard
            icon={<IconMessage size={24} />}
            value={statistics?.commentCount || 0}
            label="全站评论"
            footer={<Link to="/comment">管理评论</Link>}
            isLoading={isStatisticsLoading}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          <StatCard
            icon={<IconHeart size={24} />}
            value={statistics?.categoryCount || 0}
            label="分类"
            footer={<Link to="/category">管理分类</Link>}
            isLoading={isStatisticsLoading}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          <StatCard
            icon={<IconEye size={24} />}
            value={statistics?.publishedArticleCount || 0}
            label="发布文章"
            footer={<Link to="/content/view">管理文章</Link>}
            isLoading={isStatisticsLoading}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          <StatCard
            icon={<IconArticle size={24} />}
            value={statistics?.publishedNoteCount || 0}
            label="发布随笔"
            footer={<Link to="/content/view">管理随笔</Link>}
            isLoading={isStatisticsLoading}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          <StatCard
            icon={<IconArticle size={24} />}
            value={statistics?.publishedThoughtCount || 0}
            label="发布说说"
            footer={<Link to="/content/view">管理说说</Link>}
            isLoading={isStatisticsLoading}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          <StatCard
            icon={<IconArticle size={24} />}
            value={
              wordCounts
                ? wordCounts.articleWordCount +
                  wordCounts.noteWordCount +
                  wordCounts.thoughtWordCount
                : 0
            }
            label="总字数(已发布)"
            footer={
              <Flex gap={5}>
                <Text size="xs" c="dimmed">
                  文章：{wordCounts?.articleWordCount || 0}
                </Text>
                <Text size="xs" c="dimmed">
                  随笔：{wordCounts?.noteWordCount || 0}
                </Text>
                <Text size="xs" c="dimmed">
                  说说：{wordCounts?.thoughtWordCount || 0}
                </Text>
              </Flex>
            }
            isLoading={isWordCountsLoading}
          />
        </Grid.Col>
      </Grid>

      <SegmentedControl
        data={[
          { label: "近 7 天", value: "7d" },
          { label: "近 1 个月", value: "1m" },
          { label: "过去 1 年", value: "1y" },
        ]}
        value={timeRange}
        onChange={setTimeRange}
        mt="lg"
        classNames={{
          root: style.seg,
        }}
      />

      <Grid gutter="lg" mt={10}>
        <Grid.Col span={{ base: 12 }}>
          <Card
            shadow="sm"
            p="lg"
            style={{ width: "100%" }}
            classNames={{
              root: style.card,
            }}
          >
            <Text size="lg" ta="center" mb="md" fw={500}>
              阅读趋势
            </Text>
            <LineChart
              data={isYearlyView ? monthlyViewChartData : dailyViewChartData}
              dataKey={isYearlyView ? "month" : "date"}
              series={[
                {
                  name: "articleViews",
                  color: "primary.6",
                  label: "文章阅读量",
                },
                {
                  name: "noteViews",
                  color: "secondary.6",
                  label: "随笔阅读量",
                },
                {
                  name: "totalViews",
                  color: "tertiary.6",
                  label: "总阅读量",
                },
              ]}
              curveType="linear"
              h={400}
              withDots
            />
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card
            shadow="sm"
            p="lg"
            style={{ textAlign: "center" }}
            classNames={{
              root: style.card,
            }}
          >
            <Text size="lg" ta="center" mb="md" fw={500}>
              字数组成
            </Text>
            <PieChart
              data={wordCountData}
              h={400}
              withTooltip
              tooltipDataSource="segment"
              mx="auto"
            />
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card
            shadow="sm"
            p="lg"
            style={{ textAlign: "center" }}
            classNames={{
              root: style.card,
            }}
          >
            <Text size="lg" ta="center" mb="md" fw={500}>
              阅读量组成
            </Text>
            <BarChart
              data={barChartData}
              dataKey="total"
              series={[
                { name: "aritcle", color: "primary.6", label: "文章" },
                {
                  name: "note",
                  color: "secondary.6",
                  label: "随笔",
                },
              ]}
              h={400}
            />
          </Card>
        </Grid.Col>
      </Grid>
    </>
  );
};

export default Home;
