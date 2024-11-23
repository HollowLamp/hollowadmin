import React, { useState } from "react";
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
  Drawer,
  ScrollArea,
  Divider,
} from "@mantine/core";
import { useGetAllComments, useDeleteComment } from "@/hooks/use-comment";
import { format } from "date-fns";
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
  const [viewDrawerOpened, setViewDrawerOpened] = useState(false);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);

  const openDeleteModal = (id: number) => {
    const foundComment = commentsData?.data.find(
      (comment) => comment.id === id
    );
    setSelectedComment(foundComment || null);
    setDeleteModalOpened(true);
  };

  const openViewDrawer = (id: number) => {
    const foundComment = commentsData?.data.find(
      (comment) => comment.id === id
    );
    setSelectedComment(foundComment || null);
    setViewDrawerOpened(true);
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
      <Alert title="加载错误" c="red">
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
        <Table.ScrollContainer minWidth={500}>
          <Table highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>ID</Table.Th>
                <Table.Th>内容类型</Table.Th>
                <Table.Th>评论内容</Table.Th>
                <Table.Th>用户信息</Table.Th>
                <Table.Th>客户端信息</Table.Th>
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
                    <div>
                      <Text size="sm">IP: {comment.clientIp || "未知"}</Text>
                      <Text size="xs" style={{ wordBreak: "break-word" }}>
                        User-Agent:{" "}
                        {comment.userAgent && comment.userAgent.length > 10
                          ? `${comment.userAgent.slice(0, 10)}...`
                          : comment.userAgent || "未知"}
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
                        onClick={() => openViewDrawer(comment.id)}
                      >
                        查看
                      </Button>
                      <Button
                        c="red"
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
        </Table.ScrollContainer>
        <Pagination
          total={totalPages}
          value={page}
          onChange={setPage}
          mt="md"
        />
        <Modal
          opened={deleteModalOpened}
          onClose={() => setDeleteModalOpened(false)}
          title="确认删除"
          centered
        >
          <Text>确定要删除这条评论吗？此操作不可撤销。</Text>
          <Group mt="md">
            <Button c="red" onClick={handleDelete}>
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

        <Drawer
          opened={viewDrawerOpened}
          onClose={() => setViewDrawerOpened(false)}
          title="评论详情"
          padding="xl"
          size="sm"
          position="right"
        >
          <ScrollArea style={{ height: "100%" }}>
            {selectedComment && (
              <div style={{ padding: "10px" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "15px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <Text size="sm" c="dimmed">
                      <strong>ID：</strong>
                    </Text>
                    <Text>{selectedComment.id}</Text>
                  </div>

                  <Divider my="sm" />

                  <div>
                    <Text size="sm" c="dimmed">
                      <strong>内容：</strong>
                    </Text>
                    <Text style={{ wordBreak: "break-word", marginTop: "5px" }}>
                      {selectedComment.content}
                    </Text>
                  </div>

                  <Divider my="sm" />

                  <div>
                    <Text size="sm" c="dimmed">
                      <strong>用户信息：</strong>
                    </Text>
                    <div style={{ marginTop: "5px" }}>
                      <Text size="sm">
                        昵称：{selectedComment.nickname || "匿名"}
                      </Text>
                      <Text size="sm">
                        邮箱：{selectedComment.email || "未填写"}
                      </Text>
                      <Text size="sm">
                        网站：
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
                          "无"
                        )}
                      </Text>
                    </div>
                  </div>

                  <Divider my="sm" />

                  <div>
                    <Text size="sm" c="dimmed">
                      <strong>客户端信息：</strong>
                    </Text>
                    <div style={{ marginTop: "5px" }}>
                      <Text size="sm">
                        IP：{selectedComment.clientIp || "未知"}
                      </Text>
                      <Text size="sm">
                        User-Agent：
                        {selectedComment.userAgent &&
                        selectedComment.userAgent?.length > 20
                          ? `${selectedComment.userAgent.slice(0, 20)}...`
                          : selectedComment.userAgent || "未知"}
                      </Text>
                    </div>
                  </div>

                  <Divider my="sm" />

                  <div>
                    <Text size="sm" c="dimmed">
                      <strong>创建时间：</strong>
                    </Text>
                    <Text>
                      {format(
                        new Date(selectedComment.createdAt),
                        "yyyy-MM-dd HH:mm:ss"
                      )}
                    </Text>
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>
        </Drawer>
      </Card>
    </>
  );
};

export default CommentsTable;
