const images = [
    { src: "/homepage/imagemarquee/img1.jpg", alt: "Streetwear Fashion Model" },
    { src: "/homepage/imagemarquee/img2.jpg", alt: "Developer Stickers Pack" },
    { src: "/homepage/imagemarquee/img3.jpg", alt: "Digital Dashboard App" },
    { src: "/homepage/imagemarquee/img4.jpg", alt: "Magical Bedtime Stories E-Book" },
];

export default function ImageMarquee() {
    return (
        <div className="w-full bg-base-200 py-6 px-4 md:px-8">
            <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {images.map((img, i) => (
                    <div
                        key={i}
                        className="w-full h-44 sm:h-56 md:h-64 lg:h-72 rounded-box overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer"
                    >
                        <img
                            src={img.src}
                            alt={img.alt}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
