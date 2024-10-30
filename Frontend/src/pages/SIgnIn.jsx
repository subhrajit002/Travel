import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";


const SignIn = () => {

  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('email_verification_token');
  }, [])
  const [value, setValues] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();
  const [errors] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleInput = (event) => {
    setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('https://travel-backend-fnyd.onrender.com/auth/login', value, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('response user role', response.data.role);
      const token = response.data.jwt;
      if (token && response.data.role === "user") { // Check if token exists
        localStorage.setItem('token', token);
        setIsLoggedIn(true);
        window.location.href = '/';
      } else if (token && response.data.role === "admin") {
        localStorage.setItem('token', token);
        setIsLoggedIn(true);

        window.location.href = '/admin';
      }
      else {
        Swal.fire("Login failed, no token returned", '', "error");
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        Swal.fire("All Fields Are Required", '', "info");
      }
      else if (error.response && error.response.status === 401) {
        Swal.fire("User not found", '', "error");
      }
      else {
        Swal.fire("invalid credentials", '', "info");
      }
    }
  };


  if (isLoggedIn) {
    return null;
  }


  return (
    <div className="al bg-white  min-h-screen place-content-center flex justify-center items-center relative">
      <div className="absolute top-0 left-0">
        <img src="./aeroplane.png" alt="" className="w-[16rem] h-[16rem]" />
      </div>
      <div className="flex justify-center items-center gap-10 w-[32rem] mt-8 font-Montserrat shadow-lg hover:shadow-xl">
        <p className="text-black text-3xl font-bold cursor-pointer capitalize p-8 rounded-xl">
          <p className="text-custom-pink text-3xl font-bold">
            Welcome back, traveler!
          </p>{" "}
          Your next adventure is waiting at EasyTrip.
          <p className="text-custom-pink text-3xl font-bold">
            Log in to explore and book your next destination!
          </p>
        </p>
      </div>
      <div className="grid  bg-white border border-white h-50 w-96 border-1 rounded m-2 p-8 py-2">

        <div className="flex justify-center items-center">
          {/* <InfinitySpin color="black" radius={"8px"} /> */}
        </div>

        <form
          onSubmit={handleSubmit}
          className="ml-20 w-[24rem] p-10 rounded-2xl shadow-lg hover:shadow-xl mt-5 font-Montserrat"
        >
          <h1 className="text-2xl font-bold text-black my-4 text-center">
            Login
          </h1>

          <div className="mb-4">
            <label className="block mb-2" htmlFor="exampleInputEmail1">
              Email address
            </label>
            <input
              type="email"
              name="email"
              className="w-full border border-gray-300 rounded px-2 py-1"
              id="exampleInputEmail1"
              placeholder="Enter email"
              onChange={handleInput}
            />
            {errors.email && <span className="text-danger" > {errors.email} </span>}
          </div>
          <div className="mb-4">
            <label className="block mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              name="password"
              className="w-full border border-gray-300 rounded px-2 py-1"
              id="password"
              placeholder="Enter Password"
              onChange={handleInput}
            />
            {errors.password && <span className="text-danger" >{errors.password}</span>}
          </div>
          <div className="flex  justify-center ">
            <div className="ml-40">
              <Link to="/recover_password" className="opacity-70 ">
                Forgot Password
              </Link>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-custom-pink text-white py-2 rounded mt-4"
          >
            Sign In
          </button>

          <p className="text-center mt-4">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="text-custom-pink"
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
