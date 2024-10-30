import axios from 'axios';
import { useState } from 'react';
import Swal from 'sweetalert2';



const ResetPassword = () => {


    const [values, setValues] = useState({
        password: "",
        confirm_password: ""
    })

    const handleInput = (event) => {
        setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }))

    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        let token = localStorage.getItem('email_verification_token');
        if (!token) {
            return alert("Not authorized");
        }

        try {
            let response = await axios.post(`https://travel-backend-fnyd.onrender.com/api/forgotPassword/resetPassword?token=${token}`, values, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                Swal.fire("Password Changed Successfully", '', "success")
                    .then((result) => {
                        if (result.isConfirmed || result.dismiss === Swal.DismissReason.close) {
                            window.location.href = '/signin';
                        }
                    });
            }

        } catch (error) {
            if (error.response && error.response.status === 404) {
                Swal.fire("User not found", '', "info");
            } else if (error.response && error.response.data.message) {
                Swal.fire(error.response.data.message, '', 'error'); // Show backend error message
            } else {
                Swal.fire("Internal Server Error", '', "error");
            }
        }
    }

    return (
        <div className="al bg-slate-100  min-h-screen place-content-center flex justify-center items-center">
            <div className="grid  bg-white border border-white h-50 w-96 border-1 rounded m-2 p-8 py-2">
                <form onSubmit={handleSubmit}>
                    <h1 className="text-2xl font-bold text-black my-4 text-center">
                        Create new Password
                    </h1>
                    
                    <div className="mb-4">
                        <label className="block mb-2" htmlFor="exampleInputEmail1">New Password</label>
                        <input
                            type="password"
                            className="w-full border border-gray-300 rounded px-2 py-1"
                            id="exampleInputEmail1"
                            name='password'
                            value={values.password}
                            onChange={handleInput}
                            placeholder="Enter password"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2" htmlFor="exampleInputEmail1">Confirm Password</label>
                        <input
                            type="password"
                            className="w-full border border-gray-300 rounded px-2 py-1"
                            id="exampleInputEmail1"
                            name='confirm_password'
                            value={values.confirm_password}
                            onChange={handleInput}
                            placeholder="Confirm password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="text-custom-pink hover:underline"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ResetPassword
