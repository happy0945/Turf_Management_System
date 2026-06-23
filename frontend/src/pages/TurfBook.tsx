
const turfData = [
    {
        id: 1,
        name: "Greenfield Turf",
        location: "123 Main St, Cityville",
        price: "$50/hr",
        image: "https://via.placeholder.com/150"
    },
    {
        id: 2,
        name: "Sunny Sports Arena",
        location: "456 Elm St, Townsville",
        price: "$75/hr",
        image: "https://via.placeholder.com/150"
    },
    {
        id: 3,
        name: "Riverside Turf Club",
        location: "789 Oak St, Villagetown",
        price: "$60/hr",
        image: "https://via.placeholder.com/150"
    }
];
const TurfBook = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-4">Book a Turf</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {turfData.map((turf) => (
                    <div key={turf.id} className="bg-white p-4 rounded shadow">
                        <img src={turf.image} alt={turf.name} className="w-full h-48 object-cover rounded mb-4" />
                        <h2 className="text-xl font-semibold">{turf.name}</h2>
                        <p className="text-gray-700">{turf.location}</p>
                        <p className="text-gray-900 font-bold">{turf.price}</p>
                        <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Book Now
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TurfBook;