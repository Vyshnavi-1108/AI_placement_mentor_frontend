import { useEffect, useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

function RoadmapPage() {
  const [roadmap, setRoadmap] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const fetchRoadmap = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://127.0.0.1:8000/api/roadmap/generate",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setRoadmap(response.data.roadmap);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">AI Placement Roadmap</h1>

      {loading ? (
        <p>Generating roadmap...</p>
      ) : (
        <div className="bg-slate-900 p-6 rounded-xl">
          <ReactMarkdown>{roadmap}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}

export default RoadmapPage;
