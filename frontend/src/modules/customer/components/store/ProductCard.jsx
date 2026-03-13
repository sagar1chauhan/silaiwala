import React, { useState } from 'react';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../../../utils/cn';
import useWishlistStore from '../../../../store/wishlistStore';

const ProductCard = ({ product }) => {
    const [isHovered, setIsHovered] = useState(false);
    const { toggleWishlist, isInWishlist } = useWishlistStore(state => state);
    const isWishlisted = isInWishlist(product._id || product.id);

    return (
        <div
            className="group relative bg-white border border-gray-100 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-[#1e3932]/20 shadow-sm"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Discount Badge */}
            {product.discount && (
                <div className="absolute top-2 left-2 z-20 bg-[#FFBC00] text-[#1e3932] text-xs font-bold px-2 py-0.5 rounded-full shadow-md">
                    -{product.discount}%
                </div>
            )}

            {/* Wishlist Icon */}
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleWishlist(product._id || product.id);
                }}
                className={cn(
                    "absolute top-2 right-2 z-20 p-1.5 rounded-full bg-white/90 shadow-sm transition-colors opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 duration-300",
                    isWishlisted ? "text-red-500 opacity-100 translate-y-0" : "text-gray-400 hover:text-red-500"
                )}
            >
                <Heart className={cn("h-4 w-4", isWishlisted && "fill-current")} />
            </button>

            {/* Image Link */}
            <Link to={`/store/product/${product.id}`} className="block relative aspect-[3/4] overflow-hidden bg-gray-100">
                <img
                    src={product.image}
                    alt={product.name}
                    className={cn(
                        "object-cover w-full h-full transition-transform duration-700 ease-out",
                        isHovered ? "scale-110" : "scale-100"
                    )}
                />
            </Link>

            {/* Quick Add Button (Desktop Hover) - Positioned absolutely over the link but with higher z-index if needed, or outside link */}
            <button className="hidden md:flex absolute bottom-[calc(40%+1rem)] left-1/2 -translate-x-1/2 w-[90%] z-20 bg-white text-[#1e3932] py-2 px-4 rounded-full font-bold text-sm shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#1e3932] hover:text-white items-center justify-center gap-2 pointer-events-auto">
                <ShoppingCart className="h-4 w-4" />
                Quick Add
            </button>


            {/* Details */}
            <div className="p-3">
                <Link to={`/store/product/${product.id}`} className="block">
                    {/* Category & Rating */}
                    <div className="flex justify-between items-start mb-1">
                        <span className="text-[10px] text-gray-500 uppercase tracking-wide font-medium">{product.category}</span>
                        <div className="flex items-center gap-1 bg-green-50 px-1 py-0.5 rounded text-[10px] font-bold text-green-700">
                            {product.rating} <Star className="h-2 w-2 fill-current" />
                        </div>
                    </div>

                    {/* Name */}
                    <h3 className="text-sm font-semibold text-gray-800 line-clamp-1 mb-1 group-hover:text-[#1e3932] transition-colors">{product.name}</h3>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-base font-bold text-[#1e3932]">₹{product.price}</span>
                        {product.originalPrice && (
                            <span className="text-xs text-gray-400 line-through">₹{product.originalPrice}</span>
                        )}
                    </div>
                </Link>

                {/* COD Badge */}
                {product.codAvailable && (
                    <div className="inline-block text-[10px] text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100 mb-2">
                        COD Available
                    </div>
                )}

                {/* Mobile Add to Cart */}
                <button className="md:hidden w-full bg-[#1e3932] text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform">
                    <ShoppingCart className="h-3 w-3" />
                    Add
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
