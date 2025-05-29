import React from 'react';
import Banner from '../components/Banner';
import CategoryCards from '../components/CategoryCards';
import ProductCards from '../components/ProductCards'; // <-- Import the new ProductCards
import { ArrowRight } from 'lucide-react'; // Import arrow icon

const Home = () => {
  return (
    <div className="text-black space-y-10 bg-white">
      <Banner />

      <section className="px-4 md:px-8 lg:px-18 py-12 ">
        <h2 className="text-2xl md:text-2xl font-bold text-black mb-7 text-center mt-[2rem]">
          Explore Our Categories
        </h2>
        <CategoryCards />
      </section>

      {/* New Products Section */}
      <section className="px-4 md:px-8 lg:px-18 py-12 bg-gray-50 max-w-7xl mx-auto rounded-t-3xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-black">
            Featured Products
          </h2>
          <a
            href="/products" // Adjust this link to your products page
            className="flex items-center text-blue-600 font-semibold hover:text-blue-800 transition"
          >
            See All Products
            <ArrowRight className="ml-2" size={20} />
          </a>
        </div>

        <ProductCards />
      </section>
    </div>
  );
};

export default Home;