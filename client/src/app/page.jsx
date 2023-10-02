import { DATOS_ROUTE } from "@/utils/ApiRoutes";

const page = async () => {
  const res = await fetch(DATOS_ROUTE);
  const users = await res.json();
  console.log('users', res)
  return (
    <div>
      {users.map((user) => (
        <div key={user.id}>
          <h2>{user.nombre}</h2>
        </div>
      ))}
    </div>
  );
};

export default page;
