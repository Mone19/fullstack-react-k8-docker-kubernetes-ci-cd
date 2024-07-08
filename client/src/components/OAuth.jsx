import { Button } from 'flowbite-react';
import { AiFillGoogleCircle } from 'react-icons/ai';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export default function OAuth() {
    const auth = getAuth(app);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleGoogleClick = async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        provider.addScope('email');
        provider.addScope('profile');

        try {
            const resultsFromGoogle = await signInWithPopup(auth, provider);
            console.log('Google auth result:', resultsFromGoogle);
            const token = await resultsFromGoogle.user.getIdToken();
            const email = resultsFromGoogle._tokenResponse.email;

            if (!email) {
                throw new Error('E-Mail ist erforderlich.');
            }

            const res = await fetch(`${baseUrl}/api/auth/google`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: resultsFromGoogle.user.displayName,
                    email: email,
                    googlePhotoUrl: resultsFromGoogle.user.photoURL,
                }),
            });

            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('token', data.token);
                dispatch(signInSuccess(data));
                navigate('/');
            } else {
                console.error('Failed to login:', data);
            }
        } catch (error) {
            console.error('Google Sign In Error:', error);
        }
    };

    return (
        <Button type='button' gradientDuoTone='pinkToOrange' outline onClick={handleGoogleClick}>
            <AiFillGoogleCircle className='w-6 h-6 mr-2' />
            Continue with Google
        </Button>
    );
}
