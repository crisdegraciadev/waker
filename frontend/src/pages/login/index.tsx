import { CenteredLayout } from "@/core/components/layouts/centered";
import { LoginForm } from "./components/login-form";
import { useEffect } from "react";
import { AppRoutes } from "@/core/constants/app-routes";
import { useNavigate } from "react-router";
import { useLocalStorage } from "@uidotdev/usehooks";
import { LocalStorageKeys } from "@/core/constants/local-storage-keys";

export function LoginPage() {
  const navigate = useNavigate();

  const [accessToken] = useLocalStorage<string>(LocalStorageKeys.ACCESS_TOKEN);

  useEffect(() => {
    if (accessToken) {
      navigate(AppRoutes.DASHBOARD);
    }
  }, [accessToken, navigate]);

  return (
    <CenteredLayout>
      <LoginForm />
    </CenteredLayout>
  );
}
