"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const login = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/token", {
        username,
        password,
      }, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      localStorage.setItem("token", res.data.access_token);
      router.push("/chat");
    } catch (err) {
      alert("Login failed");
    }
  };

  const signup = async () => {
    router.push("/signup");

  }
  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <input
        className="border p-2 w-full mb-4"
        value={username}
        onChange={e => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="password"
        className="border p-2 w-full mb-4"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
      />
      <div className="flex justify-between">
        <button
          onClick={login}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Log In
        </button>
        <button
          onClick={signup}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
