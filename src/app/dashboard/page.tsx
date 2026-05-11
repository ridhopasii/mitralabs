import { redirect } from "next/navigation";

export default function DashboardRedirect() {
  // Sistem lama (Portal Dashboard dengan registrasi akun) sudah dinonaktifkan.
  // Semua klien sekarang menggunakan fitur Lacak Projek (Track) berbasis email dan password sementara.
  redirect("/track");
}
