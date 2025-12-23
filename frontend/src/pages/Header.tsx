import { Link, useNavigate } from "react-router-dom";

import { useAuthStore } from "../stores/useAuthStore";
import { axiosInstance } from "../api/axiosInstance";

const Header = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const unsetAuth = useAuthStore((state) => state.unsetAuth);
  const isLoggedIn = Boolean(user);

  const handleLogout = async () => {
    try {
      const { status } = await axiosInstance.post("/logout");
      if (status !== 200) {
        throw new Error("로그아웃에 실패했습니다.");
      }
      unsetAuth();
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("로그아웃 중 오류 발생");
    }
  };

  return (
    <header className="page__header">
      {/* 로고 */}
      <h1 className="page__logo">
        <Link to="/" className="page__logo-link">
          JBNU
        </Link>
      </h1>

      {/* 네비게이션 */}
      <nav className="page__navigation">
        <ul className="page__nav-list">
          <li className="page__nav-item">
            <Link to="/write" className="page__nav-link">
              글쓰기
            </Link>
          </li>
          {isLoggedIn ? (
            <li className="page__nav-item">
              <button
                type="button"
                className="page__nav-link"
                onClick={handleLogout}
              >
                로그아웃
              </button>
            </li>
          ) : (
            <li className="page__nav-item">
              <Link to="/auth" className="page__nav-link">
                인증
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
