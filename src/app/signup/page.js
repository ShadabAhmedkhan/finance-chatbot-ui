"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const URL = 'http://127.0.0.1:8000/auth/'

  const signup = async () => {
    try {
      // check empty fields
      if (!username || !password) {
        alert("Please fill in all fields");
        return;
      }
      // check password lengthth
      if (password.length < 8) {
        alert("Password must be at least 8 characters long");
        return;
      }
      // check username length
      if (username.length < 3) {
        alert("Username must be at least 3 characters long");
        return;
      }
      // check username and password regex
      const res = await axios.post(URL+"signup", {
        username,
        password,
      }, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      // localStorage.setItem("token", res.data.access_token);
      router.push("/login");
    } catch (err) {
      // console.error(err.response.data.detail);
      alert(err.response.data.detail);
    }
  };

  const login = async () => {
    try {
      // const res = await axios.post(URL+"token", {
      //   username,
      //   password,
      // }, {
      //   headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      // });
      // localStorage.setItem("token", res.data.access_token);
      router.push("/login");
    } catch (err) {
      alert("Login failed");
    }
  }

  // return (
  //   <div className="p-8 max-w-md mx-auto">
  //     <h1 className="text-2xl font-bold mb-4">Login</h1>
  //     <input className="border p-2 w-full mb-4" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
  //     <input type="password" className="border p-2 w-full mb-4" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
  //     <button onClick={signup} className="bg-blue-500 text-white px-4 py-2">Sign Up</button>
  //   </div>
  // );

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
          onClick={signup}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Sign Up
        </button>
        <button
          onClick={login}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Login
        </button>
      </div>
    </div>
  );
  
}
