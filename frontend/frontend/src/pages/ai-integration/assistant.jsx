import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Send } from "lucide-react";
import { Link } from "react-router-dom";

const Assistant = () => {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "👋 Hello! I’m Guardia. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Utility: strip markdown formatting
  const stripMarkdown = (text) => {
    return text
      .replace(/^#+\s/gm, "")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/`{1,3}(.*?)`{1,3}/g, "$1")
      .replace(/^- /gm, "• ")
      .trim();
  };

  // Fetch news from backend
  const fetchNews = async (topic) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/news?query=${encodeURIComponent(topic)}`);
      if (res.data.length === 0) return "No recent news found.";
      return res.data.map(a => `📰 ${a.title} - ${a.source}\n${a.url}`).join("\n\n");
    } catch (err) {
      console.error(err);
      return "⚠️ Unable to fetch news at this time.";
    }
  };

  // Fetch weather from backend
  const fetchWeather = async (city) => {
    try {
      const res = await axios.post("http://localhost:5000/api/assistant", {
        messages: [{ role: "user", content: `What is the current weather in ${city}?` }]
      });
      return res.data.choices[0].message.content;
    } catch (err) {
      console.error(err);
      return "⚠️ Unable to fetch weather right now.";
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    let aiReply = "";

    try {
      // Disaster / weather keyword checks
      const disasterKeywords = ["flood", "cyclone", "storm", "earthquake", "disaster", "rain"];
      const weatherCities = ["coimbatore", "madurai", "chennai"];

      const lowerInput = input.toLowerCase();
      const isDisasterQuery = disasterKeywords.some(keyword => lowerInput.includes(keyword));
      const cityMatch = weatherCities.find(city => lowerInput.includes(city));

      if (isDisasterQuery) {
        aiReply = await fetchNews(input);
      } else if (cityMatch) {
        aiReply = await fetchWeather(cityMatch);
      } else {
        // Default AI chat
        const res = await axios.post("http://localhost:5000/api/assistant", {
          messages: newMessages
        });
        aiReply = res.data.choices[0].message.content;
      }

      // Clean markdown
      aiReply = stripMarkdown(aiReply);

      setMessages([...newMessages, { role: "assistant", content: aiReply }]);
    } catch (err) {
      console.error(err);
      setMessages([
        ...newMessages,
        { role: "assistant", content: "⚠️ Sorry, I couldn’t process that right now." }
      ]);
    }
    setLoading(false);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-500 via-white to-indigo-300 relative font-sans">
      <Link
        to="/"
        className="absolute top-6 left-6 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md transition"
      >
        ← Back
      </Link>

      <div className="flex flex-col w-[95%] max-w-5xl h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="flex items-center gap-4 bg-blue-600 text-white p-5 shadow-md">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-blue-600 font-bold shadow-md">
            G
          </div>
          <h1 className="text-2xl font-semibold tracking-wide">Guardia</h1>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col text-lg scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`px-6 py-4 rounded-2xl shadow-sm max-w-[75%] whitespace-pre-line transition-all duration-200 ${
                msg.role === "user"
                  ? "bg-gradient-to-r from-blue-500 to-blue-700 text-white self-end ml-auto"
                  : "bg-white border border-gray-200 text-gray-800 self-start"
              }`}
            >
              {msg.content}
            </div>
          ))}
          {loading && (
            <div className="self-start text-gray-500 italic animate-pulse">
              Guardia is typing...
            </div>
          )}
          <div ref={chatEndRef}></div>
        </div>

        {/* Input Area */}
        <div className="p-5 bg-gray-100 border-t flex items-center gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-4 rounded-2xl border border-gray-300 text-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white shadow-sm placeholder-gray-400"
            placeholder="Ask me about weather, disasters, or news..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-2xl flex items-center justify-center shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            <Send size={22} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Assistant;
