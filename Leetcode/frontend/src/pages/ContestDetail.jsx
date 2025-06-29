import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Table, Card, Tag, Button, message, Tabs } from 'antd';
import { useSelector } from 'react-redux';

const ContestDetail = () => {
  const { id } = useParams();
  const [contest, setContest] = useState(null);
  const [problems, setProblems] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchContestDetails();
    fetchLeaderboard();
  }, [id]);

  const fetchContestDetails = async () => {
    try {
      const response = await fetch(`/contests/${id}`);
      const data = await response.json();
      setContest(data);
      setProblems(data.problems || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching contest details:', error);
      message.error('Failed to load contest details');
      setLoading(false);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch(`/contests/${id}/leaderboard`);
      const data = await response.json();
      setLeaderboard(data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      message.error('Failed to load leaderboard');
    }
  };

  const problemColumns = [
    {
      title: 'Problem',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Difficulty',
      dataIndex: 'difficulty',
      key: 'difficulty',
      render: (difficulty) => {
        const colors = {
          Easy: 'green',
          Medium: 'orange',
          Hard: 'red',
        };
        return <Tag color={colors[difficulty]}>{difficulty}</Tag>;
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button 
          type="primary"
          onClick={() => window.location.href = `/problem/${record._id}`}
          disabled={!isAuthenticated}
        >
          Solve
        </Button>
      ),
    },
  ];

  const leaderboardColumns = [
    {
      title: 'Rank',
      dataIndex: 'rank',
      key: 'rank',
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
    },
    {
      title: 'Submissions',
      dataIndex: 'submissions',
      key: 'submissions',
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-bold">Contest not found</h2>
      </div>
    );
  }

  const items = [
    {
      key: '1',
      label: 'Problems',
      children: (
        <Table
          columns={problemColumns}
          dataSource={problems}
          rowKey="_id"
          pagination={false}
        />
      ),
    },
    {
      key: '2',
      label: 'Leaderboard',
      children: (
        <Table
          columns={leaderboardColumns}
          dataSource={leaderboard}
          rowKey="rank"
          pagination={{
            pageSize: 10,
            position: ['bottomCenter'],
          }}
        />
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-6">
        <h1 className="text-2xl font-bold mb-4">{contest.name}</h1>
        <p className="mb-4">{contest.description}</p>
        <div className="flex gap-4 mb-2">
          <div>
            <span className="font-semibold">Start Time:</span>{' '}
            {new Date(contest.startTime).toLocaleString()}
          </div>
          <div>
            <span className="font-semibold">Duration:</span>{' '}
            {contest.duration} minutes
          </div>
          <div>
            <span className="font-semibold">Status:</span>{' '}
            <Tag color={{
              upcoming: 'blue',
              active: 'green',
              ended: 'red',
            }[contest.status]}>
              {contest.status.toUpperCase()}
            </Tag>
          </div>
        </div>
      </Card>

      <Tabs 
        items={items}
        defaultActiveKey="1"
        className="contest-tabs"
      />
    </div>
  );
};

export default ContestDetail;