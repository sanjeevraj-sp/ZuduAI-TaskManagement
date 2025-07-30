import { Helmet } from "react-helmet-async";
import Tasks from "../../components/dashboard/tasks";

const TasksPage = () => {
  return (
    <>
      <Helmet>
        <title>All Tasks | Zudu Task Management</title>
        <meta
          name="description"
          content="View and manage all your assigned tasks in the Zudu dashboard."
        />
      </Helmet>
      <Tasks />
    </>
  );
};

export default TasksPage;
