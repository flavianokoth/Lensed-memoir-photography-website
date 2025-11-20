// components/BookingSection.ts

const ScheduleSection: React.FC = () => {
  return (
    <section
      id="contact"
      data-header-theme="light"
      className="py-10 bg-gray-100 flex justify-center items-center"
    >
      <div className="max-w-4xl w-full flex flex-col md:flex-row gap-8 p-6">
        {/* Left Form Section */}
        <div className="w-full md:w-2/3 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Book Your Session Today</h2>
          <p className="text-sm text-gray-500 mb-6">SEND US MESSAGE</p>
          <form className="space-y-4">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="First name"
                className="w-1/2 p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Last name"
                className="w-1/2 p-2 border rounded"
              />
            </div>
            <div className="flex gap-4">
              <input
                type="email"
                placeholder="Email address"
                className="w-1/2 p-2 border rounded"
              />
              <input
                type="tel"
                placeholder="Phone number"
                className="w-1/2 p-2 border rounded"
              />
            </div>
            <div className="flex gap-4">
              <select className="w-1/2 p-2 border rounded">
                <option>Select service</option>
              </select>
              <input
                type="date"
                className="w-1/2 p-2 border rounded"
              />
            </div>
            <textarea
              placeholder="Message"
              className="w-full p-2 border rounded h-24"
            />
            <button
              type="submit"
              className="w-full bg-gray-800 text-white p-2 rounded hover:bg-gray-700"
            >
              Schedule Now
            </button>
          </form>
        </div>

        {/* Right Contact Info Section */}
        <div className="w-full md:w-1/3 bg-gray-800 text-white p-6 rounded-lg shadow-md flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-4">Call Us</h3>
            <p className="flex items-center gap-2 mb-2">
              <span className="text-gray-400">📞</span> 123 465 47890
            </p>
            <h3 className="text-lg font-semibold mb-4 mt-4">Email</h3>
            <p className="flex items-center gap-2 mb-2">
              <span className="text-gray-400">📧</span> example@example.com
            </p>
            <h3 className="text-lg font-semibold mb-4 mt-4">Office Address</h3>
            <p className="flex items-center gap-2 mb-2">
              <span className="text-gray-400">📍</span> 123 main street dummy location
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 mt-4">Social Media</h3>
            <div className="flex gap-4">
              <span className="text-gray-400">🌐</span>
              <span className="text-gray-400">📷</span>
              <span className="text-gray-400">🐦</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScheduleSection;