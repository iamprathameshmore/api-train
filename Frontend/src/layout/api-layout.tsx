import { NavLink, Outlet, useParams, useLocation } from "react-router-dom";

export default function ApiLayout() {
  const { id } = useParams();
  const location = useLocation();

  const tabs = [
    { label: "Overview", path: `/apis/${id}` },
    { label: "Update", path: `/apis/${id}/update` },
    { label: "Logs", path: `/apis/${id}/logs` },
  ];

  return (
    <div className="space-y-6">
      <header className="border-b pb-2">
        <h1 className="text-2xl font-bold">API: {id}</h1>

        <nav className="flex gap-4 mt-4 border-b">
          {tabs.map((tab) => (
            <NavLink
              key={tab.path}
              to={tab.path}
              end
              className={({ isActive }) =>
                `pb-2 border-b-2 ${
                  isActive
                    ? "border-blue-600 text-blue-600 font-semibold"
                    : "border-transparent text-gray-500 hover:text-blue-500"
                }`
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
