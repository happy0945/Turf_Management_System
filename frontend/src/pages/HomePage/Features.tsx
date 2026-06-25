
import {  FaCalendarAlt,
FaCreditCard, FaCheckCircle, FaClipboardList } from "react-icons/fa";

const Features = () => {
    const features = [
        {
            title: "Easy Booking",
            description: "Book your favorite cricket turfs with just a few clicks.",
            icon: <FaClipboardList />,
        },
        {
            title: "Live Availability",
            description: "Check real-time availability of turfs before booking.",
            icon: <FaCalendarAlt />,
        },
        {
            title: "Secure Payment",
            description: "Make payments securely through our trusted gateway.",
            icon: <FaCreditCard />,
        },
        {
            title: "Instant Confirmation",
            description: "Get instant confirmation of your bookings.",
            icon: <FaCheckCircle />,
        },
    ];

    return (
        <div className="mt-12 flex flex-wrap gap-6 justify-center">
            {features.map((feature, index) => (
                <div
                    key={index}
                    className="bg-gray-50 p-6 rounded-lg shadow-lg w-64 text-center"
                >
                    <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center text-3xl text-green-600">{feature.icon}</div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                </div>
            ))}
        </div>
    );
};

export default Features;