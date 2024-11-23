import PageHeader from "@/components/pageheader/PageHeader";
import {
  Card,
  Grid,
  Text,
  Group,
  ThemeIcon,
  Button,
  Title,
} from "@mantine/core";
import {
  IconEye,
  IconMessage,
  IconHeart,
  IconArticle,
  IconRefresh,
} from "@tabler/icons-react";
import { useGetAllCategories } from "@/hooks/use-category";
import { useGetAllComments } from "@/hooks/use-comment";
import { useArticles, useNotes, useThoughts } from "@/hooks/use-content";
import { useState } from "react";
import dayjs from "dayjs";
import style from "./style.module.css";
import { Link } from "react-router-dom";

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  footer: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label, footer }) => {
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
          <Title size="xl" w={700} pl={5}>
            {value}
          </Title>
        </div>
      </Group>
      <Text size="xs" mt="sm" c="gray">
        {footer}
      </Text>
    </Card>
  );
};

const Home: React.FC = () => {
  const { data: categoriesData, refetch: refetchCategories } =
    useGetAllCategories(1, 10);
  const { data: commentsData, refetch: refetchComments } = useGetAllComments(
    1,
    10
  );
  const { getAll: articles } = useArticles(1, 10, "published");
  const { getAll: notes } = useNotes(1, 10, "published");
  const { getAll: thoughts } = useThoughts(1, 10, "published");

  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>(
    dayjs().format("YYYY年MM月DD日 HH:mm:ss")
  );

  const refetchAll = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refetchCategories(),
        refetchComments(),
        articles.refetch(),
        notes.refetch(),
        thoughts.refetch(),
      ]);
      setLastUpdated(dayjs().format("YYYY年MM月DD日 HH:mm:ss"));
    } finally {
      setRefreshing(false);
    }
  };

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
            icon={<IconMessage size={24} />}
            value={commentsData?.total || "加载中..."}
            label="全站评论"
            footer={<Link to="/comment">管理评论</Link>}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          <StatCard
            icon={<IconHeart size={24} />}
            value={categoriesData?.total || "加载中..."}
            label="分类"
            footer={<Link to="/category">管理分类</Link>}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          <StatCard
            icon={<IconEye size={24} />}
            value={articles?.data?.total || "加载中..."}
            label="发布文章"
            footer={<Link to="/content/view">管理文章</Link>}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          <StatCard
            icon={<IconArticle size={24} />}
            value={notes?.data?.total || "加载中..."}
            label="发布随笔"
            footer={<Link to="/content/view">管理随笔</Link>}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          <StatCard
            icon={<IconArticle size={24} />}
            value={thoughts?.data?.total || "加载中..."}
            label="发布说说"
            footer={<Link to="/content/view">管理说说</Link>}
          />
        </Grid.Col>
      </Grid>
    </>
  );
};

export default Home;
