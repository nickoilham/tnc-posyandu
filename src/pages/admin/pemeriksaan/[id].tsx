import {
	FormLabel,
	InterpretationLabelBtn,
	NutritionBox,
	PerDayNutritionBox,
} from "@/components/PsgPageComponents";
import { Button, Tabs, TextInput } from "flowbite-react";
import React, { FC, useEffect, useRef, useState } from "react";
import PublicLayout from "@/components/PublicLayout";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { useQueryClient } from "react-query";
import { GetServerSideProps } from "next";
import moment from "moment";
import axios from "axios";
import { LuWheat } from "react-icons/lu";
import { MdOutlineEggAlt } from "react-icons/md";
import { GiAlmond } from "react-icons/gi";
import { useSignal } from "@preact/signals-react";
import bbPerPb from "@/data/bbperpb.json";
import bbPerU from "@/data/bbperu.json";
import pbPerU from "@/data/pbtbperu.json";
import dynamic from "next/dynamic";
import DocumentData from "@/components/DocumentData";
import AdminLayout from "@/components/AdminLayout";

const ResultChart = dynamic(() => import("@/components/ResultChart"), {
	ssr: false,
});

export const getServerSideProps = async ({
	params,
}: {
	params: {
		id: string;
	};
}) => {
	const res = await axios.get(
		`http://localhost:3001/hasil_pemeriksaan/${params.id}`
	);
	const data = res.data;

	return { props: { data } };
};

interface ViewPemeriksaanProps {
	data: any;
}

