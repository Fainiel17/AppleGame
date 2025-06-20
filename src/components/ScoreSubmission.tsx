import { useState } from "react";
import { apiRequest } from "../lib/queryClient";
import { useLanguage } from "../lib/stores/useLanguage";

interface ScoreSubmissionProps {
  score: number;
  timeCompleted: number | null;
  onSubmitted: () => void;
  onCancel: () => void;
}

export function ScoreSubmission({ score, timeCompleted, onSubmitted, onCancel }: ScoreSubmissionProps) {
  const [playerName, setPlayerName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch("/api/scores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          playerName: playerName.trim(),
          score,
          timeCompleted
        })
      });

      if (response.ok) {
        onSubmitted();
      } else {
        alert("점수 등록에 실패했습니다.");
      }
    } catch (error) {
      console.error("Failed to submit score:", error);
      alert("점수 등록에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number | null) => {
    if (!seconds) return "시간 초과";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-xl max-w-md w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">점수 등록</h2>
      
      <div className="mb-6 text-center">
        <div className="text-3xl font-bold text-red-500 mb-2">{score}점</div>
        <div className="text-gray-600">완료 시간: {formatTime(timeCompleted)}</div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="playerName" className="block text-sm font-medium text-gray-700 mb-2">
            플레이어 이름
          </label>
          <input
            type="text"
            id="playerName"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="이름을 입력하세요"
            maxLength={20}
            required
          />
        </div>

        <div className="flex space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={submitting || !playerName.trim()}
            className="flex-1 py-2 px-4 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
          >
            {submitting ? "등록 중..." : "등록"}
          </button>
        </div>
      </form>
    </div>
  );
}