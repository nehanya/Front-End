"use client";

import React, { useEffect, useState } from "react";
import { SessionState } from "@/app/utils/interface";
import { useSelector } from "react-redux";
import Header from "@/app/components/Header";
import Breadcrumb from "@/app/components/Breadcrumb";

const Profile = () => {
  const { isUserLoggedIn, me } = useSelector(
    (state: { session: SessionState }) => state.session
  );

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    gender: "",
    image: ""
  });

  useEffect(() => {
    if (isUserLoggedIn && me) {
      setFormData({
        firstName: me.firstName || "",
        lastName: me.lastName || "",
        email: me.email || "",
        username: me.username || "",
        gender: me.gender || "",
        image: me.image || ""
      });
    }
  }, [me, isUserLoggedIn]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
    <Header/>
    <Breadcrumb />

    <div className="max-w-lg mx-auto p-4 border rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">User Profile</h2>
      <img
        src={formData.image}
        alt="Profile"
        className="w-24 h-24 rounded-full mx-auto mb-4"
      />
      <form className="space-y-4">
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="First Name"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Last Name"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          placeholder="Gender"
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Update Profile
        </button>
      </form>
    </div>
    </>
  );
};

export default Profile;
