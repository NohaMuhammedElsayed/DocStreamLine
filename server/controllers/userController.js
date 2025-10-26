import User from '../models/User.js';
import imagekit from '../configs/imageKit.js';
import Connection from '../models/Connection.js';
import fs from 'fs';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { MongoCryptInvalidArgumentError } from 'mongodb';

// GET user data
export const getUserData = async (req, res) => {
  try {
    const userId = req.userId;

    let user = await User.findById(userId);

    if (!user) {
      // Optionally fetch user from Clerk if not in DB
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        bio: user.bio,
        profile_picture: user.profile_picture,
        cover_photo: user.cover_photo,
        specialty: user.specialty,
        followers: user.followers,
        following: user.following,
        connections: user.connections,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE user data
export const updateUserData = async (req, res) => {
  try {
    const userId = req.userId;
    // Debug: log request shape to help identify why text fields may be missing
    console.log('updateUserData: content-type=', req.headers['content-type']);
    console.log('updateUserData: req.body=', req.body);
    console.log('updateUserData: req.files=', req.files);

    // Support clients that send a JSON string under `data` or `body` when using FormData
    let body = req.body || {};

    // If client appended a JSON string under `data` (common pattern), parse it
    if (body.data && typeof body.data === 'string') {
      try {
        const parsed = JSON.parse(body.data);
        body = { ...body, ...parsed };
      } catch (e) {
        console.warn('Could not parse req.body.data as JSON');
      }
    }

    // Some clients (or front-end helpers) append the JSON under the key `body`.
    // Handle both stringified JSON and object forms.
    if (body.body) {
      if (typeof body.body === 'string') {
        try {
          const parsed = JSON.parse(body.body);
          body = { ...body, ...parsed };
        } catch (e) {
          console.warn('Could not parse req.body.body as JSON');
        }
      } else if (typeof body.body === 'object') {
        body = { ...body, ...body.body };
      }
    }

    const { username, bio, full_name, specialty } = body;

    // Check if user exists
    const tempUser = await User.findById(userId);
    if (!tempUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // If username provided, ensure uniqueness
    if (username && username !== tempUser.username) {
      const existing = await User.findOne({ username });
      if (existing && existing._id.toString() !== userId) {
        return res.status(400).json({ success: false, message: 'Username already taken' });
      }
    }

    // Always include the fields from request body in the update
    const updatedData = {
      username: username || tempUser.username,
      full_name: full_name || tempUser.full_name,
      bio: bio || tempUser.bio,
      specialty: specialty || tempUser.specialty
    };
    // Files (if any)
    const profile = req.files?.profile?.[0];
    const cover = req.files?.cover?.[0];

    if (profile) {
      const buffer = fs.readFileSync(profile.path);
      const response = await imagekit.upload({ file: buffer, fileName: profile.originalname });
      updatedData.profile_picture = imagekit.url({
        path: response.filePath,
        transformation: [{ quality: 'auto' }, { format: 'webp' }, { width: '512' }],
      });
    }

    if (cover) {
      const buffer = fs.readFileSync(cover.path);
      const response = await imagekit.upload({ file: buffer, fileName: cover.originalname });
      updatedData.cover_photo = imagekit.url({
        path: response.filePath,
        transformation: [{ quality: 'auto' }, { format: 'webp' }, { width: '1280' }],
      });
    }

    // Always update the document with the provided or existing values
    // Apply all updates and return populated document
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updatedData },
      { new: true, runValidators: true }
    )
      .populate('followers', 'username full_name profile_picture')
      .populate('following', 'username full_name profile_picture')
      .populate('connections', 'username full_name profile_picture');

    if (!user) {
      return res.status(404).json({ success: false, message: 'Failed to update user' });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        bio: user.bio,
        profile_picture: user.profile_picture,
        cover_photo: user.cover_photo,
        specialty: user.specialty,
        followers: user.followers,
        following: user.following,
        connections: user.connections,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// DISCOVER users
export const discoverUsers = async (req, res) => {
  try {
    const userId = req.userId;
    const { input } = req.body;
    const allUsers = await User.find({
      $or: [
        { username: new RegExp(input, 'i') },
        { email: new RegExp(input, 'i') },
        { full_name: new RegExp(input, 'i') },
        { specialty: new RegExp(input, 'i') },
      ],
    });

    const filteredUsers = allUsers.filter(user => user._id.toString() !== userId);
    res.json({ success: true, users: filteredUsers });
  } catch (error) {
    console.error("Discover users error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// FOLLOW user
export const followUsers = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.body;

    const user = await User.findById(userId);
    if (!user.following.includes(id)) user.following.push(id);
    await user.save();

    const toUser = await User.findById(id);
    if (!toUser.followers.includes(userId)) toUser.followers.push(userId);
    await toUser.save();

    res.json({ success: true, message: "User followed successfully" });
  } catch (error) {
    console.error("Follow user error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// UNFOLLOW user
export const unfollowUsers = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.body;

    const user = await User.findById(userId);
    user.following = user.following.filter(uid => uid.toString() !== id);
    await user.save();

    const toUser = await User.findById(id);
    toUser.followers = toUser.followers.filter(uid => uid.toString() !== userId);
    await toUser.save();

    res.json({ success: true, message: "User unfollowed successfully" });
  } catch (error) {
    console.error("Unfollow user error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const sendConnectionRequest = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.body; // target user id

    if (!userId) return res.status(401).json({ success: false, message: 'Not authenticated' });
    if (!id) return res.status(400).json({ success: false, message: 'Target user id is required' });

    // Rate limit: no more than 20 requests in last 24 hours
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const connectionRequests = await Connection.find({
      from_user_id: userId,
      createdAt: { $gt: last24Hours },
    });

    if (connectionRequests.length >= 20) {
      return res.status(429).json({ success: false, message: 'You have sent more than 20 connection requests in the last 24 hours' });
    }

    // Check if a connection or request already exists
    const existing = await Connection.findOne({
      $or: [
        { from_user_id: userId, to_user_id: id },
        { from_user_id: id, to_user_id: userId },
      ],
    });

    if (existing) {
      if (existing.status === 'accepted') {
        return res.json({ success: false, message: 'You are already connected with this user' });
      }
      // pending or other state
      return res.json({ success: false, message: 'Connection request already exists' });
    }

    // Create connection request
    await Connection.create({
      from_user_id: userId,
      to_user_id: id,
      status: 'pending',
    });

    return res.json({ success: true, message: 'Connection request sent' });
  } catch (error) {
    console.error('sendConnectionRequest error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get User Connections:
export const getUserConnections = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ success: false, message: 'Not authenticated' });

    const user = await User.findById(userId)
      .populate('connections', 'username full_name profile_picture')
      .populate('followers', 'username full_name profile_picture')
      .populate('following', 'username full_name profile_picture');

    const connections = user?.connections || [];
    const followers = user?.followers || [];
    const following = user?.following || [];

    const pendingConnections = (await Connection.find({ to_user_id: userId, status: 'pending' }).populate('from_user_id', 'username full_name profile_picture')).map(c => c.from_user_id);

    res.json({ success: true, connections, pendingConnections, followers, following });
  } catch (error) {
    console.error('getUserConnections error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//Accept Connection Request
export const acceptConnectionRequest = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.body; // id = from_user_id

    if (!userId) return res.status(401).json({ success: false, message: 'Not authenticated' });
    if (!id) return res.status(400).json({ success: false, message: 'Requester id is required' });

    const connection = await Connection.findOne({ from_user_id: id, to_user_id: userId, status: 'pending' });

    if (!connection) {
      return res.status(404).json({ success: false, message: 'Connection request not found' });
    }

    // mark accepted
    connection.status = 'accepted';
    await connection.save();

    // update users' connections arrays
    const user = await User.findById(userId);
    if (!user.connections.includes(id)) {
      user.connections.push(id);
      await user.save();
    }

    const toUser = await User.findById(id);
    if (!toUser.connections.includes(userId)) {
      toUser.connections.push(userId);
      await toUser.save();
    }

    return res.json({ success: true, message: 'Connection request accepted successfully' });
  } catch (error) {
    console.error('acceptConnectionRequest error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

