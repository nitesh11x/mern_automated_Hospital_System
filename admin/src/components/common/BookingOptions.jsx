import React from "react";
import { Phone, Globe, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BookingOptions = () => {
    const navigate = useNavigate();

    const phoneNumber = "tel:+918950905818"; // change to your number
    const whatsappNumber = "https://wa.me/8950905818"; // change to your number

    return (
        <div className="min-h-screen bg-linear-to-br from-indigo-900 via-purple-900 to-indigo-800 flex items-center justify-center px-4">

            <div className="bg-white/10 backdrop-blur-lg rounded-sm shadow-xl p-8 w-full max-w-md text-center">

                <h1 className="text-3xl font-bold text-white mb-2">
                    Book Your Service
                </h1>
                <p className="text-gray-300 mb-8">
                    Choose your preferred booking method
                </p>

                <div className="flex flex-col gap-4">

                    {/* Phone */}
                    <a href={phoneNumber}>
                        <button className="w-full flex items-center cursor-pointer  justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 hover:scale-105 text-white py-3 rounded-sm transition duration-300 shadow-lg">
                            <Phone size={20} />
                            Book via Phone
                        </button>
                    </a>

                    {/* WhatsApp */}
                    <a href={whatsappNumber} target="_blank" rel="noreferrer">
                        <button className="w-full flex items-center  cursor-pointer justify-center gap-3 bg-green-500 hover:bg-green-600 hover:scale-105 text-white py-3 rounded-sm transition duration-300 shadow-lg">
                            <MessageCircle size={20} />
                            Book via WhatsApp
                        </button>
                    </a>

                    {/* Website */}
                    <button
                        onClick={() => navigate("/appointment/book")}
                        className="flex items-center justify-center cursor-pointer  gap-3 bg-purple-600 hover:bg-purple-700 hover:scale-105 text-white py-3 rounded-sm transition duration-300 shadow-lg"
                    >
                        <Globe size={20} />
                        Book via Website
                    </button>

                </div>
            </div>
        </div>
    );
};

export default BookingOptions;