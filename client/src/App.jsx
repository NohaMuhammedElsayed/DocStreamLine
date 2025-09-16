import { Routes, Route } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Toaster } from "react-hot-toast";

import Layout from "./pages/Layout";
import Login from "./pages/Login";
import Feed from "./pages/Feed";
import Messages from "./pages/Messages";
import Chatbox from "./pages/Chatbox";
import Connections from "./pages/Connections";
import Discover from "./pages/Discover";
import Profile from "./pages/Profile";
import CreatePost from "./pages/CreatePost";
import Assistant from "./pages/Assistant";
import MyClinic from "./pages/MyClinic";

export default function App() {
  const { user } = useUser();

  return (
    <>
      <Toaster />
      <Routes>
        {/* if no user → Login, else → Layout */}
        <Route path="/" element={!user ? <Login /> : <Layout />}>
          <Route index element={<Feed />} />
          <Route path="messages" element={<Messages />} />
          <Route path="messages/:userId" element={<Chatbox />} />
          <Route path="connections" element={<Connections />} />
          <Route path="discover" element={<Discover />} />
          <Route path="profile" element={<Profile />} />
          <Route path="create-post" element={<CreatePost />} />
          <Route path="assistant" element={<Assistant />} />
          <Route path="my-clinic" element={<MyClinic />} />
        </Route>
      </Routes>
    </>
  );
}
