import PageHeader from "@/components/pageheader/PageHeader";
import {
  Button,
  Card,
  Flex,
  Group,
  Modal,
  TextInput,
  Title,
  Loader,
  Alert,
  Table,
  Center,
  Space,
  Text,
  Pagination,
} from "@mantine/core";
import style from "./style.module.css";
import { useState } from "react";
import { useForm } from "@mantine/form";
import {
  useGetAllCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/hooks/use-category";
import {
  Category as CategoryType,
  CreateCategoryDto,
  UpdateCategoryDto,
} from "@/api/category/types";

const Category = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [createModalOpened, setCreateModalOpened] = useState(false);
  const [editModalOpened, setEditModalOpened] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryType | null>(
    null
  );
  const {
    data: paginatedResponse,
    isLoading,
    error,
  } = useGetAllCategories(page, limit);
  const categories = paginatedResponse?.data || [];
  const totalItems = paginatedResponse?.total || 0;
  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [deletingCategoryId, setDeletingCategoryId] = useState<number | null>(
    null
  );

  const createForm = useForm<CreateCategoryDto>({
    initialValues: {
      name: "",
      slug: "",
    },
    validate: {
      name: (value) => (value ? null : "名称不能为空"),
      slug: (value) =>
        /^[a-zA-Z0-9_]+$/.test(value)
          ? null
          : "Slug 只能包含字母、数字和下划线",
    },
  });

  const editForm = useForm<UpdateCategoryDto>({
    initialValues: {
      name: "",
      slug: "",
    },
    validate: {
      slug: (value) =>
        !value || /^[a-zA-Z0-9_]+$/.test(value)
          ? null
          : "Slug 只能包含字母、数字和下划线",
    },
    transformValues: (values) => {
      const filteredEntries = Object.entries(values).filter(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, value]) => value !== undefined && value !== null && value !== ""
      );
      return Object.fromEntries(filteredEntries) as UpdateCategoryDto;
    },
  });

  const handleCreateSubmit = (values: CreateCategoryDto) => {
    createCategoryMutation.mutate(values, {
      onSuccess: () => setCreateModalOpened(false),
    });
    createForm.reset();
  };

  const handleEditSubmit = () => {
    if (editingCategory) {
      const filteredValues = editForm.getTransformedValues();
      updateCategoryMutation.mutate(
        {
          id: editingCategory.id,
          categoryData: filteredValues,
        },
        {
          onSuccess: () => setEditModalOpened(false),
        }
      );
      setEditingCategory(null);
      editForm.reset();
    }
  };

  const handleEditCategory = (category: CategoryType) => {
    setEditingCategory(category);
    editForm.setValues({ name: category.name, slug: category.slug });
    setEditModalOpened(true);
  };

  const handleDeleteCategory = (id: number) => {
    setDeletingCategoryId(id);
    setDeleteModalOpened(true);
  };

  const confirmDeleteCategory = () => {
    if (deletingCategoryId !== null) {
      deleteCategoryMutation.mutate(deletingCategoryId, {
        onSuccess: () => setDeleteModalOpened(false),
      });
      setDeletingCategoryId(null);
    }
  };

  return (
    <>
      <PageHeader title="分类" />
      <Card
        p="xl"
        shadow="xs"
        classNames={{
          root: style.card,
        }}
      >
        <Card.Section withBorder py="xs">
          <Flex justify="space-between">
            <Title order={2}>分类列表</Title>
            <Button onClick={() => setCreateModalOpened(true)}>添加分类</Button>
          </Flex>
        </Card.Section>

        {isLoading ? (
          <Loader size="lg" className={style.loader} />
        ) : error ? (
          <Alert title="加载错误" color="red">
            无法加载分类列表，请稍后重试。
          </Alert>
        ) : (
          <>
            <Card.Section>
              <Table withRowBorders={false} highlightOnHover>
                <Table.Tbody>
                  {categories.map((category) => (
                    <Table.Tr key={category.id}>
                      <Table.Td>
                        <Center>
                          <Title order={4}>{category.name}</Title>
                          <Space w="xl" />
                          <p className={style.slug}>{category.slug}</p>
                        </Center>
                      </Table.Td>
                      <Table.Td>
                        <Text>文章数：{category.articleCount}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Center>
                          <Button
                            variant="subtle"
                            onClick={() => handleEditCategory(category)}
                          >
                            编辑
                          </Button>
                          <Button
                            color="red"
                            variant="subtle"
                            onClick={() => handleDeleteCategory(category.id)}
                          >
                            删除
                          </Button>
                        </Center>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Card.Section>
            <Center>
              <Pagination
                total={Math.ceil(totalItems / limit)}
                value={page}
                onChange={setPage}
                mt="md"
              />
            </Center>
          </>
        )}
      </Card>

      <Modal
        opened={createModalOpened}
        onClose={() => setCreateModalOpened(false)}
        title="添加分类"
        centered
      >
        <form onSubmit={createForm.onSubmit(handleCreateSubmit)}>
          <TextInput
            label="名称"
            placeholder="输入分类名称"
            {...createForm.getInputProps("name")}
          />
          <TextInput
            label="Slug"
            placeholder="输入分类 Slug"
            {...createForm.getInputProps("slug")}
          />
          <Group mt="md">
            <Button type="submit">创建</Button>
            <Button
              variant="outline"
              onClick={() => setCreateModalOpened(false)}
            >
              取消
            </Button>
          </Group>
        </form>
      </Modal>

      <Modal
        opened={editModalOpened}
        onClose={() => setEditModalOpened(false)}
        title="编辑分类"
        centered
      >
        <form onSubmit={editForm.onSubmit(handleEditSubmit)}>
          <TextInput
            label="名称"
            placeholder="输入分类名称"
            {...editForm.getInputProps("name")}
          />
          <TextInput
            label="Slug"
            placeholder="输入分类 Slug"
            {...editForm.getInputProps("slug")}
          />
          <Group mt="md">
            <Button type="submit">保存</Button>
            <Button variant="outline" onClick={() => setEditModalOpened(false)}>
              取消
            </Button>
          </Group>
        </form>
      </Modal>

      <Modal
        opened={deleteModalOpened}
        onClose={() => setDeleteModalOpened(false)}
        title="确认删除"
        centered
      >
        <p>确定要删除此分类吗？此操作不可撤销。</p>
        <Group mt="md">
          <Button color="red" onClick={confirmDeleteCategory}>
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

export default Category;
