const TaskStatus = ({ status }) => {
  const statusClasses = {
    "Новая задача": "task-status new",
    "В разработке": "task-status in-progress",
    "Выполненная задача": "task-status completed",
  };

  return (
    <span className={statusClasses[status] || "task-status"}>
      {status}
    </span>
  );
};

export default TaskStatus;