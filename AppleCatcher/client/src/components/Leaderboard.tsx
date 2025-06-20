import { useState, useEffect } from "react";
import { apiRequest } from "../lib/queryClient";
import { useLanguage } from "../lib/stores/useLanguage";

export type LeaderboardPeriod = "daily" | "weekly" | "monthly" | "alltime";

interface LeaderboardEntry {
  id: number;
  playerName: string;
  score: number;
  timeCompleted: number | null;
  createdAt: string;
}

export function Leaderboard() {
  const [period, setPeriod] = useState<LeaderboardPeriod>("daily");
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  const fetchLeaderboard = async (selectedPeriod: LeaderboardPeriod) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/leaderboard/${selectedPeriod}`);
      if (response.ok) {
        const data = await response.json();
        setLeaderboard(data);
      }
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard(period);
  }, [period]);

  const formatTime = (seconds: number | null) => {
    if (!seconds) return "-";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPeriodLabel = (p: LeaderboardPeriod) => {
    switch (p) {
      case "daily": return t('daily');
      case "weekly": return t('weekly');
      case "monthly": return t('monthly');
      case "alltime": return t('allTime');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 w-full md:w-80">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 text-center">🏆 {t('ranking')}</h2>
      
      {/* Period Tabs */}
      <div className="flex bg-gray-100 rounded-lg p-1 mb-4">
        {(["daily", "weekly", "monthly", "alltime"] as LeaderboardPeriod[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`flex-1 py-2 px-1 md:px-3 rounded-md text-xs md:text-sm font-medium transition-colors ${
              period === p
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {getPeriodLabel(p)}
          </button>
        ))}
      </div>

      {/* Leaderboard List */}
      <div className="space-y-2">
        {loading ? (
          <div className="text-center py-8 text-gray-500">로딩 중...</div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-8 text-gray-500">{t('noRecords')}</div>
        ) : (
          leaderboard.map((entry, index) => (
            <div
              key={entry.id}
              className={`flex items-center justify-between p-3 rounded-lg ${
                index === 0
                  ? "bg-gradient-to-r from-yellow-100 to-yellow-50 border border-yellow-200"
                  : index === 1
                  ? "bg-gradient-to-r from-gray-100 to-gray-50 border border-gray-200"
                  : index === 2
                  ? "bg-gradient-to-r from-orange-100 to-orange-50 border border-orange-200"
                  : "bg-gray-50"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  index === 0
                    ? "bg-yellow-500 text-white"
                    : index === 1
                    ? "bg-gray-400 text-white"
                    : index === 2
                    ? "bg-orange-500 text-white"
                    : "bg-gray-300 text-gray-700"
                }`}>
                  {index + 1}
                </div>
                <div>
                  <div className="font-medium text-gray-900 truncate max-w-[120px]">
                    {entry.playerName}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatTime(entry.timeCompleted)}
                  </div>
                </div>
              </div>
              <div className="text-lg font-bold text-gray-900">
                {entry.score}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Refresh Button */}
      <button
        onClick={() => fetchLeaderboard(period)}
        disabled={loading}
        className="w-full mt-4 py-2 px-4 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
      >
        새로고침
      </button>
    </div>
  );
}