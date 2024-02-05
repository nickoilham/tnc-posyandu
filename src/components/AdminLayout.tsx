"use client";

import React, { FC, useEffect, useState } from "react";
import Link from "next/link";
import MetaHead from "./MetaHead";
import { RxDashboard } from "react-icons/rx";
import { FaBaby } from "react-icons/fa";
import { TbLogout } from "react-icons/tb";
import { removeCookie } from "@/helpers/save-cookies";
import { useRouter } from "next/navigation";
import { getCookie } from "@/helpers/save-cookies";

interface AdminLayoutProps {
	children: React.ReactNode;
}

const AdminLayout: FC<AdminLayoutProps> = ({ children }) => {
	const router = useRouter();
	const [username, setUsername] = useState();

	const onLogout = () => {
		removeCookie("token");
		removeCookie("data");
		router.refresh();
	};

	useEffect(() => {
		const data = getCookie("data");
		setUsername(data.username);
	}, []);

	return (
		<>
			<MetaHead />
			<div className="font-family-karla flex text-black font-semibold">
				<aside className="relative bg-sidebar h-screen w-64 hidden sm:block shadow-xl">
					<div className="p-6">
						<Link
							href="/admin/dashboard"
							className=" text-3xl font-semibold uppercase hover:text-gray-300">
							Admin
						</Link>
					</div>
					<nav className="flex flex-col pt-4">
						<Link
							href="/admin/dashboard"
							className="flex items-center active-nav-link  py-2 pl-4 nav-item">
							<RxDashboard className="mr-3" />
							Dashboard
						</Link>
						<Link
							href="/admin/daftar-periksa"
							className="flex items-center  opacity-75 hover:opacity-100 py-2 pl-4 nav-item">
							<FaBaby className="mr-3" />
							Daftar Pemeriksaan
						</Link>
						<Link
							href="/admin/hitung-psg"
							className="flex items-center  opacity-75 hover:opacity-100 py-2 pl-4 nav-item">
							<FaBaby className="mr-3" />
							Hitung PSG
						</Link>
						<div
							onClick={onLogout}
							className="flex items-center  opacity-75 hover:opacity-100 hover:text-red-500 py-2 pl-4 nav-item cursor-pointer">
							<TbLogout className="mr-3" />
							Sign Out
						</div>
					</nav>
				</aside>

				<div className="w-full flex flex-col h-screen overflow-y-hidden">
					<div className="flex justify-end p-5">
						<h1 className="text-xl font-semibold">
							Selamat Datang, {username}{" "}
						</h1>
					</div>

					<div className="w-full overflow-x-hidden border-t flex flex-col">
						{children}
						<footer className="w-full bg-white text-right p-4"></footer>
					</div>
				</div>
			</div>
		</>
	);
};

export default AdminLayout;
