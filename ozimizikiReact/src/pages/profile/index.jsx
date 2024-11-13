import React, { useEffect, useState } from 'react';

export default function Profile() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const accessToken = localStorage.getItem('access_token'); 

        if (accessToken) {
            fetch('http://localhost:8000/api/user/me/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }
                return response.json();
            })
            .then(data => {
                setUserData(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
                setError(error);
                setLoading(false);
            });
        } else {
            setError("No token found, please log in.");
            setLoading(false);
        }
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error.message}</p>;

    return (
        <div>
            <h2>Profile</h2>
            {userData ? (
                <div>
                    <p>Username: {userData.username}</p>
                    <p>Role: {userData.role}</p> 
                </div>
            ) : (
                <p>No user data available.</p>
            )}
        </div>
    );
}
