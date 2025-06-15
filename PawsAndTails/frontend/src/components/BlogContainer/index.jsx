import { Col, Row, Spin } from "antd";
import { useGetAllBlogsByFiltersQuery } from "../../apis/blogs";
import PostCard from "./PostCard";
const BlogContainer = ({ category }) => {
  const { data, isLoading, isFetching } = useGetAllBlogsByFiltersQuery(
    {
      category,
    },
    { skip: !category }
  );

  return (
    <>
      {isFetching || isLoading ? (
        <div className="empty-state">
          <Spin />
        </div>
      ) : (
        <Row gutter={32} align="stretch">
          {data?.blogs?.map((item) => (
            <Col span={8}>
              <PostCard key={item._id} {...item} />
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};

export default BlogContainer;
