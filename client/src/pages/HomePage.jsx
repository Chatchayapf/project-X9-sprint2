import { useState,useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext/CartContext";
import HeroBanner from "../components/HeroBanner";
import ImageMarquee from "../components/ImageMarquee";
import CustomOrderCTA from "../components/CostomerOrderCTA";

const HomePage = () => {
    const { handleAddToCart } = useCart();
    const location = useLocation();
    const [activeFilter, setActiveFilter] = useState("All type");

    const handleCategoryClick = (category) => {
        setActiveFilter(category);
        setTimeout(() => {
            const el = document.getElementById("products");
            if (el) {
                el.scrollIntoView({ behavior: "smooth" });
            }
        }, 100);
    };

    useEffect(() => {
        if (location.hash) {
            setTimeout(() => {
                const id = location.hash.replace("#", "");
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                }
            }, 100);
        } else {
            window.scrollTo(0, 0);
        }
    }, [location]);
    return (
        <div className="min-w-screen">
            <HeroBanner onCategoryClick={handleCategoryClick}/>
            <ImageMarquee />
            <CustomOrderCTA />
        </div>
    );
};
export default HomePage;
