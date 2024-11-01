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
  Pagination,
} from "@mantine/core";
import { useThoughts } from "@/hooks/use-content";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ThoughtTable = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");

  const { getAll, remove, refetch } = useThoughts(
    page,
    10,
    statusFilter,
    sortOrder,
    searchValue
  );
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [selectedThoughtId, setSelectedThoughtId] = useState<number | null>(
    null
  );

  useEffect(() => {
    refetch();
  }, [page, statusFilter, sortOrder, searchValue, refetch]);

  const openDeleteModal = (id: number) => {
    setSelectedThoughtId(id);
    setDeleteModalOpened(true);
  };

  const handleDelete = () => {
    if (selectedThoughtId !== null) {
      remove.mutate(selectedThoughtId);
      setDeleteModalOpened(false);
      setSelectedThoughtId(null);
    }
  };

  const handleSearch = () => {
    setPage(1);
    setSearchValue(searchKeyword);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  if (getAll.isLoading) {
    return <Loader size="lg" />;
  }

  if (getAll.isError) {
    return (
      <Alert title="加载错误" color="red">
        无法加载说说列表，请稍后重试。
      </Alert>
    );
  }

  const thoughtsData = getAll.data?.data || [];
  const totalItems = getAll.data?.total || 0;
  const itemsPerPage = getAll.data?.limit || 10;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

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
          onChange={(value) => setStatusFilter(value ?? undefined)}
        />
        <Select
          placeholder="选择排序"
          data={[
            { value: "asc", label: "最早" },
            { value: "desc", label: "最新" },
          ]}
          value={sortOrder}
          onChange={(value) => setSortOrder(value as "asc" | "desc")}
        />
        <TextInput
          placeholder="搜索内容"
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
            <Table.Th>状态</Table.Th>
            <Table.Th>创建时间</Table.Th>
            <Table.Th>操作</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {thoughtsData.map((thought) => (
            <Table.Tr key={thought.id}>
              <Table.Td>{thought.id}</Table.Td>
              <Table.Td>
                {thought.status === "published" ? "已发布" : "隐藏"}
              </Table.Td>
              <Table.Td>
                {format(new Date(thought.createdAt), "yyyy-MM-dd HH:mm:ss")}
              </Table.Td>
              <Table.Td>
                <Center>
                  <Button
                    variant="subtle"
                    onClick={() =>
                      navigate(`/content/edit/${thought.id}`, {
                        state: {
                          contentType: "thought",
                          content: thought.content,
                          status: thought.status,
                        },
                      })
                    }
                  >
                    编辑
                  </Button>
                  <Button
                    color="red"
                    variant="subtle"
                    onClick={() => openDeleteModal(thought.id)}
                  >
                    删除
                  </Button>
                </Center>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <Pagination total={totalPages} value={page} onChange={setPage} mt="md" />

      <Modal
        opened={deleteModalOpened}
        onClose={() => setDeleteModalOpened(false)}
        title="确认删除"
        centered
      >
        <Text>确定要删除这条说说吗？此操作不可撤销。</Text>
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

export default ThoughtTable;
