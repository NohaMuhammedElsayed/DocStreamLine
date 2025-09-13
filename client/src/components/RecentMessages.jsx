import React, { useEffect, useState } from 'react'
import { dummyRecentMessagesData } from '../assets/assets'
import { Link } from 'react-router-dom'
import moment from 'moment'

const RecentMessages = () => {
  const [messages, setMessages] = useState([])

  const fetchRecentMessages = async () => {
    setMessages(dummyRecentMessagesData)
  }

  useEffect(() => {
    fetchRecentMessages()
  }, [])

  return (
    <div className="bg-white max-w-xs mt-4 p-4 min-h-20 rounded-md shadow text-xs text-slate-800">
      <h3 className="font-semibold text-slate-800 mb-4">Recent Messages</h3>
      <div className="flex flex-col max-h-56 overflow-y-scroll no-scrollbar">
        {messages.map((message, index) => (
          <Link
            to={`/messages/${message.from_user_id._id}`}
            key={index}
            className="flex items-start gap-2 py-2 hover:bg-slate-100 rounded-md px-2"
          >
            <img
              src={message.from_user_id.profile_picture}
              alt={message.from_user_id.full_name}
              className="w-8 h-8 rounded-full"
            />

            <div className="w-full">
              {/* Top row: name + timestamp */}
              <div className="flex justify-between items-center">
                <p className="font-medium">{message.from_user_id.full_name}</p>
                <p className="text-slate-500 ml-2">{moment(message.createdAt).fromNow()}</p>
              </div>

              {/* Bottom row: text + unread circle */}
              <div className="flex justify-between items-center mt-1">
                <p className="text-gray-500 truncate max-w-[140px]">
                  {message.text ? message.text : 'Media'}
                </p>
                {!message.seen && (
                  <span className="ml-2 bg-indigo-500 text-white w-5 h-5 flex items-center justify-center rounded-full text-[10px]">
                    1
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default RecentMessages
