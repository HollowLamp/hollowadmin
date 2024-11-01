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
import { useNotes } from "@/hooks/use-content";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NotesTable = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );
  const [sortField, setSortField] = useState<"createdAt" | "updatedAt">(
    "createdAt"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");

  const { getAll, remove, refetch } = useNotes(
    page,
    10,
    statusFilter,
    sortField,
    sortOrder,
    searchValue
  );
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);

  useEffect(() => {
    refetch();
  }, [page, statusFilter, sortField, sortOrder, searchValue, refetch]);

  const openDeleteModal = (id: number) => {
    setSelectedNoteId(id);
    setDeleteModalOpened(true);
  };

  const handleDelete = () => {
    if (selectedNoteId !== null) {
      remove.mutate(selectedNoteId);
      setDeleteModalOpened(false);
      setSelectedNoteId(null);
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
        无法加载随笔列表，请稍后重试。
      </Alert>
    );
  }

  const notesData = getAll.data?.data || [];
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
            <Table.Th>创建时间</Table.Th>
            <Table.Th>更新时间</Table.Th>
            <Table.Th>操作</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {notesData.map((note) => (
            <Table.Tr key={note.id}>
              <Table.Td>{note.id}</Table.Td>
              <Table.Td>{note.title}</Table.Td>
              <Table.Td>
                {note.status === "published" ? "已发布" : "隐藏"}
              </Table.Td>
              <Table.Td>
                {format(new Date(note.createdAt), "yyyy-MM-dd HH:mm:ss")}
              </Table.Td>
              <Table.Td>
                {format(new Date(note.updatedAt), "yyyy-MM-dd HH:mm:ss")}
              </Table.Td>
              <Table.Td>
                <Center>
                  <Button
                    variant="subtle"
                    onClick={() =>
                      navigate(`/content/edit/${note.id}`, {
                        state: {
                          contentType: "note",
                          title: note.title,
                          content: note.content,
                          status: note.status,
                        },
                      })
                    }
                  >
                    编辑
                  </Button>
                  <Button
                    color="red"
                    variant="subtle"
                    onClick={() => openDeleteModal(note.id)}
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
        <Text>确定要删除这条随笔吗？此操作不可撤销。</Text>
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

export default NotesTable;
