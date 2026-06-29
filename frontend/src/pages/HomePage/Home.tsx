<<<<<<< HEAD

=======
>>>>>>> 4c73f818b928dfa2ae71ce893db608d2b28c7fa7
import Footer from "../../layout/Footer";
import Features from "./Features";
import Hero from "./Hero";
import PopularTurf from "./PopularTurf";
<<<<<<< HEAD

const Home = () => {
  return (
    <>
    <Hero/>
    <Features/>
    <PopularTurf/>
    <Footer/>
    </>
    
    
=======
import SportsCategories from "./SportsCategories";
import HowItWorks from "./HowItWorks";
import Testimonials from "./Testimonials";
import FAQ from "./FAQ";

const Home = () => {
  return (
    <div className="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-500 min-h-screen overflow-x-hidden">
      {/* Hero section is always dark for stadium lighting effect */}
      <Hero />
      
      <SportsCategories />
      
      {/* Section Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center justify-center opacity-30 dark:opacity-20 pointer-events-none">
          <div className="w-[80%] h-[1px] bg-gradient-to-r from-transparent via-green-500/40 dark:via-green-500/50 to-transparent" />
        </div>
      </div>

      <HowItWorks />

      {/* Section Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center justify-center opacity-30 dark:opacity-20 pointer-events-none">
          <div className="w-[80%] h-[1px] bg-gradient-to-r from-transparent via-emerald-500/40 dark:via-emerald-500/50 to-transparent" />
        </div>
      </div>
      
      <Features />

      {/* Section Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center justify-center opacity-30 dark:opacity-20 pointer-events-none">
          <div className="w-[80%] h-[1px] bg-gradient-to-r from-transparent via-teal-500/40 dark:via-teal-500/50 to-transparent" />
        </div>
      </div>

      <PopularTurf />

      {/* Section Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center justify-center opacity-30 dark:opacity-20 pointer-events-none">
          <div className="w-[80%] h-[1px] bg-gradient-to-r from-transparent via-green-500/40 dark:via-green-500/50 to-transparent" />
        </div>
      </div>

      <Testimonials />

      {/* Section Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center justify-center opacity-30 dark:opacity-20 pointer-events-none">
          <div className="w-[80%] h-[1px] bg-gradient-to-r from-transparent via-emerald-500/40 dark:via-emerald-500/50 to-transparent" />
        </div>
      </div>

      <FAQ />
      
      <Footer />
    </div>
>>>>>>> 4c73f818b928dfa2ae71ce893db608d2b28c7fa7
  );
};

export default Home;