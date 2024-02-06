import React, { FC } from "react";
import AdminLayout from "@/components/AdminLayout";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useQuery } from "react-query";
import axios from "axios";

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
);

export const options = {
	responsive: true,
	plugins: {
		legend: {
			position: "top" as const,
		},
		title: {
			display: true,
			text: "Jumlah Status Gizi Balita",
		},
	},
	maintainAspectRatio: true,
	aspectRatio: 2,
};

const labels = [
	"Gizi Buruk",
	"Gizi Kurang",
	"Gizi Baik",
	"Beresiko Gizi Lebih",
	"Gizi Lebih",
	"Obesitas",
];

interface AdminPageProps {}

const AdminPage: FC<AdminPageProps> = ({}) => {
	const { data: chartData } = useQuery(["get_chart_data"], async () => {
		const request = await axios.get("http://localhost:3001/chartData");
		return request.data;
	});

	const data = {
		labels,
		datasets: [
			{
				label: "Jumlah Status Gizi",
				data: chartData,
				backgroundColor: [
					"rgba(255, 99, 132, 0.2)",
					"rgba(255, 206, 86, 0.2)",
					"rgba(75, 192, 192, 0.2)",
					"rgba(153, 102, 255, 0.2)",
					"rgba(54, 162, 235, 0.2)",
					"rgba(255, 159, 64, 0.2)",
				],
				borderColor: [
					"rgba(255, 99, 132, 1)",
					"rgba(255, 206, 86, 1)",
					"rgba(75, 192, 192, 1)",
					"rgba(153, 102, 255, 1)",
					"rgba(54, 162, 235, 1)",
					"rgba(255, 159, 64, 1)",
				],
				borderWidth: 1,
			},
		],
	};

	return (
		<AdminLayout>
			<main className="w-full flex-grow p-6 min-h-screen">
				<h1 className="text-3xl text-black pb-6">Dashboard</h1>

				<div className="flex flex-wrap mt-6">
					<div className="w-full pr-0 lg:pr-2">
						<p className="text-xl pb-3 flex items-center">
							Jumlah Status Pemeriksaan Balita
						</p>
						<div className="p-6 bg-white h-[500px]">
							<Bar options={options} data={data} />
						</div>
					</div>
				</div>
			</main>
		</AdminLayout>
	);
};

export default AdminPage;
