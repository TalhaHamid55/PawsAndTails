import { Link, useParams } from "react-router-dom";
import { useGetAllBlogsQuery, useGetBlogByIdQuery } from "../apis/blogs";
import { Image } from "antd";
import { loadImageFromServer } from "../utils/common";
import "./styles/single-post-style.css";

const SinglePost = () => {
  const param = useParams();

  const { data, isLoading, isFetching } = useGetBlogByIdQuery(
    { id: param.id },
    { skip: !param.id }
  );

  const { data: blogsList } = useGetAllBlogsQuery();

  return (
    <div className="post-container">
      <div className="post-container-sidebar">
        <ul>
          {(blogsList?.blogs || []).map((k) => (
            <li className={k._id === param.id ? "active" : ""}>
              <Link to={`/single-post/${k._id}`}>{k?.title || ""}</Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="post-content">
        <h1>{data?.blog?.title || ""}</h1>
        <Image
          preview={false}
          src={loadImageFromServer(data?.blog?.image || "")}
        />
        <p>{data?.blog?.content}</p>
      </div>
    </div>
  );
};

export default SinglePost;
