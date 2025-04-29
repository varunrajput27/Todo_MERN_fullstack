import React, { useState } from 'react';
import { Link } from 'react-router';
import axios from 'axios'
require('dotenv').config();

const Registration = () => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [popupmessage, setPopUpMessage] = useState('');
    const [showloader, setShowLoader] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [successmessage, setSuccessMessage] = useState('');
    const [agree, setAgree] = useState(false);
    const [errormessage, setErrorMesssage] = useState('');



    const handlesubmit = (e) => {
        e.preventDefault();
        setPopUpMessage('')

        setSubmitting(true);
        if (!name || !username || !password) {
            setPopUpMessage("please fill all the fields");
            setSubmitting(false);
            return;
        }
        if (!agree) {
            setPopUpMessage('Please accept the Terms and Conditions.');
            setSubmitting(false);
            return;
        }
        setShowLoader(true)
        setTimeout(() => {

            axios.post(`${import.meta.env.VITE_BACKEND_URL}/registration`, { name, username, password })
                .then((res) => {
                    setSuccessMessage(res.data.message)
                    setName('');
                    setUsername('');
                    setPassword('');
                    setAgree(false);
                    setTimeout(() => {
                        setSuccessMessage('');
                    }, 2000);
                })
                .catch((error) => {
                    const errorMessage = error.response.data.message || "Something went wrong";
                    setErrorMesssage(errorMessage);
                    setTimeout(() => {
                        setErrorMesssage('');
                    }, 2000);

                })
           .finally(()=>{
                setSubmitting(false);
                setShowLoader(false);

            },3000) 


        }, 2000)




    }

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
                        <div className='absolute inset-0 bg-black/80 rounded-2xl flex flex-col justify-center items-center z-50'>
                            <div className=' w-16 h-16 border-4 border-dashed border-purple-800 border-t-transparent  rounded-full animate-spin'>

                            </div>
                        </div>
                    )}
                    <h1 className='text-3xl font-bold text-center text-white'>Create an Account</h1>
                    <p className='text-center text-gray-400 mt-2'>Enter your details to register</p>
                    {successmessage && (
                        <div className='text-green-500 text-center font-semibold mt-5'>{successmessage}</div>
                    )}
                    {errormessage && (
                        <div className='text-red-500 text-center font-semibold mt-5'>{errormessage}</div>
                    )}
                    {popupmessage && (
                        <div className='text-red-500 text-center font-semibold mt-5'>{popupmessage}</div>
                    )}
                    <form onSubmit={handlesubmit} >
                        <div className='mt-5'>
                            <label htmlFor="Username" className='block text-gray-300 text-sm'>Name</label>
                            <input
                                type="text"
                                id='name'
                                value={name}
                                placeholder='Enter username'
                                className='w-full text-gray-400 bg-gray-800 px-2 py-2 text-base rounded-md mt-3'
                                onChange={(e) => { setName(e.target.value) }}
                                onKeyDown={(e) => { handlekeydown(e, "username") }}

                            />
                        </div>
                        <div className='mt-5'>
                            <label htmlFor="Username" className='block text-gray-300 text-sm'>Username</label>
                            <input
                                type="text"
                                id='username'
                                value={username}
                                placeholder='Enter your name'
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

                        <div className='mt-4'>
                            <p className='text-gray-300 text-sm'>
                                <input
                                    type="checkbox"
                                    className='mr-2'
                                    checked={agree}
                                    onChange={(e) => setAgree(e.target.checked)}
                                />
                                I agree to the Terms of Service and Privacy Policy.
                            </p>
                        </div>


                        <button
                            type='submit'
                            id='btn'
                            className={`mt-5 w-full py-2 text-2xl font-semibold rounded-md transition-all duration-100 bg-purple-800 text-white hover:bg-purple-950 `}
                            disabled={submitting}
                        >
                            {submitting ? 'please wait' : "register"}
                        </button>
                    </form>
                    <div className='mt-4 text-center text-base text-gray-300'>
                        Already have an account?{' '}
                        <Link to="/" className='text-purple-800 hover:text-purple-900 font-medium'>Login</Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Registration