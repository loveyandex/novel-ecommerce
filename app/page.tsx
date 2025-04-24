'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import MapModal from '@/components/MapModal';

interface ShippingAddress {
  lat: number;
  lng: number;
  address: string;
}

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const handleAddressSave = (address: ShippingAddress) => {
    try {
      localStorage.setItem('shippingAddress', JSON.stringify(address));
      setShowModal(false);
      router.push('/shop');
    } catch (error) {
      console.error('Failed to save shippingAddress:', error);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 py-16">
        {/* Text and Input */}
        <div className="flex-1 text-center lg:text-right space-y-6">
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight"
            style={{ fontSize: 'clamp(2.25rem, 4.5vw, 3.75rem)' }}
          >
            خرید فوری از سوپرمارکت‌های اطراف
          </h1>
          <p className="text-xl sm:text-2xl text-primary-500 font-semibold">
            ارسال رایگان زیر ۳۰ دقیقه!
          </p>
          <div className="max-w-md mx-auto lg:mx-0">
            <div className="relative group">
              <input
                type="text"
                placeholder="جستجوی فروشگاه‌های اطراف"
                readOnly
                onClick={() => setShowModal(true)}
                className="w-full h-14 px-4 pr-14 bg-neutral-800 text-neutral-200 rounded-lg shadow-lg focus:outline-none cursor-pointer placeholder-neutral-400 transition-all duration-300 group-hover:bg-neutral-700 group-hover:shadow-xl"
              />
              <svg
                className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-primary-500 group-hover:scale-110 transition-transform duration-200"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M21 10h-3V7a5 5 0 0 0-10 0v3H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zm-11-3a3 3 0 0 1 6 0v3h-6V7zm9 12H5v-7h14v7z" />
              </svg>
            </div>
            <div className="mt-4 flex items-center justify-center lg:justify-start gap-2">
              <p className="text-neutral-300 text-sm">
                برای دسترسی به آدرس‌های ذخیره‌شده
              </p>
              <Link
                href="/login"
                className="text-primary-500 text-sm font-semibold hover:underline hover:text-primary-400 transition-colors"
              >
                وارد شوید
              </Link>
            </div>
          </div>
        </div>

        {/* Animated Images */}
        <div className="flex-1 relative h-64 sm:h-80 lg:h-[600px] w-full overflow-hidden rounded-xl shadow-2xl">
          {['/UserBread.jpg', '/UserFood.jpg', '/UserGrocery.jpg', '/UserPastry.jpg'].map(
            (src, index) => (
              <div
                key={src}
                className="absolute inset-0 animate-fade-cycle"
                style={{ animationDelay: `${index * 5}s` }}
              >
                <Image
                  src={src}
                  alt="Grocery item"
                  fill
                  className="object-cover rounded-xl"
                  priority={index === 0}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            )
          )}
        </div>
      </div>

      {/* Map Modal */}
      <MapModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleAddressSave}
      />
    </div>
  );
}