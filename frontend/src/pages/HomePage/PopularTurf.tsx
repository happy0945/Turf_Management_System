
// generate popular turf cards using map function by using the turfdata.tsx and turfcard.tsx 

import turfData from "./TurfData";
import TurfCard from "./TurfCard"

const PopularTurf = () =>{

    return (
        <section className="mt-12">
            <h2 className="text-3xl font-bold text-center mb-8 underline decoration-green-300 decoration-4 underline-offset-16">Popular Turfs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {turfData.map((turf) => (
          <TurfCard
            key={turf.id}
            image={turf.image}
            name={turf.name}
            location={turf.location}
            pricePerHour={turf.pricePerHour}
            rating={turf.rating}
          />
        ))}
            </div>
        </section>
    )
}

export default PopularTurf