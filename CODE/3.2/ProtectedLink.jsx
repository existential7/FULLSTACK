import { jwtDecode } from "jwt-decode";

function Navbar() {
  const token = localStorage.getItem("token");
  const role = token ? jwtDecode(token).role : null;

  return (
    <nav>
      <a href="/">Home</a>
      {role === "Admin" && <a href="/admin">Admin Dashboard</a>}
      {(role === "Admin" || role === "Editor") && <a href="/posts/new">New Post</a>}
    </nav>
  );
}

export default Navbar;
