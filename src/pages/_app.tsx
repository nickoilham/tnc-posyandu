import type { AppProps } from "next/app";
import "rc-pagination/assets/index.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/globals.css";
import { QueryClientProvider } from "react-query";
import { queryClient } from "@/helpers/reactQuery";
import nProgress from "nprogress";
import "nprogress/nprogress.css";
import { Router } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
	nProgress.configure({
		showSpinner: false,
	});

	Router.events.on("routeChangeStart", nProgress.start);
	Router.events.on("routeChangeError", nProgress.done);
	Router.events.on("routeChangeComplete", nProgress.done);
	return (
		<QueryClientProvider client={queryClient}>
			<Component {...pageProps} />
			<ToastContainer
				position="top-right"
				autoClose={1500}
				hideProgressBar
				newestOnTop={false}
				closeOnClick={false}
				rtl={false}
				pauseOnFocusLoss={false}
				draggable={false}
				pauseOnHover={false}
				theme="light"
			/>
		</QueryClientProvider>
	);
}
