import { login as loginApi } from "../../api/auth.api";
import { useAuth } from "../../auth/AuthContext";

export default function Login() {
  const { login } = useAuth();

  const submit = async () => {
    const res = await loginApi("username=testuser&password=test123");
    login(res.data.access_token, res.data.user);
  };

  return <button onClick={submit}>Login</button>;
}
