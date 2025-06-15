import { useState } from "react";
import { Table, Button, Image, Flex, Modal, Input } from "antd";
import AddBlogModal from "../components/Modals/AddBlogModal";

import {
  useGetAllBlogsByFiltersQuery,
  useDeleteBlogMutation,
} from "../apis/blogs";
import { loadImageFromServer } from "../utils/common";

const DashboardBlogs = () => {
  const { Search } = Input;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productId, setBlogId] = useState("");
  const [searchText, setSearchText] = useState("");
  const [deleteBlog] = useDeleteBlogMutation();

  const { data, isLoading, isFetching } = useGetAllBlogsByFiltersQuery({
    search: searchText,
  });

  const columns = [
    {
      title: "Image",
      render: ({ image }) => (
        <Image width={80} src={loadImageFromServer(image)} />
      ),
      key: "image",
    },
    { title: "Title", dataIndex: "title", key: "title" },
    {
      title: "Description",
      key: "content",
      render: ({ content }) => <p className="truncate">{content}</p>,
    },
    { title: "Category", dataIndex: "category", key: "category" },
    {
      title: "Action",
      key: "action",
      render: ({ _id }) => (
        <Flex gap={12}>
          <Button
            variant="solid"
            color="danger"
            onClick={() => {
              setBlogId(_id);
              setIsDeleteModalOpen(true);
            }}
          >
            Delete
          </Button>
          <Button
            variant="solid"
            color="cyan"
            onClick={() => {
              setBlogId(_id);
              setIsModalOpen(true);
            }}
          >
            Edit
          </Button>
        </Flex>
      ),
    },
  ];

  const handleDelete = async () => {
    setConfirmLoading(true);
    const res = await deleteBlog({ id: productId });
    if (res?.data?.message === "Blog deleted") {
      setConfirmLoading(false);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div>
      <h2 style={{ paddingBottom: "16px" }}>Blogs</h2>
      <Flex
        justify="space-between"
        align="center"
        style={{ paddingBottom: "16px" }}
      >
        <Search
          placeholder="Search Blog"
          loading={isLoading || isFetching}
          style={{ maxWidth: "300px" }}
          onSearch={(evt) => {
            setSearchText(evt);
          }}
          allowClear={true}
        />
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          Add Blog
        </Button>
      </Flex>

      {isLoading || isFetching ? (
        <p>Loading...</p>
      ) : (
        <>
          <Table
            dataSource={data?.blogs || []}
            columns={columns}
            rowKey="_id"
            pagination={false}
          />
        </>
      )}
      <AddBlogModal
        open={isModalOpen}
        onClose={() => {
          setBlogId("");
          setIsModalOpen(false);
        }}
        id={productId}
      />
      <Modal
        title="Are you sure delete this Blog?"
        open={isDeleteModalOpen}
        onOk={handleDelete}
        confirmLoading={confirmLoading}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setBlogId("");
        }}
      />
    </div>
  );
};

export default DashboardBlogs;
