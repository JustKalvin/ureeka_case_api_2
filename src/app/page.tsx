"use client";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";

type weatherObj = {
  location: {
    name: string;
    country: string;
    region: string;
  };
  current: {
    temperature: number;
    weather_icons: string[];
    weather_descriptions: string[];
  };
};

const Page = () => {
  const [weatherAbout, setWeatherAbout] = useState<weatherObj | null>(null);
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const weatherStackAPI = process.env.NEXT_PUBLIC_WEATHERSTACK_API

  const handleGetWeather = async () => {
    if (!name.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<weatherObj>(
        `http://api.weatherstack.com/current?access_key=${weatherStackAPI}&query=${name}`
      );
      setWeatherAbout(response.data);
    } catch (err) {
      setError("Gagal mengambil data cuaca.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-100 to-blue-300">
      <h1 className="text-2xl font-bold mb-4 text-black">Cek Cuaca</h1>
      <div className="flex gap-2 mb-6">
        <input
          onChange={(e) => setName(e.target.value)}
          placeholder="Masukkan kota, contoh: Jakarta, New York"
          type="text"
          className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        />
        <button
          onClick={handleGetWeather}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Cari
        </button>
      </div>

      {loading && <p className="text-black">Mengambil data cuaca...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {weatherAbout && (
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md text-center">
          <h2 className="text-xl font-semibold mb-2 text-black">
            {weatherAbout.location.name}, {weatherAbout.location.region}, {weatherAbout.location.country}
          </h2>
          <div className="flex flex-col items-center">
            {weatherAbout.current.weather_icons?.[0] && (
              <Image
                src={weatherAbout.current.weather_icons[0]}
                alt="icon cuaca"
                width={64}
                height={64}
                className="mb-2"
              />
            )}
            <p className="text-lg font-medium text-black">{weatherAbout.current.weather_descriptions?.[0]}</p>
            <p className="text-3xl font-bold mt-2 text-black">{weatherAbout.current.temperature}°C</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
