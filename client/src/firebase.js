import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyBBhXe9txFhEzOSHroFpPF6_5hrOC4VdZA',
	authDomain: 'mern-shop-97474.firebaseapp.com',
	projectId: 'mern-shop-97474',
	storageBucket: 'mern-shop-97474.appspot.com',
	messagingSenderId: '770251493750',
	appId: '1:770251493750:web:ad74185492f277b93c2a57',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
//export const googleAuthProvider = auth.GoogleAuthProvider();
