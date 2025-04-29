import React, { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router';



const Login = () => {

    
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [popUpMessage, setPopUpMesssage] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [showloader, setShowLoader] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handlesbubmit = (e) => {
        e.preventDefault();
        setPopUpMesssage('');
        setSubmitting(true)
        setSuccessMessage('');
        setErrorMessage('');


        if (!username) {

            setPopUpMesssage("please enter username")
            setSubmitting(false);
            return
        }
        if (!password) {
            setPopUpMesssage("please enter password")
            setSubmitting(false);
            return
        }
        setShowLoader(true);
        setTimeout(() => {
            axios.post(`${import.meta.env.VITE_BACKEND_URL}/`, { username, password })
                .then((res) => {
                    localStorage.setItem('username', username);
                    setSuccessMessage(res.data.message)

                    setUsername('');
                    setPassword('');
                    setTimeout(() => {
                        navigate('/todo');
                    }, 1000)
                })
                .catch((error)=>{
                    const errorMessage = error.response.data.message || "Something went wrong";
                    setErrorMessage(errorMessage)
                })
                .finally(()=>{
                    setSubmitting(false)
                    setShowLoader(false)
                })
        }, 3000)

    }


    // to handle enter button
    const handlekeydown = (e, inputid) => {

        if (e.keyCode === 13) {
            e.preventDefault();
            const next = document.getElementById(inputid);
            if (next) {
                next.focus();
            }
        }
    }



    return (
        <>
            <div className='bg-zinc-950 h-screen flex justify-center items-center'>
                <div className='w-96 p-6 shadow-lg rounded-2xl bg-gray-900/50 border border-gray-800 relative'>

                    {showloader && (
                        <div className='absolute inset-0 bg-black/80 rounded-2xl flex flex-col justify-center items-center'>
                            <div className='w-16 h-16 rounded-full border-4 border-dashed border-purple-700 border-t-transparent animate-spin'>
                            </div>
                            <p className="mt-4 text-purple-400 text-lg font-semibold">Logging in...</p>
                        </div>

                    )}
                    < h1 className='flex justify-center text-3xl font-bold text-white'>Welcome Back</h1>
                    <p className='text-center text-gray-400 mt-2'>Enter your credentials to access your account</p>

                    {successMessage && (
                        <div className='text-green-500 text-center font-semibold mt-5'>{successMessage}</div>
                    )}

                    {errorMessage && (
                        <div className='text-red-500 text-center font-semibold mt-5'>{errorMessage}</div>
                    )}

                    {popUpMessage && (
                        <div className='text-red-500 text-center font-semibold mt-5'>{popUpMessage}</div>
                    )}

                    <form onSubmit={handlesbubmit}>
                        <div className='mt-5'>
                            <label htmlFor="Username" className='block text-gray-300 text-sm'>Username</label>
                            <input
                                type="text"
                                id='Username'
                                value={username}
                                placeholder='Enter username'
                                className='w-full text-gray-400 bg-gray-800 px-2 py-2 text-base rounded-md mt-3'
                                onChange={(e) => { setUsername(e.target.value) }}
                                onKeyDown={(e) => { handlekeydown(e, "password") }}

                            />
                        </div>

                        <div className='mt-5'>
                            <label htmlFor="Password" className='block text-gray-300 text-sm'>Password</label>
                            <input
                                type="password"
                                id='password'
                                value={password}
                                placeholder='Enter password'
                                className='w-full text-gray-400 bg-gray-800 px-2 py-2 text-base rounded-md mt-3 border border-gray-700'
                                onChange={(e) => { setPassword(e.target.value) }}
                                onKeyDown={(e) => {
                                    handlekeydown(e, "btn")
                                }}

                            />
                        </div>

                        <div className='mt-4 text-right text-sm text-gray-300'>
                            <span

                                className={`cursor-pointer hover:text-gray-500 `}
                            >
                                Forgot password?
                            </span>


                        </div>

                        <button
                            type='submit'
                            id='btn'
                            className={`mt-5 w-full py-2 text-2xl font-semibold rounded-md transition-all duration-100 bg-purple-800 text-white hover:bg-purple-950  `}
                            disabled={submitting}
                        >
                            {submitting ? "submitting" : "submit"}
                        </button>
                    </form>
                    <div className='mt-4 text-center text-base text-gray-300'>
                        Don't have an account?
                        <Link to="/Registration" className='text-purple-800 ml-2 font-medium hover:text-purple-900'>Register</Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login