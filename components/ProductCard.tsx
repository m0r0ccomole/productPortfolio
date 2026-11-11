import React from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { ProductCard as ProductCardType } from '../lib/types';
import { fadeUpStagger } from '../lib/motion';

interface ProductCardProps {
  product: ProductCardType;
  index: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index }) => {
  return (
    <motion.div
      {...fadeUpStagger(index)}
      className="floating-element"
    >
      <Link href={`/deep-dives/${product.id}`}>
        <div className="bg-white rounded-2xl shadow-float overflow-hidden hover:shadow-float-hover transition-all duration-300 cursor-pointer group">
          {/* Product Image */}
          <div className="aspect-[4/3] relative overflow-hidden">
            <img
              src={product.image}
              alt={product.imageAlt}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          
          {/* Product Details */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
                {product.name}
              </h3>
              <span className="text-sm text-gray-500 font-medium">
                {product.year}
              </span>
            </div>
            
            {/* Key Metric */}
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-primary-600">
                {product.metric}
              </div>
              <div className="text-sm text-gray-600">
                {product.metricLabel}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard; 