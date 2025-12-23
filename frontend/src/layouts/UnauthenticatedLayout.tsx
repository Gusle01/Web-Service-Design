import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { useAuthStore } from "../stores/useAuthStore";

const UnauthenticatedLayout = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [isAllowed, setIsAllowed] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
      return;
    }
    setIsAllowed(true);
  }, [navigate, user]);

  if (!isAllowed) {
    return null;
  }

  return <Outlet />;
};

export default UnauthenticatedLayout;
