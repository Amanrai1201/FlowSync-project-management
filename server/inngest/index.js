import { Inngest } from "inngest";
import { prisma } from "../config/prisma.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "flowSync" });

// Inngest function to save user data to DB
const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk", triggers: { event: "clerk/user.created" } },
  async ({ event }) => {
    const { data } = event;
    await prisma.user.create({
      data: {
        id: data.id,
        email: data.email_addresses?.[0]?.email_address || "", // ✅ fixed typo
        name: `${data.first_name ?? ""} ${data.last_name ?? ""}`, // ✅ safer
        image: data.image_url,
      },
    });
  },
);

// Inngest function to delete user data from DB
const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-from-clerk", triggers: { event: "clerk/user.deleted" } },
  async ({ event }) => {
    const { data } = event;

    await prisma.user.delete({
      where: {
        id: data.id,
      },
    });
  },
);

// Inngest function to update user data in DB
const syncUserUpdate = inngest.createFunction(
  { id: "update-user-from-clerk", triggers: { event: "clerk/user.updated" } },
  async ({ event }) => {
    const { data } = event;

    await prisma.user.update({
      where: {
        id: data.id,
      },
      data: {
        email: data.email_addresses?.[0]?.email_address || "", // ✅ fixed typo
        name: `${data.first_name ?? ""} ${data.last_name ?? ""}`, // ✅ safer
        image: data.image_url,
      },
    });
  },
);

// Export all functions
export const functions = [syncUserCreation, syncUserDeletion, syncUserUpdate];
