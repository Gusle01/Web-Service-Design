import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { axiosInstance } from "../api/axiosInstance";
import { useAuthStore } from "../stores/useAuthStore";

const Write = () => {
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const [title, setTitle] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [desc, setDesc] = useState<string>("");

  const encodeFileToBase64 = (image: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = (event) => {
        const target = event.target as FileReader | null;
        if (target && target.result) {
          resolve(target.result as string);
        } else {
          reject(new Error("File reading failed"));
        }
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = (event.target.files && event.target.files[0]) || null;
    if (!file) {
      setThumbnail(null);
      return;
    }

    try {
      const convertedFile = await encodeFileToBase64(file);
      setThumbnail(convertedFile);
    } catch (error) {
      console.error(error);
      alert("이미지 처리 중 오류가 발생했습니다.");
      setThumbnail(null);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title || !category || !thumbnail || !desc || !username) {
      alert("입력 값이 누락되었습니다.");
      return;
    }

    if (!accessToken) {
      alert("로그인이 필요합니다");
      navigate("/auth", { replace: true });
      return;
    }

    try {
      const { status } = await axiosInstance.post(
        "/posts",
        {
          title,
          category,
          thumbnail,
          desc,
          username,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (status === 201) {
        alert("글이 등록되었습니다.");
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      alert("글 등록에 실패했습니다.");
    }
  };

  return (
    <main className="page__main">
      <div className="page__write">
        <h2 className="page__write-text">새로운 글 작성</h2>
        <form onSubmit={handleSubmit}>
          <div className="page__write-form">
            <div className="page__write-group">
              <label htmlFor="title" className="page__write-label">
                제목
              </label>
              <input
                type="text"
                name="title"
                id="title"
                className="page__write-input"
                placeholder="Type product name"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="category" className="page__write-label">
                카테고리
              </label>
              <select
                id="category"
                className="page__write-select"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                required
              >
                <option value="">Select category</option>
                <option value="Travel">Travel</option>
                <option value="Food">Food</option>
                <option value="Life">Life</option>
              </select>
            </div>
            <div>
              <label htmlFor="writer" className="page__write-label">
                작성자
              </label>
              <input
                type="text"
                name="writer"
                id="writer"
                className="page__write-input"
                placeholder="Type product name"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
              />
            </div>
            <div className="page__write-group">
              <div>
                <label htmlFor="user_avatar" className="page__write-label">
                  썸네일
                </label>
                <label className="page__write-file--hidden" htmlFor="user_avatar">
                  Upload file
                </label>
                <input
                  className="page__write-file"
                  aria-describedby="user_avatar_help"
                  id="user_avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                />
                {thumbnail ? (
                  <img
                    src={thumbnail}
                    alt="thumbnail-preview"
                    className="page__write-image"
                  />
                ) : null}
              </div>
            </div>
            <div className="page__write-group">
              <label htmlFor="description" className="page__write-label">
                내용
              </label>
              <textarea
                id="description"
                className="page__write-textarea"
                placeholder="Your description here"
                value={desc}
                onChange={(event) => setDesc(event.target.value)}
                required
              ></textarea>
            </div>
          </div>
          <button type="submit" className="page--btn">
            글등록
          </button>
        </form>
      </div>
    </main>
  );
};

export default Write;