const ViewPemeriksaan: FC<ViewPemeriksaanProps> = ({ data }) => {
	const [apiResult, setApiResult] = useState<APIResult>();
	const bbPerUChart = useRef<HTMLDivElement>(null);
	const bbPerPbChart = useRef<HTMLDivElement>(null);
	const pbPerUChart = useRef<HTMLDivElement>(null);
	const calculationResultSection = useRef<HTMLDivElement>(null);
	const [chartWidth, setChartWidth] = useState(1000);
	const [isLoading, setIsLoading] = useState(true);

	const chartData = useSignal({
		age: 0,
		weight: 0,
		height: 0,
	});

	const getDataPemeriksaan = async () => {
		const req = await axios.post("/api/psg", {
			weight: data?.berat_badan,
			height: data?.tinggi_badan,
			age: data?.umur_balita,
		});
		return req.data;
	};

	useEffect(() => {
		const fetchData = async () => {
			const result = await getDataPemeriksaan();
			setApiResult(result);
			setIsLoading(false);
		};

		fetchData();
	}, []);

	async function downloadPdf() {
		if (!apiResult) {
			return;
		}

		// setIsDownloading(true);

		const { toPng } = await import("html-to-image");
		const { saveAs } = (await import("file-saver")).default;
		const { pdf } = await import("@react-pdf/renderer");

		setTimeout(async () => {
			let canvasWidth = undefined;

			if (window.innerWidth > 1500) {
				canvasWidth = 1500 - 250;
			} else {
				canvasWidth = 1000;
			}

			const imageBbPerU = await toPng(bbPerUChart.current as HTMLDivElement, {
				cacheBust: true,
				height: 600,
				width: canvasWidth,
			});

			const imageBbPerPBb = await toPng(
				bbPerPbChart.current as HTMLDivElement,
				{
					cacheBust: true,
					height: 600,
					width: canvasWidth,
				}
			);

			const imagePbPerU = await toPng(pbPerUChart.current as HTMLDivElement, {
				cacheBust: true,
				height: 600,
				width: canvasWidth,
			});

			const dateCreated = moment().format("DD-MM-YYYY_HH-mm-ss");

			const blob = await pdf(
				<DocumentData
					biodata={{
						name: data?.nama_balita,
						weight: data?.berat_badan,
						height: data?.tinggi_badan,
						age: data?.umur_balita,
						gender: data?.jenis_kelamin,
					}}
					calculationResult={apiResult}
					imageBbPerU={imageBbPerU}
					imageBbPerPB={imageBbPerPBb}
					imagePbPerU={imagePbPerU}
				/>
			).toBlob();

			saveAs(
				blob,
				`hasil-status-gizi-${data?.nama_balita.replace(
					" ",
					"_"
				)}-${dateCreated}.pdf`
			);

			// setIsDownloading(false);
		}, 0);
	}

	useEffect(() => {
		const width = window.innerWidth;

		if (width > 1500) {
			setChartWidth(1500 - 250);
		}
	}, []);

	return (
		<AdminLayout>
			<div className="container mx-auto py-7 px-6 md:px-14 lg:px-24 xl:px-28">
				<form
					className="grid gap-x-5 gap-y-5 pb-9 grid-cols-1 md:grid-cols-2 md:gap-y-6"
					onSubmit={() => {}}>
					<div className="w-full">
						<FormLabel label="Nama Balita" />
						<TextInput
							placeholder="Masukan nama balita."
							value={data?.nama_balita}
							readOnly
						/>
					</div>

					<div className="w-full">
						<FormLabel label="Umur Balita (dalam bulan)" />
						<TextInput
							type="number"
							placeholder="Masukan umur balita dalam bulan."
							max={60}
							min={0}
							readOnly
							value={data?.umur_balita}
						/>
					</div>

					<div className="w-full">
						<FormLabel label="Berat Badan" />
						<TextInput
							type="number"
							placeholder="Masukan berat badan dalam Kg."
							inputMode="decimal"
							step={0.1}
							min={0}
							readOnly
							value={data?.berat_badan}
						/>
					</div>

					<div className="w-full">
						<FormLabel label="Tinggi Badan" />
						<TextInput
							type="number"
							placeholder="Masukan tinggi badan dalam Cm."
							inputMode="decimal"
							step={0.1}
							min={0}
							readOnly
							value={data?.tinggi_badan}
						/>
					</div>

					<div className="w-full">
						<FormLabel label="Jenis Kelamin" />
						<TextInput type="text" readOnly value={data?.jenis_kelamin} />
					</div>
					<div className="w-full">
						<FormLabel label="Nama Orang Tua" />
						<TextInput type="text" readOnly value={data?.nama_orangtua} />
					</div>
					<div className="w-full">
						<FormLabel label="Tanggal Periksa" />
						<p>{moment(data?.tgl_pemeriksaan).format("DD-MM-YYYY")}</p>
					</div>
				</form>

				{isLoading && <h1>Loading Data...</h1>}

				{apiResult && (
					<div className="flex flex-col space-y-4">
						<h1 className="text-center text-2xl font-bold">
							Hasil Perhitungan
						</h1>

						<Button
							onClick={() => downloadPdf()}
							className="bg-primary-1 duration-500">
							Download hasil perhitungan.
						</Button>

						<Tabs.Group
							style="underline"
							className="border border-gray-200 rounded-md">
							<Tabs.Item title="Rangkuman" tabIndex={0}>
								<div className="space-y-8 px-5 pb-6 mx-auto xl:w-10/12">
									<div className="border-1 p-4 grid mx-auto gap-x-3 gap-y-2 lg:grid-cols-3">
										<h2>
											Balita anda memiliki :{" "}
											<span className="font-bold">
												{apiResult?.bb_u_informations.status}{" "}
											</span>
										</h2>
										<h2>
											Balita anda tergolong Gizi :{" "}
											<span className="font-bold">
												{apiResult?.bb_pb_informations.status}{" "}
											</span>
										</h2>
										<h2>
											Tinggi/Panjang Badan Balita anda :{" "}
											<span className="font-bold">
												{apiResult?.pb_tb_u_informations.status}{" "}
											</span>
										</h2>
									</div>

									<h1 className="text-center font-bold text-lg lg:text-2xl">
										Nutrisi Yang Di Butuhkan Per Hari
									</h1>

									<div className="flex flex-col justify-center items-center space-y-12 lg:flex-row lg:justify-center lg:space-x-14 xl:space-x-20">
										<div className="border-8 border-[#32B6C1] rounded-full w-[150px] h-[150px] flex justify-center items-center flex-col space-y-2 lg:w-[180px] lg:h-[180px]">
											<h2 className="lg:text-lg">Total Energi</h2>
											<h3 className="font-bold text-3xl">
												{apiResult?.nutritionNeeds.energi}
											</h3>
											<p>Energi</p>
										</div>

										<div className="flex flex-row items-center space-x-3 text-center md:space-x-6 xl:space-x-10">
											<NutritionBox
												Icon={LuWheat}
												result={apiResult?.nutritionNeeds.karbo}
												title="Karbohidrat"
											/>

											<NutritionBox
												Icon={MdOutlineEggAlt}
												result={apiResult?.nutritionNeeds.protein}
												title="Protein"
											/>

											<NutritionBox
												Icon={GiAlmond}
												result={apiResult?.nutritionNeeds.lemak}
												title="Lemak"
											/>
										</div>
									</div>

									<h1 className="text-center pt-5 font-bold text-xl lg:text-2xl">
										Konsumsi Gizi Seimbang yang disarankan
									</h1>

									<div className="border border-b-0 w-full rounded-md">
										<PerDayNutritionBox
											time="Pagi"
											nutritionNeeds={{
												energy:
													apiResult?.nutritionNeedsPerServing.energi_pagi_siang,
												carbo:
													apiResult?.nutritionNeedsPerServing.karbo_pagi_siang,
												fat: apiResult?.nutritionNeedsPerServing
													.lemak_pagi_siang,
												protein:
													apiResult?.nutritionNeedsPerServing
														.protein_pagi_siang,
											}}
										/>

										<PerDayNutritionBox
											time="Siang"
											nutritionNeeds={{
												energy:
													apiResult?.nutritionNeedsPerServing.energi_pagi_siang,
												carbo:
													apiResult?.nutritionNeedsPerServing.karbo_pagi_siang,
												fat: apiResult?.nutritionNeedsPerServing
													.lemak_pagi_siang,
												protein:
													apiResult?.nutritionNeedsPerServing
														.protein_pagi_siang,
											}}
										/>

										<PerDayNutritionBox
											time="Malam"
											nutritionNeeds={{
												energy:
													apiResult?.nutritionNeedsPerServing.energi_malam,
												carbo: apiResult?.nutritionNeedsPerServing.karbo_malam,
												fat: apiResult?.nutritionNeedsPerServing.lemak_malam,
												protein:
													apiResult?.nutritionNeedsPerServing.protein_malam,
											}}
										/>
									</div>
								</div>
							</Tabs.Item>

							<Tabs.Item title="Berat Badan per Umur" tabIndex={0}>
								<div className="overflow-x-auto mb-5">
									<div
										className="flex xl:justify-center xl:items-center"
										ref={bbPerUChart}>
										<ResultChart
											xTitle="Umur (bulan)"
											yTitle="Berat Badan (kg)"
											chartData={bbPerU}
											xSkipSize={2}
											width={chartWidth}
											resultPoints={{
												x: chartData.value.age,
												y: chartData.value.weight,
											}}
										/>
									</div>
								</div>

								<div className="space-y-2">
									<InterpretationLabelBtn
										hex={apiResult?.bb_u_informations.hex}
										status={apiResult?.bb_u_informations.status}
									/>
									<p>Nilai BBU : {apiResult?.bbu.toFixed(2)}</p>
									<p className="text-paragraph lg:w-2/3">
										{apiResult?.bb_u_informations.articles}
									</p>
								</div>
							</Tabs.Item>

							<Tabs.Item title="Berat Badan per Panjang Badan" tabIndex={0}>
								<div className="overflow-x-auto mb-6">
									<div
										className="flex xl:justify-center xl:items-center"
										ref={bbPerPbChart}>
										<ResultChart
											xTitle="Panjang Badan (cm)"
											yTitle="Berat Badan (kg)"
											chartData={bbPerPb}
											xSkipSize={5}
											width={chartWidth}
											resultPoints={{
												x: chartData.value.height,
												y: chartData.value.weight,
											}}
										/>
									</div>
								</div>

								<div className="space-y-2">
									<InterpretationLabelBtn
										hex={apiResult?.bb_pb_informations.hex}
										status={apiResult?.bb_pb_informations.status}
									/>
									<p>Nilai BB/PB : {apiResult?.bb_pb.toFixed(2)}</p>
									<p className="text-paragraph lg:w-2/3">
										{apiResult?.bb_pb_informations.articles}
									</p>
								</div>
							</Tabs.Item>

							<Tabs.Item title="Panjang Badan per Umur" tabIndex={0}>
								<div className="overflow-x-auto mb-6">
									<div
										className="flex xl:justify-center xl:items-center"
										ref={pbPerUChart}>
										<ResultChart
											xTitle="Umur (bulan)"
											yTitle="Panjang Badan (cm)"
											chartData={pbPerU}
											xSkipSize={2}
											width={chartWidth}
											resultPoints={{
												x: chartData.value.age,
												y: chartData.value.height,
											}}
										/>
									</div>
								</div>

								<div className="space-y-2">
									<InterpretationLabelBtn
										hex={apiResult?.pb_tb_u_informations.hex}
										status={apiResult?.pb_tb_u_informations.status}
									/>
									<p>Nilai PB/U : {apiResult?.pb_tb_u.toFixed(2)}</p>
									<p className="text-paragraph lg:w-2/3">
										{apiResult?.pb_tb_u_informations.articles}
									</p>
								</div>
							</Tabs.Item>
						</Tabs.Group>
					</div>
				)}
			</div>
		</AdminLayout>
	);
};

export default ViewPemeriksaan;
