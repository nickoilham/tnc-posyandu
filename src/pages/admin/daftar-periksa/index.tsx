import React, { ChangeEvent, FC, useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import {
	QueryClient,
	useMutation,
	useQuery,
	useQueryClient,
} from "react-query";
import moment from "moment";
import { toast } from "react-toastify";
import Link from "next/link";
import axios from "axios";
import Pagination from "rc-pagination/lib/Pagination";
import { Datepicker } from "flowbite-react";
import { formatDateToMonthYear } from "@/helpers/utlis";

type DataPeriksaType = {
	id: any;
	nama_orangtua: string;
	nama_balita: string;
	umur_balita: number;
	berat_badan: number;
	tinggi_badan: number;
	jenis_kelamin: string;
	status_gizi: string;
	tgl_pemeriksaan: Date;
};

interface DaftarPasienPageProps {}

const DaftarPasienPage: FC<DaftarPasienPageProps> = ({}) => {
	const [selectedDate, setSelectedDate] = useState<string>();
	const [dateToDisplay, setDateToDisplay] = useState<string>();
	const [pageSize, setPageSize] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);
	const queryClient = useQueryClient();

	const month = selectedDate?.split("/")[1];
	const year = selectedDate?.split("/")[2];

	const { data, isLoading } = useQuery({
		queryKey: ["get_all_data_periksa", { currentPage, month, year }],
		queryFn: async () => {
			const request = await axios.get(
				"http://localhost:3001/hasil_pemeriksaan",
				{
					params: {
						limit: pageSize,
						page: currentPage,
						month,
						year,
					},
				}
			);
			return request.data;
		},
	});

	const onPageChange = (page: number) => {
		setCurrentPage(page);
	};

	const onDateChange = (event: Date) => {
		var date = new Date(event);
		var formattedDate = date.toLocaleDateString("en-GB");

		setSelectedDate(formattedDate);
		setDateToDisplay(formatDateToMonthYear(String(formattedDate)));
	};

	const deleteDataPeriksa = useMutation({
		mutationKey: ["delete_data_periksa"],
		mutationFn: async (id) => {
			return await fetch(`http://localhost:3001/hasil_pemeriksaan/${id}`, {
				method: "DELETE",
			});
		},
		onSuccess: (data, context, variable) => {
			queryClient.refetchQueries({
				queryKey: ["get_all_data_periksa"],
			});
			toast("Hasil pemeriksaan deleted successfully");
		},
		onError: () => {
			toast("Error Deleting Data");
		},
	});

	useEffect(() => {
		setDateToDisplay(
			formatDateToMonthYear(new Date().toLocaleDateString("en-GB"))
		);
	}, []);

	const badgeMatchColor: any = {
		"gizi buruk": "#ff6384",
		"gizi kurang": "#ffce56",
		"gizi baik": "#4bc0c0",
		"beresiko gizi lebih": "#9966ff",
		"gizi lebih": "#36a2eb",
		obesitas: "#ff9f40",
	};

	return (
		<AdminLayout>
			<main className="w-full flex-grow p-6">
				<h1 className="text-3xl text-black pb-6">Daftar Periksa</h1>
				<div className="w-full mt-5">
					<div className="w-fit">
						<div className="flex flex-col">
							<label htmlFor="datePicker">Filter Bulan dan Tahun</label>
							<Datepicker
								id="datePicker"
								className="my-3 z-50"
								onSelectedDateChanged={onDateChange}
								weekStart={1}
								value={dateToDisplay}
								title="Filter Bulan dan Tahun"
							/>
						</div>
					</div>
					<div className="bg-white">
						<table className="min-w-full leading-normal">
							<thead>
								<tr>
									<th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
										Nama Orang Tua
									</th>
									<th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
										Nama Balita
									</th>
									<th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
										Umur (Bulan)
									</th>
									<th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
										Berat Badan (Kg)
									</th>
									<th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
										Tinggi Badan (Cm)
									</th>
									<th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
										Jenis Kelamin
									</th>
									<th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
										Status Gizi
									</th>
									<th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
										Tanggal Pemeriksaan
									</th>
									<th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
										Opsi
									</th>
								</tr>
							</thead>
							<tbody>
								{!isLoading &&
									data?.result?.map((item: DataPeriksaType, index: number) => (
										<tr key={index}>
											<td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
												<div className="flex items-center">
													<div className="ml-3">
														<p className="text-gray-900 whitespace-no-wrap">
															{item.nama_orangtua}
														</p>
													</div>
												</div>
											</td>
											<td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
												<div className="flex items-center">
													<div className="ml-3">
														<p className="text-gray-900 whitespace-no-wrap">
															{item.nama_balita}
														</p>
													</div>
												</div>
											</td>
											<td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
												<p className="text-gray-900 whitespace-no-wrap">
													{item.umur_balita}
												</p>
											</td>
											<td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
												<p className="text-gray-900 whitespace-no-wrap">
													{item.berat_badan}
												</p>
											</td>
											<td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
												<p className="text-gray-900 whitespace-no-wrap">
													{item.tinggi_badan}
												</p>
											</td>
											<td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
												<p className="text-gray-900 whitespace-no-wrap capitalize">
													{item.jenis_kelamin}
												</p>
											</td>
											<td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
												<span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
													<span
														aria-hidden
														className={`absolute inset-0 opacity-50 rounded-full
													`}
														style={{
															backgroundColor:
																badgeMatchColor[
																	item.status_gizi.toLocaleLowerCase()
																],
														}}></span>
													<span className="relative">{item.status_gizi}</span>
												</span>
											</td>
											<td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
												<p className="text-gray-900 whitespace-no-wrap">
													{moment(item.tgl_pemeriksaan).format("LL")}
												</p>
											</td>
											<td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
												<div className="flex gap-10">
													<Link
														href={`/admin/pemeriksaan/${item.id}`}
														className="relative inline-block px-5 py-3 font-semibold text-white-900 leading-tight bg-blue-200 rounded-md">
														Lihat Data
													</Link>

													<button
														className="relative inline-block px-5 py-3 font-semibold text-white-900 leading-tight bg-red-200 rounded-md"
														onClick={() => deleteDataPeriksa.mutate(item.id)}>
														Hapus
													</button>
												</div>
											</td>
										</tr>
									))}
							</tbody>
						</table>
						<div className="flex justify-end mt-3">
							<Pagination
								defaultPageSize={pageSize}
								total={data?.totalData}
								current={currentPage}
								onChange={onPageChange}
							/>
						</div>
					</div>
				</div>
			</main>
		</AdminLayout>
	);
};

export default DaftarPasienPage;
