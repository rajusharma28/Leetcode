import { useState, useEffect } from 'react';
import { Table, Tag } from 'antd';
import axios from 'axios';
import { useSelector } from 'react-redux';

const Submissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchSubmissions();
  }, [token]);

  const fetchSubmissions = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/submissions', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSubmissions(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Time Submitted',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: 'Question',
      dataIndex: 'problemTitle',
      key: 'problemTitle',
      render: (text, record) => (
        <a href={`/problem/${record.problemId}`} className="text-blue-500 hover:underline">
          {text}
        </a>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Accepted' ? 'success' : status === 'Compile Error' ? 'error' : 'warning'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Runtime',
      dataIndex: 'runtime',
      key: 'runtime',
      render: (text) => text ? `${text} ms` : 'N/A',
    },
    {
      title: 'Language',
      dataIndex: 'language',
      key: 'language',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">My Submissions</h1>
      <Table 
        columns={columns} 
        dataSource={submissions}
        rowKey="_id"
        loading={loading}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
        className="bg-white shadow-lg rounded-lg"
      />
    </div>
  );
};

export default Submissions;