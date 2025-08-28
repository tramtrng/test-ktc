import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Table, Button, Modal, Form, Input, Select, DatePicker, Switch, Space, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { employeeService } from '../services/api-employee';
import type { Employee, CreateEmployeeRequest, UpdateEmployeeRequest } from '../types/Employee';

const { Option } = Select;

const EmployeeList = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  // Fetch employees
  const { data: employees, isLoading } = useQuery({
    queryKey: ['employees'],
    queryFn: employeeService.getAllEmployees,
  });

  // Create employee mutation
  const createMutation = useMutation({
    mutationFn: employeeService.createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      message.success('Tạo nhân viên thành công!');
      setIsModalVisible(false);
      form.resetFields();
    },
    onError: () => {
      message.error('Tạo nhân viên thất bại!');
    },
  });

  // Update employee mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateEmployeeRequest }) =>
      employeeService.updateEmployee(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      message.success('Cập nhật nhân viên thành công!');
      setIsModalVisible(false);
      setEditingEmployee(null);
      form.resetFields();
    },
    onError: () => {
      message.error('Cập nhật nhân viên thất bại!');
    },
  });

  // Delete employee mutation
  const deleteMutation = useMutation({
    mutationFn: employeeService.deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      message.success('Xóa nhân viên thành công!');
    },
    onError: () => {
      message.error('Xóa nhân viên thất bại!');
    },
  });

  const handleCreateEmployee = () => {
    setEditingEmployee(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    form.setFieldsValue({
      fullName: employee.fullName,
      email: employee.email,
      dateOfBirth: dayjs(employee.dateOfBirth),
      gender: employee.gender,
      phoneNumber: employee.phoneNumber,
      active: employee.active,
    });
    setIsModalVisible(true);
  };

  const handleDeleteEmployee = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      const formData = {
        ...values,
        dateOfBirth: values.dateOfBirth.format('YYYY-MM-DD'),
      };

      if (editingEmployee) {
        // Update
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { email, password, ...updateData } = formData;
        updateMutation.mutate({ id: editingEmployee.id, data: updateData });
      } else {
        // Create
        createMutation.mutate(formData as CreateEmployeeRequest);
      }
    });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingEmployee(null);
    form.resetFields();
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender',
      render: (gender: string) => {
        const genderMap = { NAM: 'Nam', NU: 'Nữ', KHAC: 'Khác' };
        return genderMap[gender as keyof typeof genderMap] || gender;
      },
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'active',
      key: 'active',
      render: (active: boolean) => (
        <span style={{ color: active ? 'green' : 'red' }}>
          {active ? 'Hoạt động' : 'Không hoạt động'}
        </span>
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_: unknown, record: Employee) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEditEmployee(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa nhân viên này?"
            onConfirm={() => handleDeleteEmployee(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="primary" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreateEmployee}
        >
          Thêm nhân viên
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={employees}
        rowKey="id"
        loading={isLoading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingEmployee ? 'Cập nhật nhân viên' : 'Thêm nhân viên mới'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText={editingEmployee ? 'Cập nhật' : 'Thêm'}
        cancelText="Hủy"
        confirmLoading={createMutation.isPending || updateMutation.isPending}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ active: true, gender: 'NAM' }}
        >
          <Form.Item
            label="Họ và tên"
            name="fullName"
            rules={[
              { required: true, message: 'Vui lòng nhập họ và tên!' },
              { min: 4, max: 160, message: 'Họ và tên phải từ 4 đến 160 ký tự!' },
            ]}
          >
            <Input placeholder="Nhập họ và tên" />
          </Form.Item>

          {!editingEmployee && (
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không đúng định dạng!' },
              ]}
            >
              <Input placeholder="Nhập email" />
            </Form.Item>
          )}

          <Form.Item
            label="Ngày sinh"
            name="dateOfBirth"
            rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
          >
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item
            label="Giới tính"
            name="gender"
            rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
          >
            <Select placeholder="Chọn giới tính">
              <Option value="NAM">Nam</Option>
              <Option value="NU">Nữ</Option>
              <Option value="KHAC">Khác</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="phoneNumber"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại!' },
              { pattern: /^\d{10}$/, message: 'Số điện thoại phải đủ 10 số!' },
            ]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          {!editingEmployee && (
            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>
          )}

          <Form.Item label="Trạng thái" name="active" valuePropName="checked">
            <Switch checkedChildren="Hoạt động" unCheckedChildren="Không hoạt động" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EmployeeList;
