import { useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { Send, Star, Sparkles, AlertCircle } from "lucide-react";

const Feedback = () => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    try {
      setSubmitting(true);
      await api.post("/api/feedback", { rating, comment });
      toast.success("Feedback submitted! Thank you.");
      setComment("");
      setRating(5);
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-2xl">
      {/* Header */}
      <div className="border-b border-slate-900 pb-5">
        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
          <Send className="h-7 w-7 text-emerald-400" />
          Submit Feedback
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Share your experience using the AI Placement Mentor to help us make the platform better.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-900 bg-slate-900/40 p-8 backdrop-blur-md space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-300">Rate Your Experience</label>
            <div className="flex items-center gap-2 pt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 rounded-lg focus:outline-none transition-colors"
                >
                  <Star
                    className={`h-8 w-8 transition-colors ${
                      star <= (hoverRating || rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-700 hover:text-slate-500"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment Section */}
          <div className="space-y-2">
            <label htmlFor="comment" className="block text-sm font-semibold text-slate-300">
              Detailed Feedback
            </label>
            <textarea
              id="comment"
              rows={5}
              placeholder="Tell us what you like, what was helpful, or what features you would like to see added..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors text-sm leading-relaxed resize-none"
            />
          </div>

          <div className="flex gap-2 items-center rounded-xl bg-slate-950/60 border border-slate-900 p-3 text-xs text-slate-400">
            <Sparkles className="h-4.5 w-4.5 text-emerald-400 flex-shrink-0" />
            <p>Your feedback is saved directly in the admin portal for review.</p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4 border-t border-slate-900">
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50 hover:shadow-lg hover:shadow-emerald-500/10 active:scale-98"
            >
              Submit Feedback
              <Send className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Feedback;
