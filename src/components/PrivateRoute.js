import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('apexTrackerUser'));

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    return user ? children : null;
};

export default PrivateRoute;