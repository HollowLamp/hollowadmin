import {
  Table,
  Button,
  Loader,
  Alert,
  Center,
  Modal,
  Text,
  Group,
  Select,
  TextInput,
} from "@mantine/core";
import { useArticles } from "@/hooks/use-content";
import { useGetAllCategories } from "@/hooks/use-category";
import { format } from "date-fns";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ArticlesTable = () => {
  const navigate = useNavigate();
  const { getAll, remove } = useArticles();
  const { data: categories, isLoading: loadingCategories } =
    useGetAllCategories();
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [selectedArticleId, setSelectedArticleId] = useState<number | null>(
    null
  );
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<number | null>(null);
  const [sortField, setSortField] = useState<"createdAt" | "updatedAt">(
    "createdAt"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");

  const openDeleteModal = (id: number) => {
    setSelectedArticleId(id);
    setDeleteModalOpened(true);
  };

  const handleDelete = () => {
    if (selectedArticleId !== null) {
      remove.mutate(selectedArticleId);
      setDeleteModalOpened(false);
      setSelectedArticleId(null);
    }
  };

  const handleSearch = () => {
    setSearchValue(searchKeyword);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  if (getAll.isLoading || loadingCategories) {
    return <Loader size="lg" />;
  }

  if (getAll.isError || !categories) {
    return (
      <Alert title="加载错误" color="red">
        无法加载文章或分类列表，请稍后重试。
      </Alert>
    );
  }

  let filteredData = statusFilter
    ? getAll.data?.filter((article) => article.status === statusFilter)
    : getAll.data;

  if (categoryFilter && filteredData) {
    filteredData = filteredData.filter(
      (article) => article.categoryId === categoryFilter
    );
  }

  if (searchValue.trim() && filteredData) {
    filteredData = filteredData.filter((article) =>
      article.title.toLowerCase().includes(searchValue.toLowerCase())
    );
  }

  if (filteredData) {
    filteredData = [...filteredData].sort((a, b) => {
      const dateA = new Date(a[sortField]).getTime();
      const dateB = new Date(b[sortField]).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
  }

  return (
    <>
      <Group mb="20px">
        <Select
          placeholder="选择状态"
          data={[
            { value: "published", label: "已发布" },
            { value: "hidden", label: "隐藏" },
          ]}
          value={statusFilter}
          onChange={(value) => setStatusFilter(value)}
        />
        <Select
          placeholder="选择分类"
          data={categories.map((category) => ({
            value: category.id.toString(),
            label: category.name,
          }))}
          value={categoryFilter?.toString() || null}
          onChange={(value) => setCategoryFilter(Number(value))}
        />
        <Select
          placeholder="选择排序字段"
          data={[
            { value: "createdAt", label: "创建时间" },
            { value: "updatedAt", label: "更新时间" },
          ]}
          value={sortField}
          onChange={(value) => setSortField(value as "createdAt" | "updatedAt")}
        />
        <Select
          placeholder="选择排序顺序"
          data={[
            { value: "asc", label: "最早" },
            { value: "desc", label: "最新" },
          ]}
          value={sortOrder}
          onChange={(value) => setSortOrder(value as "asc" | "desc")}
        />
        <TextInput
          placeholder="搜索标题"
          value={searchKeyword}
          onChange={(event) => setSearchKeyword(event.currentTarget.value)}
          onKeyDown={handleKeyDown}
        />
        <Button onClick={handleSearch}>搜索</Button>
      </Group>

      <Table highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>ID</Table.Th>
            <Table.Th>标题</Table.Th>
            <Table.Th>状态</Table.Th>
            <Table.Th>分类</Table.Th>
            <Table.Th>创建时间</Table.Th>
            <Table.Th>更新时间</Table.Th>
            <Table.Th>操作</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {filteredData?.map((article) => (
            <Table.Tr key={article.id}>
              <Table.Td>{article.id}</Table.Td>
              <Table.Td>{article.title}</Table.Td>
              <Table.Td>
                {article.status === "published" ? "已发布" : "隐藏"}
              </Table.Td>
              <Table.Td>
                {
                  categories.find(
                    (category) => category.id === article.categoryId
                  )?.name
                }
              </Table.Td>
              <Table.Td>
                {format(new Date(article.createdAt), "yyyy-MM-dd HH:mm:ss")}
              </Table.Td>
              <Table.Td>
                {format(new Date(article.updatedAt), "yyyy-MM-dd HH:mm:ss")}
              </Table.Td>
              <Table.Td>
                <Center>
                  <Button
                    variant="subtle"
                    onClick={() =>
                      navigate(`/content/edit/${article.id}`, {
                        state: {
                          contentType: "article",
                          title: article.title,
                          slug: article.slug,
                          categoryId: article.categoryId,
                          content: article.content,
                          status: article.status,
                        },
                      })
                    }
                  >
                    编辑
                  </Button>
                  <Button
                    color="red"
                    variant="subtle"
                    onClick={() => openDeleteModal(article.id)}
                  >
                    删除
                  </Button>
                </Center>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <Modal
        opened={deleteModalOpened}
        onClose={() => setDeleteModalOpened(false)}
        title="确认删除"
        centered
      >
        <Text>确定要删除这篇文章吗？此操作不可撤销。</Text>
        <Group mt="md">
          <Button color="red" onClick={handleDelete}>
            确认删除
          </Button>
          <Button variant="outline" onClick={() => setDeleteModalOpened(false)}>
            取消
          </Button>
        </Group>
      </Modal>
    </>
  );
};

export default ArticlesTable;
