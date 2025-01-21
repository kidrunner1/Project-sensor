const HomePage = () => {
  return (
    <div className="flex gap-4 flex-col md:flex-row mx-auto p-4">
      {/* Left */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">MAP</div>
      {/* Right */}
      <div className="w-full lg:w-1/3">DATA</div>
    </div>
  );
};

export default HomePage;
