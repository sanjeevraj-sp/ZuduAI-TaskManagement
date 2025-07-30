import Register from "../../components/auth/register";
import { Helmet } from "react-helmet-async";

const LoginPage = () => {
  return (
    <>
      <Helmet>
        <title>Register | Zudu AI Task Management</title>
        <meta
          name="description"
          content="Register in to your MyApp account to access your personalized dashboard, manage your tasks, and more."
        />
      </Helmet>
      <Register />
    </>
  );
};

export default LoginPage;
