import React, { FC } from "react";
import MetaHead from "./MetaHead";
import CustomNavbar from "./CustomNavbar";
import { ToastContainer } from "react-toastify";
import { poppins, suisseNeue } from "@/helpers/registerFont";
import CustomFooter from "./CustomFooter";

interface PublicLayoutProps {
	children: React.ReactNode;
}

const PublicLayout: FC<PublicLayoutProps> = ({ children }) => {
	return (
		<>
			<MetaHead />

			<div
				className={`min-h-screen pt-[70px] pb-12 relative ${poppins.variable} ${suisseNeue.variable}`}>
				<CustomNavbar />
				{children}
			</div>

			<CustomFooter />
		</>
	);
};

export default PublicLayout;
