import Image from "next/image";
import Link from "next/link";

type Item = {
    _id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    discountPrice?: number | null;
    images: string[];
    isFeatured?: boolean;
    stock?: number;
};

export default function ItemCard({ item }: { item: Item }) {
    const firstImage = item.images?.[0]
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${item.images[0]}`
        : "/images/placeholder-flower.jpg";
    console.log(firstImage);
    const finalPrice = item.discountPrice ?? item.price;

    return (
        <Link href={`/shop/${item.slug}`} className="group block">
            <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition">
                <div className="relative aspect-square">
                    <Image
                        src={firstImage}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {item.discountPrice && (
                        <span className="absolute top-3 left-3 bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded">
                            {Math.round(((item.price - item.discountPrice) / item.price) * 100)}% OFF
                        </span>
                    )}
                </div>
                <div className="p-5">
                    <h3 className="font-serif text-lg text-[#6B4E4E] mb-1 line-clamp-2">
                        {item.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {item.description}
                    </p>
                    <div className="flex items-center gap-3">
                        <span className="text-xl font-bold text-[#E8B4B8]">
                            Rs. {finalPrice.toLocaleString()}
                        </span>
                        {item.discountPrice && (
                            <span className="text-sm text-gray-500 line-through">
                                Rs. {item.price.toLocaleString()}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}