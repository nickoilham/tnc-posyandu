import React, { ChangeEvent, FC, FormEvent, useState } from 'react';
import { Button, Label, TextInput } from 'flowbite-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { setCookie } from '@/helpers/save-cookies';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import DoctorImage from 'public/images/dokter-min.png';
import TNCLogo from 'public/icons/tnc_logo_white.png';

interface SignInPageProps {}

const SignInPage: FC<SignInPageProps> = ({}) => {
  const router = useRouter();
  const [loginPayload, setLoginPayload] = useState({
    email: '',
    password: '',
  });

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLoginPayload((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const req = await axios.post('http://localhost:3001/login', {
        email: loginPayload.email,
        password: loginPayload.password,
      });
      toast.info(req.data.message);
      setCookie('token', req.data.token);
      setCookie('data', req.data.user);
      router.refresh();
    } catch (error: any) {
      toast.info(error?.response?.data.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="relative flex flex-col m-6 space-y-8 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0">
        {/* Left side */}
        <div className="flex flex-col justify-center p-8 md:p-14">
          <span className="mb-3 text-4xl font-bold">Selamat datang</span>
          <span className="font-medium text-gray-400 mb-2">
            Selamat datang kembali!
            <br />
            Silahkan masuk ke akun Anda
          </span>
          <div className="py-4">
            <span className="mb-2 text-md font-bold">Email</span>
            <TextInput
              id="email1"
              type="email"
              placeholder="name@flowbite.com"
              required
              name="email"
              onChange={onInputChange}
              className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
            />
          </div>
          <div className="py-4">
            <span className="mb-2 text-md  font-bold">Password</span>
            <TextInput
              id="password1"
              type="password"
              name="password"
              onChange={onInputChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
            />
          </div>
          <Button
            className="w-full text-white p-2 rounded-lg mb-6 hover:bg-white hover:border hover:border-gray-300"
            type="submit"
          >
            Sign in
          </Button>
          <Link href="/">
            <Button
              className="w-full bg-blue-600 border border-gray-300 text-md p-2 rounded-lg mb-6 hover:bg-black enabled:hover:bg-blue-800 hover:text-white"
              type="button"
            >
              Kembali ke Home
            </Button>
          </Link>
        </div>
        {/* Right side */}
        <div className="relative flex items-center justify-center">
          <Image
            src={DoctorImage}
            alt="Gambar dokter"
            className="w-[400px] h-full hidden rounded-r-2xl md:block object-cover brightness-50"
          />

          <h1 className="absolute z-10 top-[25%]">
            <Image
              src={TNCLogo}
              alt="Gambar logo"
              className="w-[200px] h-full hidden rounded-r-2xl md:block object-cover"
            />
          </h1>

          {/* Text on image */}
          <div className="absolute hidden bottom-10 right-6 p-6 bg-teal-500 bg-opacity-30 backdrop-blur-sm rounded drop-shadow-lg md:block">
            <span className="text-white text-s text-center font-bold">
              Selamat menggunakan Aplikasi TNC
              <br />
              Terima kasih telah menjadi bagian untuk
              <br />
              meningkatkan kesehatan dan status gizi balita.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
