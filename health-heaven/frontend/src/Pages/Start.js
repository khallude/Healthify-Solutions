import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, EffectFade, Autoplay } from 'swiper/modules';
import { Heart, Leaf, Activity } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { Link } from 'react-router-dom';

function Start() {
  return (
    <div className="h-screen">
      <Swiper
        modules={[Pagination, EffectFade, Autoplay]}
        effect="fade"
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        className="h-full"
      >
        <SwiperSlide>
          <div
            className="h-full bg-cover bg-center flex items-center justify-center relative"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80")',
            }}
          >
            <div className="bg-black bg-opacity-50 w-full h-full flex items-center justify-center">
              <div className="text-center text-white px-4 relative z-10">
                <Heart className="w-16 h-16 mx-auto mb-6 text-rose-500" />
                <h1 className="text-5xl font-bold mb-4">Healthify Solutions</h1>
                <p className="text-xl max-w-2xl mx-auto">Your journey to wellness begins here</p>
                <div className="mt-8">
                  <Link
                    to="/signup"
                    className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-opacity-90 transition-all"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div
            className="h-full bg-cover bg-center flex items-center justify-center relative"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80")',
            }}
          >
            <div className="bg-black bg-opacity-50 w-full h-full flex items-center justify-center">
              <div className="text-center text-white px-4 relative z-10">
                <Leaf className="w-16 h-16 mx-auto mb-6 text-green-500" />
                <h2 className="text-5xl font-bold mb-4">Natural Wellness</h2>
                <p className="text-xl max-w-2xl mx-auto">Discover holistic approaches to health</p>
                <div className="mt-8">
                  <Link
                    to="/signup"
                    className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-opacity-90 transition-all"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div
            className="h-full bg-cover bg-center flex items-center justify-center relative"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80")',
            }}
          >
            <div className="bg-black bg-opacity-50 w-full h-full flex items-center justify-center">
              <div className="text-center text-white px-4 relative z-10">
                <Activity className="w-16 h-16 mx-auto mb-6 text-blue-500" />
                <h2 className="text-5xl font-bold mb-4">Transform Your Life</h2>
                <p className="text-xl max-w-2xl mx-auto">Start your wellness journey today</p>
                <div className="mt-8">
                  <Link
                    to="/signup"
                    className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-opacity-90 transition-all"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}

export default Start;
