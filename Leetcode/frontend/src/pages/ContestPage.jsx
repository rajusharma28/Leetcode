import { useState, useEffect } from 'react';
import { Table, Tag, Button, message, Modal, Form, Input, DatePicker, InputNumber } from 'antd';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ContestPage = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  useEffect(() => {
    fetchContests();
  }, []);

  const fetchContests = async () => {
    try {
      const response = await fetch('/contests');
      const data = await response.json();
      setContests(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching contests:', error);
      message.error('Failed to load contests');
      setLoading(false);
    }
  };

  const handleCreateContest = async (values) => {
    try {
      const response = await fetch('/contests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          startTime: values.startTime.toISOString(),
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to create contest');
      }

      message.success('Contest created successfully');
      setCreateModalVisible(false);
      form.resetFields();
      fetchContests();
    } catch (error) {
      message.error('Error creating contest: ' + error.message);
    }
  };

  const handleRegister = async (contestId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`/contests/${contestId}/register`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to register for contest');
      }

      message.success('Successfully registered for contest');
      fetchContests();
    } catch (error) {
      message.error('Error registering for contest: ' + error.message);
    }
  };

  const columns = [
    {
      title: 'Contest Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Start Time',
      dataIndex: 'startTime',
      key: 'startTime',
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      render: (minutes) => `${minutes} minutes`,
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: (status) => {
        let color = {
          upcoming: 'blue',
          active: 'green',
          ended: 'red',
        }[status];
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => {
        if (record.status === 'upcoming') {
          return (
            <Button 
              type="primary" 
              onClick={() => handleRegister(record._id)}
              disabled={!isAuthenticated}
            >
              Register
            </Button>
          );
        } else if (record.status === 'active') {
          return (
            <Button 
              type="primary" 
              onClick={() => navigate(`/contest/${record._id}`)}
            >
              Join Contest
            </Button>
          );
        } else {
          return (
            <Button 
              type="default" 
              onClick={() => navigate(`/contest/${record._id}/leaderboard`)}
            >
              View Results
            </Button>
          );
        }
      },
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Coding Contests</h1>
        {user?.role === 'admin' && (
          <Button 
            type="primary"
            onClick={() => setCreateModalVisible(true)}
          >
            Create Contest
          </Button>
        )}
      </div>

      <Table
        columns={columns}
        dataSource={contests}
        loading={loading}
        rowKey="_id"
        pagination={{
          pageSize: 10,
          position: ['bottomCenter'],
        }}
      />

      <Modal
        title="Create New Contest"
        open={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateContest}
        >
          <Form.Item
            name="name"
            label="Contest Name"
            rules={[{ required: true, message: 'Please enter contest name' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter contest description' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="startTime"
            label="Start Time"
            rules={[{ required: true, message: 'Please select start time' }]}
          >
            <DatePicker showTime />
          </Form.Item>

          <Form.Item
            name="duration"
            label="Duration (minutes)"
            rules={[{ required: true, message: 'Please enter contest duration' }]}
          >
            <InputNumber min={1} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Create Contest
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ContestPage;