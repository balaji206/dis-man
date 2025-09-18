import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";

const socket = io("http://localhost:5000"); // backend URL

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Listen for alerts from backend
    socket.on("alert", (data) => {
      const id = Date.now();
      setNotifications((prev) => [...prev, { ...data, id }]);

      // Remove notification after 5 seconds
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 50000);
    });

    return () => {
      socket.off("alert");
    };
  }, []);

  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-4">
      <AnimatePresence>
        {notifications.map((note) => (
          <motion.div
            key={note.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
            className={`p-4 rounded-lg shadow-xl text-white font-semibold ${
              note.type === "critical" ? "bg-red-600" : "bg-blue-600"
            }`}
          >
            {note.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationSystem;
