import { useAuth } from '../hooks/useAuth';

const LoginPage = () => {
  const { login } = useAuth();

  const handleLogin = (provider: 'google' | 'github' | 'facebook') => {
    login(provider);
  };

  return (
    <div>
      <button onClick={() => handleLogin('google')}>Login with Google</button>
      {/* Add other providers here */}
    </div>
  );
};

export default LoginPage;
