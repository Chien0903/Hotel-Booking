import { Webhook } from "svix";
import User from "../models/User.js";

// API Controller Function to Manage Clerk User with database
// POST /api/clerk
const clerkWebhooks = async (req, res) => {
  try {
    // Debug: log all headers and body for troubleshooting webhook delivery
    console.log("--- Clerk Webhook Received ---");
    console.log("Headers:", JSON.stringify(req.headers, null, 2));
    console.log("Body:", JSON.stringify(req.body, null, 2));
    // Create a Svix instance with clerk webhook secret.
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // Getting Headers
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    // Prepare raw payload string for svix verification
    const payload =
      req.body instanceof Buffer
        ? req.body.toString()
        : JSON.stringify(req.body);

    // Verifying Headers using raw payload
    await whook.verify(payload, headers);

    // Getting Data from parsed payload
    const { data, type } = JSON.parse(payload);

    const userData = {
      _id: data.id,
      email: data.email_addresses?.[0]?.email_address || "",
      username:
        `${data.first_name || ""} ${data.last_name || ""}`.trim() ||
        data.username ||
        "",
      image: data.image_url || "",
      recentSearchedCities: [],
    };

    // Switch Cases for differernt Events
    switch (type) {
      case "user.created": {
        await User.create(userData);
        break;
      }

      case "user.updated": {
        await User.findByIdAndUpdate(data.id, userData);
        break;
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        break;
      }

      default:
        break;
    }

    res.json({ success: true, message: "Webhook Recieved" });
  } catch (error) {
    console.error("Error handling Clerk webhook:", error);
    res
      .status(400)
      .json({
        success: false,
        message: error?.message || "Webhook processing error",
      });
  }
};

export default clerkWebhooks;
