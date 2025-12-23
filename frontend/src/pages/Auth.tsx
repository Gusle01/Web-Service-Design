import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { axiosInstance } from "../api/axiosInstance";
import { useAuthStore } from "../stores/useAuthStore";

const Auth = () => {
  const navigate = useNavigate();
  const [pageType, setPageType] = useState<"login" | "register">("login");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const setAuth = useAuthStore((state) => state.setAuth);

  const handlePageChange = (
    type: "login" | "register",
    options?: { keepEmail?: boolean }
  ) => {
    if (!options?.keepEmail) {
      setEmail("");
    }
    setPassword("");
    setPasswordConfirm("");
    setUsername("");
    setPageType(type);
  };

  /* =======================
     API FUNCTIONS
     ======================= */

  // 로그인
  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const { data } = await axiosInstance.post("/login", {
        email,
        password,
      });

      console.log(data);
      setAuth(data.user, data.accessToken);
      window.dispatchEvent(new Event("auth-change"));
      alert("로그인 성공");
      navigate("/", { replace: true });
    } catch (error) {
      console.error(error);
      alert("로그인 중 오류 발생");
    }
  };

  // 회원가입
  const handleSignup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (email === "" || password === "" || username === "") {
      alert("모든 항목을 입력해 주세요.");
      return;
    }

    const isValidEmail = (value: string) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    if (!isValidEmail(email)) {
      alert("이메일 형식이 올바르지 않습니다.");
      return;
    }

    if (password !== passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const { data } = await axiosInstance.post("/register", {
        email,
        username,
        password,
      });

      if (data) {
        alert("회원가입을 완료했습니다.\n로그인 후 이용해 주세요.");
        handlePageChange("login", { keepEmail: true });
      }
    } catch (error) {
      console.error(error);
      alert("회원가입 중 오류 발생");
    }
  };

  return (
    <main className="page__main">
      <article className="page-auth">
        <section className="page-auth__container">
          <nav className="page-auth__toggle">
            <button
              type="button"
              className={`page-auth__toggle-button ${
                pageType === "login" ? "page-auth__toggle-button--active" : ""
              }`}
              onClick={() => handlePageChange("login")}
            >
              로그인
            </button>
            <button
              type="button"
              className={`page-auth__toggle-button ${
                pageType === "register"
                  ? "page-auth__toggle-button--active"
                  : ""
              }`}
              onClick={() => handlePageChange("register")}
            >
              회원가입
            </button>
          </nav>

          <div className="page-auth__form-section">
            <form
              className={`auth-form ${
                pageType === "login" ? "auth-form--active" : ""
              }`}
              onSubmit={handleLogin}
            >
              <label htmlFor="login-email" className="a11y-hidden">
                이메일
              </label>
              <input
                type="email"
                id="login-email"
                className="auth-form__input"
                placeholder="이메일"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />

              <label htmlFor="login-password" className="a11y-hidden">
                비밀번호
              </label>
              <input
                type="password"
                id="login-password"
                className="auth-form__input"
                placeholder="비밀번호"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />

              <button type="submit" className="auth-form__submit">
                로그인
              </button>
            </form>

            <form
              className={`auth-form ${
                pageType === "register" ? "auth-form--active" : ""
              }`}
              onSubmit={handleSignup}
            >
              <label htmlFor="signup-email" className="a11y-hidden">
                이메일
              </label>
              <input
                type="email"
                id="signup-email"
                className="auth-form__input"
                placeholder="이메일"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
              <label htmlFor="signup-name" className="a11y-hidden">
                이름
              </label>
              <input
                type="text"
                id="signup-name"
                className="auth-form__input"
                placeholder="이름"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
              />
              <label htmlFor="signup-password" className="a11y-hidden">
                비밀번호
              </label>
              <input
                type="password"
                id="signup-password"
                className="auth-form__input"
                placeholder="비밀번호"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />

              <label
                htmlFor="signup-confirm-password"
                className="a11y-hidden"
              >
                비밀번호 확인
              </label>
              <input
                type="password"
                id="signup-confirm-password"
                className="auth-form__input"
                placeholder="비밀번호 확인"
                value={passwordConfirm}
                onChange={(event) => setPasswordConfirm(event.target.value)}
                required
              />

              <button type="submit" className="auth-form__submit">
                회원가입
              </button>
            </form>
          </div>
        </section>
      </article>
    </main>
  );
};

export default Auth;
