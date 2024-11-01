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
import { useThoughts } from "@/hooks/use-content";
import { format } from "date-fns";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ThoughtTable = () => {
  const navigate = useNavigate();
  const { getAll, remove } = useThoughts();
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [selectedThoughtId, setSelectedThoughtId] = useState<number | null>(
    null
  );
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<string | null>("desc");
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");

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

  let filteredData = statusFilter
    ? getAll.data?.filter((thought) => thought.status === statusFilter)
    : getAll.data;

  if (searchValue.trim() && filteredData) {
    filteredData = filteredData.filter((thought) =>
      thought.content.toLowerCase().includes(searchValue.toLowerCase())
    );
  }

  if (filteredData) {
    filteredData = [...filteredData].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
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
          onChange={setStatusFilter}
        />
        <Select
          placeholder="选择排序"
          data={[
            { value: "asc", label: "最早" },
            { value: "desc", label: "最新" },
          ]}
          value={sortOrder}
          onChange={setSortOrder}
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
          {filteredData?.map((thought) => (
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
