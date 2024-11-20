async function tasksData() {
  const res = await fetch('http://127.0.0.1:8000/api/protected/tasks/get_all_tasks/')
  const result = await res.json();
  return result.tasks || [];
}

export default async function Home() {
  const tasks = await tasksData();
  return (
    <div>
      <h1>Главная страница</h1>
      {tasks.map(el => (
        <div key={el.tasks} className="res">
            <h2>{el.task_name}</h2>
            <p>{el.task_descriptions}</p>
            <p>{el.status}</p>
            <p>{el.priority}</p>
        </div>
      ))}
   </div>
  );
  
}
