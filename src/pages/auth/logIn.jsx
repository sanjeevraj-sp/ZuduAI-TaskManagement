import Login from "../../components/auth/login";
import { Helmet } from "react-helmet-async";

const LoginPage = () => {
  return (
    <>
      <Helmet>
        <title>Log In | Zudu Task Management</title>
        <meta
          name="description"
          content="Sign in to your MyApp account to access your personalized dashboard, manage your tasks, and more."
        />
      </Helmet>
      <Login />
    </>
  );
};

export default LoginPage;
