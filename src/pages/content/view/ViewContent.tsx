import { Card, Tabs } from "@mantine/core";
import PageHeader from "@/components/pageheader/PageHeader";
import ArticlesTable from "./article/ArticlesTable.tsx";
import NotesTable from "./note/NotesTable.tsx";
import ThoughtsTable from "./thought/ThoughtsTable.tsx";
import style from "./style.module.css";

const ViewContent = () => {
  return (
    <>
      <PageHeader title="查看内容" />
      <Card
        p="xl"
        shadow="xs"
        classNames={{
          root: style.card,
        }}
      >
        <Tabs defaultValue="articles" mt="md">
          <Tabs.List grow>
            <Tabs.Tab value="articles">文章</Tabs.Tab>
            <Tabs.Tab value="notes">随笔</Tabs.Tab>
            <Tabs.Tab value="thoughts">说说</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="articles" pt="xl">
            <ArticlesTable />
          </Tabs.Panel>
          <Tabs.Panel value="notes" pt="xl">
            <NotesTable />
          </Tabs.Panel>
          <Tabs.Panel value="thoughts" pt="xl">
            <ThoughtsTable />
          </Tabs.Panel>
        </Tabs>
      </Card>
    </>
  );
};

export default ViewContent;
