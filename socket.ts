import { Server, Socket } from "socket.io";
import prisma from "./lib/prisma";
import Redis from "ioredis";
import { createAdapter } from "@socket.io/redis-adapter";

const redisConfig = {
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  username: process.env.REDIS_USERNAME || "default",
  password: process.env.REDIS_PASSWORD || "",
};

const pub = new Redis(redisConfig);
const sub = new Redis(redisConfig);

class SocketService {
  private _io: Server;

  constructor(httpServer: any) {
    console.log("Init Socket Service...");
    this._io = new Server(httpServer);

    // Use the new Redis adapter
    this._io.adapter(createAdapter(pub, sub));

    this.initRedisSubscriber();
  }

  private initRedisSubscriber() {
    sub.subscribe("MESSAGES");
    sub.on("message", (channel, message) => {
      if (channel === "MESSAGES") {
        const parsedMessage = JSON.parse(message);
        this.io.to(parsedMessage.chatroomId).emit("receiveMessage", parsedMessage.newMessage);
      }
    });
  }

  public initListeners() {
    const io = this.io;
    console.log("Init Socket Listeners...");

    io.on("connection", (socket: Socket) => {
      console.log("A user connected:", socket.id);

      socket.on("sendMessage", async ({ chatroomId, message, senderId }) => {
        try {
          const newMessage = await prisma.messages.create({
            data: {
              chatroom_id: chatroomId,
              sender_id: senderId,
              content: message,
              message_type: "text",
              created_at: new Date(),
            },
          });

          // Publish the message to Redis
          pub.publish("MESSAGES", JSON.stringify({ chatroomId, newMessage }));
        } catch (error) {
          console.error("Error saving message:", error);
          socket.emit("errorMessage", {
            message: "Failed to send message. Please try again.",
          });
        }
      });

      socket.on("joinRoom", (chatroomId) => {
        socket.join(chatroomId);
        console.log(`User joined room: ${chatroomId}`);
      });

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });
  }

  get io() {
    return this._io;
  }
}

export default SocketService;