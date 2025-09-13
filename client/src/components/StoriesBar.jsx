import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { dummyStoriesData } from "../assets/assets";
import moment from "moment";
import StoryModel from "./StoryModel";
import StoryViewer from "./StoryViewer";

const StoriesBar = () => {
  const [stories, setStories] = useState([]);
  const [showModel, setShowModel] = useState(false);
  const [viewStory, setViewStory] = useState(null);

  const fetchStories = async () => {
    // load dummy data (replace with real API call if available)
    setStories(dummyStoriesData || []);
  };

  useEffect(() => {
    fetchStories();
  }, []);

  // keep rendering even if empty array so UI shows
  return (
    <div className="w-screen sm:w-[calc(100vw-240px)] lg:max-w-2xl no-scrollbar overflow-x-auto px-4">
      <div className="flex gap-4 pb-5">
        {/* Add Story Card */}
        <div
          onClick={() => setShowModel(true)}
          className="rounded-lg shadow-sm min-w-[7rem] w-28 h-40 cursor-pointer hover:shadow-lg transition-all duration-200 border-2 border-dashed border-indigo-300 bg-gradient-to-b from-indigo-50 to-white flex items-center justify-center"
        >
          <button className="flex flex-col items-center">
          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg mb-2">
            <Plus className="w-5 h-5 text-white" />
          </div>
          <div className="text-gray-600 text-medium mb-1 align-middle justify-center font-medium">
            Add Story
          </div>
          </button>
          
        </div>

        {/* Story Cards */}
        {stories.map((story, index) => (
          <div
            onClick={() => setViewStory(story)}
            key={index}
            className="relative rounded-lg shadow min-w-[7rem] w-28 h-40 cursor-pointer hover:shadow-lg transition-all duration-200 bg-gradient-to-b from-indigo-500 to-purple-800 active:scale-95 overflow-hidden"
          >
            <img
              src={story.user?.profile_picture}
              alt={story.user?.name || "avatar"}
              className="absolute w-8 h-8 top-3 left-3 z-20 rounded-full ring ring-gray-100 shadow object-cover"
            />
            <p className="absolute top-16 left-3 text-white/90 text-sm truncate max-w-[6rem]">
              {story.content}
            </p>
            <p className="text-white absolute bottom-1 right-2 z-20 text-xs">
              {moment(story.created_at).fromNow()}
            </p>

            {/* media */}
            {story.media_type === "image" && story.media_url && (
              <img
                src={story.media_url}
                alt=""
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 opacity-80 hover:opacity-90"
              />
            )}
            {story.media_type === "video" && story.media_url && (
              <video
                src={story.media_url}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 opacity-80 hover:opacity-90"
                controls
              />
            )}
          </div>
        ))}
      </div>
      {/* Story Model */}
      {showModel && (
        <StoryModel setShowModel={setShowModel} fetchStories={fetchStories} />
      )}

      {/* View Story Modal */}
      {viewStory && (
        <StoryViewer viewStory={viewStory} setViewStory={setViewStory} />
      )}
    </div>
  );
};


export default StoriesBar;