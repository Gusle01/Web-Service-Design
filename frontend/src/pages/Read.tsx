import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useAuthStore } from "../stores/useAuthStore";
import RecommendationItem from "../components/read/RecommendationItem";

interface Post {
  id: number;
  title: string;
  category: string;
  username: string;
  desc: string;
  regdate: string;
  thumbnail: string;
  authorEmail: string;
}

const Read = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const currentUser = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts/${id}`);
        if (!res.ok) {
          setPost(null);
          setIsLoading(false);
          return;
        }
        const data: Post = await res.json();
        setPost(data);
        fetchRelatedPosts(data);
      } catch (error) {
        console.error(error);
        setPost(null);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchRelatedPosts = async (currentPost: Post) => {
      try {
        const res = await fetch("/api/posts");
        if (!res.ok) {
          setRelatedPosts([]);
          return;
        }
        const data: Post[] = await res.json();
        const filtered = data.filter(
          (item) =>
            item.id !== currentPost.id &&
            item.category === currentPost.category
        );
        setRelatedPosts(filtered);
      } catch (error) {
        console.error(error);
        setRelatedPosts([]);
      }
    };

    if (id) {
      fetchPost();
    } else {
      setIsLoading(false);
    }
  }, [id]);


  const isAuthor =
    post &&
    currentUser?.email?.trim() !== "" &&
    currentUser?.email?.trim() === post.authorEmail.trim();

  const handleDelete = async () => {
    if (!post) {
      return;
    }

    try {
      if (!accessToken) {
        alert("로그인이 필요합니다");
        return;
      }

      const res = await fetch(`/api/posts/${post.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!res.ok) {
        const error = await res.json();
        alert(error?.message ?? "글 삭제에 실패했습니다.");
        return;
      }
      alert("글이 삭제되었습니다");
      navigate("/", { replace: true });
    } catch (error) {
      console.error(error);
      alert("글 삭제 중 오류가 발생했습니다.");
    }
  };

  if (isLoading) {
    return (
      <main className="page__main">
        <p>로딩 중...</p>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="page__main">
        <p>게시글을 찾을 수 없습니다.</p>
      </main>
    );
  }

  return (
    <main className="page__main">
      <section className="page__read">
        <em className="page__read-tag">{post.category}</em>
        <h2 className="page__read-title">{post.title}</h2>
        <div className="page__read-meta-group">
          <p className="page__read-meta">{post.regdate}</p>
          {isAuthor ? (
            <button type="button" className="page__read-btn" onClick={handleDelete}>
              삭제
            </button>
          ) : null}
        </div>
        <div className="page__read-profile">
          <span className="page__read-profile--name">{post.username}</span>
        </div>
        <img
          src={post.thumbnail}
          alt="post-thumbnail"
          className="page__read-image"
        />
        <div className="page__read-desc">
          <p>{post.desc}</p>
        </div>
      </section>
      <section className="page__recommend">
        <h3 className="page__recommend-title">추천 글</h3>
        {relatedPosts.length === 0 ? (
          <p>추천 글이 없습니다.</p>
        ) : (
          <ul className="page__recommend-lists">
            {relatedPosts.map((item) => (
              <RecommendationItem
                key={item.id}
                id={item.id}
                title={item.title}
                desc={item.desc}
                thumbnail={item.thumbnail}
              />
            ))}
          </ul>
        )}
      </section>
    </main>
  );
};

export default Read;
