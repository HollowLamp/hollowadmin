import {
  Table,
  Button,
  Loader,
  Alert,
  Modal,
  Text,
  Group,
  TextInput,
  Pagination,
  Card,
  Center,
  Select,
} from "@mantine/core";
import { useGetAllComments, useDeleteComment } from "@/hooks/use-comment";
import { format } from "date-fns";
import { useState } from "react";
import PageHeader from "@/components/pageheader/PageHeader";
import style from "./style.module.css";
import { Comment } from "@/api/comment/types";

const CommentsTable = () => {
  const [page, setPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const [filterType, setFilterType] = useState<string | undefined>();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const {
    data: commentsData,
    isLoading,
    isError,
    refetch,
  } = useGetAllComments(page, 10, searchValue, filterType, sortOrder);

  const deleteCommentMutation = useDeleteComment();

  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [viewModalOpened, setViewModalOpened] = useState(false);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);

  const openDeleteModal = (id: number) => {
    const foundComment = commentsData?.data.find(
      (comment) => comment.id === id
    );
    setSelectedComment(foundComment || null);
    setDeleteModalOpened(true);
  };

  const openViewModal = (id: number) => {
    const foundComment = commentsData?.data.find(
      (comment) => comment.id === id
    );
    setSelectedComment(foundComment || null);
    setViewModalOpened(true);
  };

  const handleDelete = () => {
    if (selectedComment?.id) {
      deleteCommentMutation.mutate(selectedComment.id, {
        onSuccess: () => {
          setDeleteModalOpened(false);
          refetch();
        },
      });
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

  if (isLoading) {
    return <Loader size="lg" />;
  }

  if (isError) {
    return (
      <Alert title="加载错误" color="red">
        无法加载评论列表，请稍后重试。
      </Alert>
    );
  }

  const comments = commentsData?.data || [];
  const totalItems = commentsData?.total || 0;
  const itemsPerPage = commentsData?.limit || 10;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <>
      <PageHeader title="评论管理" />
      <Card
        p="xl"
        shadow="xs"
        classNames={{
          root: style.card,
        }}
      >
        <Group mb="20px">
          <TextInput
            placeholder="搜索评论内容、ID或Slug"
            value={searchKeyword}
            onChange={(event) => setSearchKeyword(event.currentTarget.value)}
            onKeyDown={handleKeyDown}
          />
          <Select
            placeholder="过滤内容类型"
            data={[
              { value: "article", label: "文章关联" },
              { value: "note", label: "随笔关联" },
              { value: "thought", label: "说说关联" },
              { value: "independent", label: "独立评论" },
            ]}
            value={filterType}
            onChange={(value) => setFilterType(value || undefined)}
          />
          <Select
            placeholder="排序方式"
            data={[
              { value: "asc", label: "正序" },
              { value: "desc", label: "倒序" },
            ]}
            value={sortOrder}
            onChange={(value) =>
              setSortOrder((value as "asc" | "desc") || "desc")
            }
          />
          <Button onClick={handleSearch}>搜索</Button>
        </Group>

        <Table highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>ID</Table.Th>
              <Table.Th>内容类型</Table.Th>
              <Table.Th>评论内容</Table.Th>
              <Table.Th>用户信息</Table.Th>
              <Table.Th>客户端信息</Table.Th> {/* 新列：客户端信息 */}
              <Table.Th>创建时间</Table.Th>
              <Table.Th>操作</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {comments.map((comment) => (
              <Table.Tr key={comment.id}>
                <Table.Td>{comment.id}</Table.Td>
                <Table.Td>
                  {comment.articleSlug
                    ? `文章（${comment.articleSlug}）`
                    : comment.noteId
                    ? `随笔（${comment.noteId}）`
                    : comment.thoughtId
                    ? `说说（${comment.thoughtId}）`
                    : "独立评论"}
                </Table.Td>
                <Table.Td>
                  {comment.content.length > 30
                    ? `${comment.content.slice(0, 30)}...`
                    : comment.content}
                </Table.Td>
                <Table.Td>
                  <div>
                    <Text size="sm">{comment.nickname || "匿名"}</Text>
                    <Text size="xs">{comment.email || "未填写"}</Text>
                    {comment.website ? (
                      <a
                        href={
                          comment.website.startsWith("http")
                            ? comment.website
                            : `http://${comment.website}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {comment.website}
                      </a>
                    ) : (
                      <Text size="xs">无</Text>
                    )}
                  </div>
                </Table.Td>
                <Table.Td>
                  {" "}
                  <div>
                    <Text size="sm">IP: {comment.clientIp || "未知"}</Text>
                    <Text size="xs" style={{ wordBreak: "break-word" }}>
                      User-Agent: {comment.userAgent || "未知"}
                    </Text>
                  </div>
                </Table.Td>
                <Table.Td>
                  {format(new Date(comment.createdAt), "yyyy-MM-dd HH:mm:ss")}
                </Table.Td>
                <Table.Td>
                  <Center>
                    <Button
                      variant="subtle"
                      onClick={() => openViewModal(comment.id)}
                    >
                      查看
                    </Button>
                    <Button
                      color="red"
                      variant="subtle"
                      onClick={() => openDeleteModal(comment.id)}
                    >
                      删除
                    </Button>
                  </Center>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>

        <Pagination
          total={totalPages}
          value={page}
          onChange={setPage}
          mt="md"
        />
        <Modal
          opened={viewModalOpened}
          onClose={() => setViewModalOpened(false)}
          title="评论详情"
          centered
        >
          {selectedComment && (
            <div style={{ padding: "10px" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <strong>ID：</strong>
                  <span>{selectedComment.id}</span>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <strong>内容：</strong>
                  <span style={{ wordBreak: "break-word" }}>
                    {selectedComment.content}
                  </span>
                </div>

                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <strong>创建时间：</strong>
                  <span>
                    {format(
                      new Date(selectedComment.createdAt),
                      "yyyy-MM-dd HH:mm:ss"
                    )}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <strong>用户信息：</strong>
                  <span>
                    {selectedComment.nickname || "匿名"} /{" "}
                    {selectedComment.email || "未填写"} /{" "}
                    {selectedComment.website ? (
                      <a
                        href={
                          selectedComment.website.startsWith("http")
                            ? selectedComment.website
                            : `http://${selectedComment.website}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {selectedComment.website}
                      </a>
                    ) : (
                      <Text size="xs">无</Text>
                    )}
                  </span>
                </div>

                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <strong>客户端 IP：</strong>
                  <span>{selectedComment.clientIp || "未知"}</span>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <strong>User-Agent：</strong>
                  <span style={{ wordBreak: "break-word" }}>
                    {selectedComment.userAgent || "未知"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </Modal>

        <Modal
          opened={deleteModalOpened}
          onClose={() => setDeleteModalOpened(false)}
          title="确认删除"
          centered
        >
          <Text>确定要删除这条评论吗？此操作不可撤销。</Text>
          <Group mt="md">
            <Button color="red" onClick={handleDelete}>
              确认删除
            </Button>
            <Button
              variant="outline"
              onClick={() => setDeleteModalOpened(false)}
            >
              取消
            </Button>
          </Group>
        </Modal>
      </Card>
    </>
  );
};

export default CommentsTable;
