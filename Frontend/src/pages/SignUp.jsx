import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2"

const SignUp = () => {
  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();
  const [errors] = useState({});


  const handleInput = (event) => {
    setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  // Form submission handler
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      let response = await axios.post('https://travel-backend-fnyd.onrender.com/auth/register', values, {
        'Content-Type': 'application/json',
      });
      if (response.status === 201) {
        Swal.fire("Registered Successfully", '', "success")
          .then((result) => {
            if (result.isConfirmed || result.dismiss === Swal.DismissReason.close) {
              window.location.href = '/';
              const token = response.data.jwt;
              localStorage.setItem('token', token);
            }
          });
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        Swal.fire("All Fields Are Required", '', "info");
      }
      else if (error.response && error.response.status == 400) {
        Swal.fire("", 'Email already in use', "info");
      }
      else {
        Swal.fire("Internal Server Error", '', "danger");
      }

    }
  };

  return (
    <div className="al bg-white min-h-screen place-content-center flex justify-center items-center">
      <div className="absolute top-0 left-0">
        <img src="./aeroplane.png" alt="" className="w-[14rem] h-[14rem]" />
      </div>
      <div className="flex justify-center items-center gap-10 w-[32rem] mt-8 font-Montserrat shadow-lg hover:shadow-xl">
        <p className="text-black text-3xl font-bold cursor-pointer capitalize p-8 rounded-xl">
          <p className="text-custom-pink text-3xl font-bold">
            Adventure awaits! Join EasyTrip
          </p>{" "}
          and book unforgettable journeys with ease. Your dream trip is{" "}
          <p className="text-custom-pink text-3xl font-bold">
            few clicks away!
          </p>
        </p>
      </div>
      <div className="grid bg-white border border-white h-50 w-96 border-1 rounded m-2 p-8 py-2">
        <div className="flex justify-center items-center">
          <l-reuleaux
            size="40"
            stroke="5"
            stroke-length="0.15"
            bg-opacity="0"
            speed="1.2"
            color="black"
          ></l-reuleaux>
        </div>
        <form
          onSubmit={handleSubmit}
          className="p-10 rounded-2xl shadow-lg hover:shadow-xl w-[28rem] mt-8 ml-5 py-3"
        >
          <h1 className="text-3xl font-bold text-black my-3 text-center">
            Sign Up
          </h1>
          <div className="mb-6">
            <label
              htmlFor="firstName"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              First Name
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-custom-pink"
              id="firstName"
              placeholder="Enter Your First Name"
              name="firstName"
              onChange={handleInput}
            />
            {errors.firstName && <span className='text-danger'>{errors.firstName}</span>}
          </div>
          <div className="mb-6">
            <label
              htmlFor="lastName"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Last Name
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-custom-pink"
              id="lastName"
              placeholder="Enter Your Last Name"
              name="lastName"
              onChange={handleInput}
            />
            {errors.lastName && <span className='text-danger'>{errors.lastName}</span>}
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-custom-pink"
              id="email"
              placeholder="Enter Your Email"
              name="email"
              onChange={handleInput}
            />
            {errors.email && <span className='text-danger'>{errors.email}</span>}
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-custom-pink"
              id="password"
              placeholder="Enter Your Password"
              name="password"
              onChange={handleInput}
            />
            {errors.password && <span className='text-danger'>{errors.password}</span>}
          </div>
          <button
            type="submit"
            className="w-full bg-custom-pink text-white py-2 rounded-lg mt-4"
          >
            Sign Up
          </button>
          <p className="text-center mt-4">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/SignIn")}
              className="text-custom-pink hover:underline"
            >
              Login
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
