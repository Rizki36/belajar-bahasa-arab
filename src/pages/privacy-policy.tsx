import Head from "next/head";
import Link from "next/link";
import { Button } from "@/common/components/ui/button";
import type { NextPageWithLayout } from "./_app";

const PrivacyAndPolicyPage: NextPageWithLayout = () => {
	return (
		<>
			<Head>
				<title>Kebijan Privasi dan Keamanan | Mudah belajar ilmu shorof</title>
			</Head>

			<main className="mx-auto max-w-[800px] max-w-screen-2xl">
				<div className="mt-4">
					<Link href="/">
						<Button variant="ghost">Kembali ke halaman utama</Button>
					</Link>
				</div>
				<hr className="my-4" />
				<h1 className="text-center mt-6 mb-10 text-2xl font-bold">
					Kebijkan Privasi dan Keamanan <br />
					Mudah Belajar Ilmu Shorof
				</h1>
				<section className="mb-8 mx-4 lg:mx-10">
					<h2 className="text-xl mb-1 font-medium">1. Pengantar</h2>
					<div className="text-justify mb-4">
						Privasi Anda penting bagi kami. Kebijakan Privasi ini menjelaskan
						bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi
						pribadi Anda saat menggunakan situs web kami untuk belajar Shorof
						melalui permainan kuis.
					</div>

					<h2 className="text-xl mb-1 font-medium">
						2. Informasi yang Kami Kumpulkan
					</h2>
					<div className="text-justify mb-4">
						<ol className="list-disc list-inside ml-4">
							<li>
								Informasi Akun Google: Saat Anda masuk menggunakan Google, kami
								mengumpulkan nama, alamat email, dan foto profil yang disediakan
								oleh akun Google Anda.
							</li>
							<li>
								Data Kuis: Kami mengumpulkan informasi tentang kinerja Anda
								dalam kuis, seperti skor dan kemajuan, untuk meningkatkan
								pengalaman belajar Anda.
							</li>
						</ol>
					</div>

					<h2 className="text-xl mb-1 font-medium">
						3. Cara Kami Menggunakan Informasi Anda
					</h2>
					<div className="text-justify mb-4">
						Kami menggunakan informasi Anda untuk:
						<ol className="list-disc list-inside ml-4">
							<li>
								Mempersonalisasi pengalaman belajar Anda dengan melacak kemajuan
								kuis.
							</li>
							<li>
								Meningkatkan situs web dengan menganalisis perilaku pengguna.
							</li>
						</ol>
					</div>

					<h2 className="text-xl mb-1 font-medium">4. Berbagi Data</h2>
					<div className="text-justify mb-4">
						Kami tidak membagikan informasi pribadi Anda dengan pihak ketiga
						kecuali:
						<ol className="list-disc list-inside ml-4">
							<li>Diperlukan oleh hukum.</li>
							<li>
								Untuk melindungi hak-hak kami atau memastikan keamanan situs web
								kami.
							</li>
						</ol>
					</div>

					<h2 className="text-xl mb-1 font-medium">5. Keamanan Data</h2>
					<div className="text-justify mb-4">
						Kami mengambil langkah-langkah yang wajar untuk melindungi informasi
						pribadi Anda dari akses atau pengungkapan yang tidak sah. Namun,
						tidak ada metode transmisi data melalui Internet yang 100% aman.
					</div>

					<h2 className="text-xl mb-1 font-medium">6. Layanan Pihak Ketiga</h2>
					<div className="text-justify mb-4">
						Situs web kami menggunakan Google untuk keperluan login. Silakan
						merujuk ke kebijakan privasi Google untuk memahami bagaimana data
						Anda diperlakukan oleh Google.
					</div>

					<h2 className="text-xl mb-1 font-medium">7. Hak Anda</h2>
					<div className="text-justify mb-4">
						Anda memiliki hak untuk mengakses, memperbarui, atau menghapus
						informasi pribadi Anda yang tersimpan di situs web kami. Silakan
						hubungi kami jika Anda memerlukan bantuan terkait data Anda.
					</div>

					<h2 className="text-xl mb-1 font-medium">
						8. Perubahan Kebijakan Ini
					</h2>
					<div className="text-justify mb-4">
						Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu.
						Setiap perubahan akan dipublikasikan di halaman ini, dan tanggal
						revisi akan diperbarui.
					</div>

					<h2 className="text-xl mb-1 font-medium">9. Hubungi Kami</h2>
					<div className="mb-4">
						Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan
						hubungi kami di{" "}
						<a href="mailto:admn.master.arabic@gmail.com">
							admn.master.arabic@gmail.com
						</a>
						.
					</div>

					<div>Diperbarui pada 18 September 2024</div>
				</section>
			</main>
		</>
	);
};

PrivacyAndPolicyPage.auth = false;

export default PrivacyAndPolicyPage;
