import { Outlet, useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex gap-2">
        <button onClick={() => navigate("/about")}>about</button>
        <button onClick={() => navigate("/")}>home</button>
      </div>
      <Outlet />
    </div>
  );
}

export default App;
