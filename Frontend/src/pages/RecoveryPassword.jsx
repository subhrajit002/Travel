import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const SignIn = () => {
    const [values, setValues] = useState({
        email: ""
    });

    const handleInput = (event) => {
        setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
    }

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("Form Submitted with values:", values);

        try {
            let response = await axios.post('https://travel-backend-fnyd.onrender.com/api/forgotPassword/recoverPassword', values);
            if (response.status === 200) {
                localStorage.setItem('email_verification_token', response.data.token);
                let token = localStorage.getItem('email_verification_token');
                alert(token);
                Swal.fire("Email Sent Successfully", '', "success")
                    .then((result) => {
                        if (result.isConfirmed || result.dismiss === Swal.DismissReason.close) {
                            window.location.href = '/recover_password';
                        }
                    });
            }
        } catch (error) {
            if (error.response.status === 404) {
                Swal.fire('All fields are required', '', 'error');
            }
            else {
                Swal.fire('Internal Server Error', '', 'error');
            }
        }
    }

    return (
        <div className="al bg-slate-100 min-h-screen place-content-center flex justify-center items-center">
            <div className="grid bg-white border border-white h-50 w-96 border-1 rounded m-2 p-8 py-2">
                <form onSubmit={handleSubmit}>
                    <h1 className="text-2xl font-bold text-black my-4 text-center">
                        Recover Password
                    </h1>

                    <div className="form-group">
                        <label className="block mb-2" htmlFor="exampleInputEmail1">Email address</label>
                        <input
                            type="email"
                            className="w-full border border-gray-300 rounded px-2 py-1"
                            id="exampleInputEmail1"
                            name='email'
                            value={values.email}
                            onChange={handleInput}
                            placeholder="Enter email"
                        />
                    </div>
                    <button
                        type="submit"
                         className="w-full bg-custom-pink text-white py-2 rounded-lg mt-4"
                    >
                        Reset Password
                    </button>

                    <p className="text-center mt-4">
                    Don&apos;t have an account?{" "}
                        <button
                            type="button"
                            onClick={() => navigate("/signin")}
                            className="text-custom-pink hover:underline"
                        >
                            Sign up
                        </button>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default SignIn;
