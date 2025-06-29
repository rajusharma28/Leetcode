import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const Progress = () => {
  const [practiceHistory, setPracticeHistory] = useState([]);
  const [stats, setStats] = useState({
    totalSolved: 0,
    easy: 0,
    medium: 0,
    hard: 0,
    submissions: 0,
    acceptance: 0
  });
  const [loading, setLoading] = useState(true);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchProgress();
  }, [token]);

  const fetchProgress = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/progress', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPracticeHistory(response.data.history);
      setStats(response.data.stats);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching progress:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Summary Section */}
        <div className="bg-gray-800 rounded-lg p-6 text-white">
          <h2 className="text-2xl font-bold mb-4">Summary</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg">Total Solved</h3>
              <p className="text-3xl font-bold text-blue-400">{stats.totalSolved}</p>
              <p className="text-sm text-gray-400">Problems</p>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-green-400">Easy {stats.easy}</span>
                <span className="text-yellow-400">Med. {stats.medium}</span>
                <span className="text-red-400">Hard {stats.hard}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Submissions & Acceptance */}
        <div className="bg-gray-800 rounded-lg p-6 text-white">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg">Submissions</h3>
              <p className="text-3xl font-bold text-purple-400">{stats.submissions}</p>
            </div>
            <div>
              <h3 className="text-lg">Acceptance</h3>
              <p className="text-3xl font-bold text-green-400">{stats.acceptance}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Practice History */}
      <div className="mt-8 bg-white rounded-lg shadow-lg overflow-hidden">
        <h2 className="text-2xl font-bold p-6 bg-gray-50">Practice History</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Submitted</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Problem</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Result</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submissions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {practiceHistory.map((practice) => (
                <tr key={practice._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(practice.lastSubmitted).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <a href={`/problem/${practice.problemId}`} className="text-blue-600 hover:text-blue-900">
                        {practice.problemTitle}
                      </a>
                      <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        practice.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                        practice.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {practice.difficulty}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      practice.lastResult === 'Accepted' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {practice.lastResult}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {practice.submissions}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Progress;