import { useAuth } from '../hooks/useAuth';

const LoginPage = () => {
  const { signInWithGoogle } = useAuth();

  const handleLogin = () => {
    signInWithGoogle();
  };

  return (
    <div>
      <button onClick={handleLogin}>Login with Google</button>
    </div>
  );
};

export default LoginPage;
