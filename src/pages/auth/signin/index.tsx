import React, { ChangeEvent, FC, FormEvent, useState } from "react";
import { Button, Label, TextInput } from "flowbite-react";
import axios from "axios";
import { toast } from "react-toastify";
import { setCookie } from "@/helpers/save-cookies";
import { useRouter } from "next/navigation";

interface SignInPageProps {}

const SignInPage: FC<SignInPageProps> = ({}) => {
	const router = useRouter();
	const [loginPayload, setLoginPayload] = useState({
		email: "",
		password: "",
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
			const req = await axios.post("http://localhost:3001/login", {
				email: loginPayload.email,
				password: loginPayload.password,
			});
			toast.info(req.data.message);
			setCookie("token", req.data.token);
			setCookie("data", req.data.user);
			router.refresh();
		} catch (error: any) {
			toast.info(error?.response?.data.message);
		}
	};

	return (
		<div className="w-1/4 flex justify-center items-center min-h-screen mx-auto">
			<form className="flex w-full flex-col gap-4" onSubmit={onSubmit}>
				<div>
					<div className="mb-2 block">
						<Label htmlFor="email1" value="Your email" />
					</div>
					<TextInput
						id="email1"
						type="email"
						placeholder="name@flowbite.com"
						required
						name="email"
						onChange={onInputChange}
					/>
				</div>
				<div>
					<div className="mb-2 block">
						<Label htmlFor="password1" value="Your password" />
					</div>
					<TextInput
						id="password1"
						type="password"
						name="password"
						onChange={onInputChange}
						required
					/>
				</div>
				<Button type="submit">Submit</Button>
			</form>
		</div>
	);
};

export default SignInPage;
