import User from "../models/User.js";
import { Webhook } from "svix";

const clerkWebhooks = async (req, res) => {
  try {
    const whInstance = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    const headers = {
      'svix-id': req.headers['svix-id'],
      'svix-timestamp': req.headers['svix-timestamp'],
      'svix-signature': req.headers['svix-signature'],
    };

    await whInstance.verify(JSON.stringify(req.body), headers);
    const { data, type } = req.body;

    const userData = {
      _id: data.id,
      email: data.email_addresses[0].email_address,
      username: data.first_name + " " + data.last_name,
      image: data.image_url,
      role: "user",
    };

    switch (type) {
      case 'user.created': {
        console.log('Creating new user:', userData.username);
        await User.create(userData);
        console.log('User created successfully');
        break;
      }
      case 'user.updated': {
        console.log('Updating user:', data.id);
        const updateData = {
          email: data.email_addresses[0].email_address,
          username: data.first_name + " " + data.last_name,
          image: data.image_url,
        };
        await User.findByIdAndUpdate(data.id, updateData, { new: true });
        console.log('User updated successfully');
        break;
      }
      case 'user.deleted': {
        console.log('Deleting user:', data.id);
        await User.findByIdAndDelete(data.id);
        console.log('User deleted successfully');
        break;
      }
      default: {
        console.log('Unhandled webhook type:', type);
      }
    }

    res.status(200).json({ success: true, message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

export default clerkWebhooks;
