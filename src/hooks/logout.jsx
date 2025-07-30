import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogOut = () => {
    dispatch({ type: 'RESET_STORE' });
    
    navigate("/login", { state: { showModal: true } });
  };

  return handleLogOut;
};

export default useLogout;
