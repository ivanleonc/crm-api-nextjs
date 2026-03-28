import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
async headers() {
    return [
      {
        // Esto le dice a Next.js que aplique estas reglas a TODAS las rutas de nuestra API
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          // Aquí le damos permiso explícito a tu servidor de Vue
          { key: "Access-Control-Allow-Origin", value: "http://localhost:5173" },
          // Métodos permitidos
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT,OPTIONS" },
          // Headers permitidos (muy importante porque enviamos el 'Authorization' y 'Content-Type')
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization" },
        ]
      }
    ]
  }
};

export default nextConfig;
