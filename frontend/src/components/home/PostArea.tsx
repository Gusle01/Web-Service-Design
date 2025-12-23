import { Link, useSearchParams } from "react-router-dom";

import { useAxios } from "../../hooks/useAxios";

interface Post {
  id: number;
  title: string;
  category: string;
  username: string;
  desc: string;
  regdate: string;
  thumbnail: string;
}

export default function PostArea() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q");
  const requestUrl = q
    ? `/posts/search?title=${encodeURIComponent(q)}`
    : "/posts";

  const { data, error, isLoading } = useAxios<Post[]>(requestUrl, []);

  if (isLoading) {
    return (
      <section className="posts-area">
        <p>로딩 중...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="posts-area">
        <p>{error}</p>
      </section>
    );
  }

  return (
    <section className="posts-area">
      {data.length === 0 ? (
        <p>작성된 글이 없습니다</p>
      ) : (
        data.map((post) => (
          <article className="posts-area__post" key={post.id}>
            <Link to={`/posts/${post.id}`} className="posts-area__post-link">
              <img
                src={post.thumbnail || "/assets/images/dummy-image-1.png"}
                alt="post-thumbnail"
                className="posts-area__post-image"
              />
              <em className="posts-area__post-tag">{post.category}</em>
              <h2 className="posts-area__post-title">{post.title}</h2>
              <p className="posts-area__post-meta">
                {post.username} • {post.regdate}
              </p>
              <p className="posts-area__post-excerpt">
                {post.desc && post.desc.length > 120
                  ? `${post.desc.slice(0, 120)}...`
                  : post.desc}
              </p>
            </Link>
          </article>
        ))
      )}
    </section>
  );
}
