
type turfProb = {
    image:string,
    name:string,
    location:string,
    pricePerHour:number,
    rating:number,
}


const TurfCard = ({ image, name, location, pricePerHour, rating }:turfProb) => {
  return (
    <div className="pl-5 pr-5 bg-white rounded-lg shadow-md overflow-hidden">
      <img src={image} alt={name} className=" w-full h-48 object-cover rounded-lg" />
      <div className="p-1">
        <h3 className="text-lg font-semibold mb-1">{name}</h3>
        <p className="text-gray-600 mb-1">{location}</p>
        <p className="text-gray-800 font-semibold mb-1">${pricePerHour}/hour</p>
        <div className="flex items-center mb-4">
          <span className="text-yellow-400 mr-2">★</span>
          <span className="text-gray-800">{rating}</span>
        </div>
        <div className="flex gap-2">
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition">
            Book Now
          </button>
          <button className="border border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-4 py-2 rounded-lg transition">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default TurfCard;