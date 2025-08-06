// src/app/not-found.tsx
import Image from "next/image";
import notFoundImage from "../../public/not_found.png";

export default function NotFound() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Imagen de fondo */}
      <Image
        src={notFoundImage}
        alt="Página no encontrada"
        fill
        style={{ objectFit: "cover" }}
        priority
      />

      {/* Texto superpuesto */}
      <div className="absolute top-7 right-8 z-10 text-right">
        <h1 className="text-5xl font-bold text-red-600 drop-shadow-lg">Error 404</h1>
        <p className="text-xl text-red-500 drop-shadow-lg">La página que buscas no existe</p>
      </div>
    </div>
  );
}