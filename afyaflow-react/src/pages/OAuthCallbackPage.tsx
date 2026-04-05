import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OAuthCallbackPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { setSessionToken } = useAuth();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');

        if (token) {
            setSessionToken(token);
            navigate('/', { replace: true });
        } else {
            console.error("No token found in redirect payload.");
            navigate('/login?error=oauth_failed', { replace: true });
        }
    }, [location, navigate, setSessionToken]);

    return (
        <div className="flex justify-center items-center h-screen bg-background text-foreground">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary mt-4 inline-block"></div>
                <h2 className="mt-4 text-xl font-semibold">Authenticating...</h2>
            </div>
        </div>
    );
};

export default OAuthCallbackPage;
