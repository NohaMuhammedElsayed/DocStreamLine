import React, { useRef, useState } from 'react'
import { Pencil } from 'lucide-react'
import { dummyUserData } from '../assets/assets'

const ProfileModal = ({ setShowEdit }) => {
  const user = dummyUserData
  const [editForm, setEditForm] = useState({
    username: user.username,
    bio: user.bio,
    location: user.location,
    profile_picture: null,
    cover_photo: null,
    full_name: user.full_name,
  })

  const profileInputRef = useRef(null)
  const coverInputRef = useRef(null)

  const handleSaveProfile = (e) => {
    e.preventDefault()
    // TODO: Send `editForm` to backend or Firebase here
    console.log('Updated data:', editForm)
    setShowEdit(false)
  }

  return (
    <div className="fixed inset-0 z-[110] bg-black/50 overflow-y-auto">
      <div className="max-w-2xl mx-auto sm:py-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h1>

          <form className="space-y-6" onSubmit={handleSaveProfile}>
            {/* Profile Picture */}
            <div className="flex flex-col items-start gap-3">
              <label className="block text-sm font-medium text-gray-700">
                Profile Picture
              </label>

              <input
                ref={profileInputRef}
                hidden
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    profile_picture: e.target.files[0],
                  })
                }
              />

              <div
                className="group relative w-24 h-24 mt-2 cursor-pointer"
                onClick={() => profileInputRef.current?.click()}
              >
                <img
                  src={
                    editForm.profile_picture
                      ? URL.createObjectURL(editForm.profile_picture)
                      : user.profile_picture
                  }
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
                <div className="absolute inset-0 hidden group-hover:flex bg-black/30 rounded-full items-center justify-center">
                  <Pencil className="w-5 h-5 text-white" />
                </div>
              </div>

              {/* Cover Photo */}
              <label className="block text-sm font-medium text-gray-700 mt-4">
                Cover Photo
              </label>

              <input
                ref={coverInputRef}
                hidden
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    cover_photo: e.target.files[0],
                  })
                }
              />

              <div
                className="group relative w-80 h-40 mt-2 cursor-pointer"
                onClick={() => coverInputRef.current?.click()}
              >
                <img
                  src={
                    editForm.cover_photo
                      ? URL.createObjectURL(editForm.cover_photo)
                      : user.cover_photo
                  }
                  alt="Cover"
                  className="w-full h-full rounded-lg object-cover"
                />
                <div className="absolute inset-0 hidden group-hover:flex bg-black/30 rounded-lg items-center justify-center">
                  <Pencil className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>

            {/* Text Fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-200 rounded-lg"
                placeholder="Enter full name"
                value={editForm.full_name}
                onChange={(e) =>
                  setEditForm({ ...editForm, full_name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-200 rounded-lg"
                placeholder="Enter username"
                value={editForm.username}
                onChange={(e) =>
                  setEditForm({ ...editForm, username: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                rows={3}
                className="w-full p-3 border border-gray-200 rounded-lg"
                placeholder="Enter bio"
                value={editForm.bio}
                onChange={(e) =>
                  setEditForm({ ...editForm, bio: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-200 rounded-lg"
                placeholder="Enter location"
                value={editForm.location}
                onChange={(e) =>
                  setEditForm({ ...editForm, location: e.target.value })
                }
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6">
              <button
                type="button"
                onClick={() => setShowEdit(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ProfileModal
