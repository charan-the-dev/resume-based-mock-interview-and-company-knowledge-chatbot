import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/actions/auth.action";

const AuthLayout = async ({ children }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (isUserAuthenticated) redirect("/dashboard");

  return <div className="auth-layout">{children}</div>;
};

export default AuthLayout;