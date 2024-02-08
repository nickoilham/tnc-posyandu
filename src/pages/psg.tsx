import { Button, Select, TextInput } from "flowbite-react";
import { ChangeEvent, FormEvent, useState } from "react";

import { FormLabel } from "@/components/PsgPageComponents";

import PublicLayout from "@/components/PublicLayout";

const PsgPage = () => {
	const [isSendData, setIsSendData] = useState(false);
	const [data, setData] = useState({
		nama: "",
		umur: "",
		berat_badan: 0,
		tinggi_badan: 0,
		jenis_kelamin: "",
		nama_orangtua: "",
	});

	const submitForm = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const nomor_tel = "+6282220017105";
		const templateChat = `Halo,
Yth Petugas Posyandu Aplikasi TNC 
\nSaya ingin mengirimkan data diri anak saya untuk dilakukan perhitungan dalam catatan Posyandu.
Berikut adalah informasi yang diperlukan:
\nNama Anak: ${data.nama} \nUmur: ${data.umur} bulan \nBerat Badan: ${data.berat_badan} kg \nJenis Kelamin: ${data.jenis_kelamin} \nTinggi Badan: ${data.tinggi_badan} \nNama Orang Tua: ${data.nama_orangtua} \n \nDengan mengirimkan data diatas saya siap untuk hasil yang diberikan. Terima kasih atas perhatiannya.`;

		window.open(
			`https://api.whatsapp.com/send?phone=${nomor_tel}&text=${encodeURIComponent(
				templateChat
			)}`
		);
		setIsSendData(true);
	};

	const onInputChange = (
		event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		setData((prev) => ({
			...prev,
			[event.target.name]: event.target.value,
		}));
	};

	const resetForm = () => {
		setData({
			nama: "",
			umur: "",
			berat_badan: 0,
			tinggi_badan: 0,
			jenis_kelamin: "",
			nama_orangtua: "",
		});
		setIsSendData(false);
	};

	return (
		<PublicLayout>
			<div className="container mx-auto min-h-screen flex items-center flex-col justify-center py-7 px-6 md:px-14 lg:px-24 xl:px-28">
				<div className="mb-8 space-y-2 w-8/12">
					<h1 className="font-bold text-2xl lg:text-3xl">
						Kirimkan Data Balita
					</h1>
					<h2 className="text-paragraph">
						Yuk moms ukur Gizi dan kebutuhan nutrisi balitamu sekarang{" "}
						<br className="hidden md:block" /> menggunakan Perhitungan gizi
						berstandar kemenkes.
					</h2>
				</div>

				<form
					className="grid gap-x-5 gap-y-5 pb-9 grid-cols-1 md:grid-cols-2 md:gap-y-6 w-8/12"
					onSubmit={submitForm}>
					<div className="w-full">
						<FormLabel label="Nama Balita" />
						<TextInput
							placeholder="Masukan nama balita."
							name="nama"
							value={data.nama}
							onChange={onInputChange}
							required
						/>
					</div>

					<div className="w-full">
						<FormLabel label="Umur Balita (dalam bulan)" />
						<TextInput
							type="number"
							placeholder="Masukan umur balita dalam bulan."
							max={60}
							min={0}
							name="umur"
							value={data.umur}
							onChange={onInputChange}
							required
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
							name="berat_badan"
							value={data.berat_badan}
							onChange={onInputChange}
							required
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
							name="tinggi_badan"
							value={data.tinggi_badan}
							onChange={onInputChange}
							required
						/>
					</div>

					<div className="w-full">
						<FormLabel label="Jenis Kelamin" />
						<Select
							placeholder="Masukan jenis kelamin balita."
							name="jenis_kelamin"
							value={data.jenis_kelamin}
							onChange={onInputChange}
							required>
							<option value="">Pilih Jenis Kelamin</option>
							<option value="laki-laki">Laki-laki</option>
							<option value="perempuan">Perempuan</option>
						</Select>
					</div>

					<div className="w-full">
						<FormLabel label="Nama Orang Tua" />
						<TextInput
							type="text"
							placeholder="Masukan Nama Orang tua"
							name="nama_orangtua"
							value={data.nama_orangtua}
							onChange={onInputChange}
							required
						/>
					</div>

					{isSendData && (
						<Button
							type="button"
							className=" bg-orange-400 hover:bg-orange-500 col-span-1 duration-500 md:col-span-2"
							onClick={resetForm}>
							Reset Form
						</Button>
					)}
					<Button
						type="submit"
						className=" bg-primary-1 col-span-1 duration-500 md:col-span-2">
						Kirim Data
					</Button>
				</form>
			</div>
		</PublicLayout>
	);
};

export default PsgPage;
