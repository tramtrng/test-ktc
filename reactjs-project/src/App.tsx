import { Layout, Typography } from 'antd';
import EmployeeList from './components/EmployeeList';
import './App.css';

const { Header, Content } = Layout;
const { Title } = Typography;

function App() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', padding: '0 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Title level={2} style={{ margin: '16px 0', color: '#1890ff' }}>
          Quản lý nhân sự
        </Title>
      </Header>
      <Content style={{ background: '#f0f2f5' }}>
        <EmployeeList />
      </Content>
    </Layout>
  );
}

export default App;
