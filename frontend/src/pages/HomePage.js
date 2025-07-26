import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div>
      <section className="flex flex-col-reverse md:flex-row items-center bg-white px-6 py-20 max-w-7xl mx-auto">
        {/* Text Section */}
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
            Care You Can Trust
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            Find trusted caregivers for your babies, elders, and pets — all in
            one platform. Join thousands of families using our service every
            day.
          </p>
          <Link to="/register">
            <button className="bg-primary hover:bg-lightPrimary text-white px-6 py-3 rounded-full text-lg transition">
              Get Started
            </button>
          </Link>
        </div>

        {/* Image Section */}
        <div className="md:w-1/2 relative h-[350px] w-full mt-10 md:mt-0">
          {/* Main Image */}
          <img
            src="banner.png"
            alt="Main caregiving"
            className="rounded-lg shadow-lg h-64 w-64 object-cover absolute left-1/2 top-0 transform -translate-x-1/2 z-30"
          />
          {/* Overlapping Image Left */}
          <img
            src="elder.jpg"
            alt="Elder care"
            className="rounded-lg shadow-md h-48 w-48 object-cover absolute -left-4 bottom-0 z-20"
          />
          {/* Overlapping Image Right */}
          <img
            src="petCare.jpg"
            alt="Pet care"
            className="rounded-lg shadow-md h-48 w-48 object-cover absolute right-0 bottom-4 z-10"
          />
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-6 text-center bg-white">
        <h2 className="text-3xl font-bold text-primary">About Our Platform</h2>
        <p className="mt-6 max-w-3xl mx-auto text-gray-600 text-lg">
          Caregiver Connect is a modern marketplace for families looking to hire
          verified caregivers. Whether it's childcare, elder care, or pet
          sitting, we offer a safe and user-friendly platform for both
          caregivers and clients.
        </p>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6 bg-lightPrimary text-center rounded-md">
        <h2 className="text-3xl font-bold text-primary">How It Works</h2>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              icon: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
              title: "1. Sign Up",
              desc: "Create an account as a caregiver or a family in need of care services.",
            },
            {
              icon: "https://cdn-icons-png.flaticon.com/512/2922/2922510.png",
              title: "2. Post or Browse Gigs",
              desc: "Caregivers post their gigs and clients browse listings by category and location.",
            },
            {
              icon: "https://cdn-icons-png.flaticon.com/512/190/190411.png",
              title: "3. Connect & Hire",
              desc: "Use our dashboard to chat, review profiles, and manage bookings securely.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-6 shadow hover:shadow-md transition"
            >
              <img
                src={item.icon}
                alt={item.title}
                className="w-16 h-16 mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold text-primary mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-6 text-center bg-white">
        <h2 className="text-3xl font-bold text-primary">Our Services</h2>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              image: "/baby.jpg",
              title: "👶 Baby Care",
              desc: "Qualified babysitters available day and night to care for your children.",
            },
            {
              image: "/elder.jpg",
              title: "👵 Elder Care",
              desc: "Compassionate caregivers for elderly support and companionship.",
            },
            {
              image: "/petCare.jpg",
              title: "🐶 Pet Care",
              desc: "Friendly sitters and walkers for your furry companions.",
            },
          ].map((service, index) => (
            <div
              key={index}
              className="rounded-lg overflow-hidden shadow hover:shadow-lg transition"
            >
              <img
                src={service.image}
                alt={service.title}
                className="h-52 w-full object-cover"
              />
              <div className="p-5">
                <h3 className="text-xl font-semibold text-secondary">
                  {service.title}
                </h3>
                <p className="text-gray-600 mt-2">{service.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 text-center bg-primary text-white rounded-md">
        <h2 className="text-3xl font-bold">Join the Community Today</h2>
        <p className="mt-4 text-lg max-w-xl mx-auto">
          Whether you’re a caregiver or looking to hire one, we’ve built the
          safest and easiest way to connect with trusted individuals.
        </p>
        <Link to="/register">
          <button className="mt-6 px-8 py-3 bg-white text-primary hover:bg-lightPrimary font-semibold rounded-full transition">
            Register Now
          </button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-6 text-sm mt-10">
        <p>
          &copy; {new Date().getFullYear()} Caregiver Connect. All rights
          reserved.
        </p>
        <div className="mt-2 flex justify-center gap-6 text-gray-300">
          <Link to="/about" className="hover:underline">
            About
          </Link>
          <Link to="/contact" className="hover:underline">
            Contact
          </Link>
          <Link to="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
        </div>
      </footer>
    </div>
  );
}
