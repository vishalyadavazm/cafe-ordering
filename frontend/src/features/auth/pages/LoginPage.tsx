import { useEffect, useState, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Coffee } from "lucide-react";
import { login } from "@/features/auth/api";
import { useAuth } from "@/store/auth";

export function LoginPage() {
  const navigate = useNavigate();
  const token = useAuth((s) => s.token);
  const setAuth = useAuth((s) => s.setAuth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (token) navigate("/staff", { replace: true });
  }, [token, navigate]);

  const mutation = useMutation({
    mutationFn: () => login(email, password),
    onSuccess: (data) => {
      setAuth(data.access, data.staff, data.refresh);
      navigate("/staff", { replace: true });
    },
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    mutation.mutate();
  }

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="login-logo"><Coffee size={24} /></div>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: 20 }}>Brew Cafe</h1>
          <p className="eyebrow" style={{ marginTop: 6 }}>Staff console</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@cafe.com"
            />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {mutation.isError && <p role="alert" className="form-error">Invalid email or password.</p>}

          <button type="submit" disabled={mutation.isPending} className="btn btn-primary btn-block" style={{ marginTop: 20 }}>
            {mutation.isPending ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
