import TableData from "@/app/components/homecomponent/Tabledata";

const HomePage = () => {
  return (
    <div className="flex flex-col md:flex-row  p-4 h-screen overflow-auto">
      {/* Left */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">MAP</div>
      {/* Right */}
      <div className="w-full lg:w-2/3">
        {/* Real Time Data */}
        <div>
          <TableData name="Realtime Data" />
        </div>
        {/* Average to current time in last 24 hour */}
        <div className="mt-4">
        <TableData name="Average to current time in last 24 hour" />
        </div>
        {/* Max in last 24 hour */}
        <div className="mt-4">
        <TableData name="Max in last 24 hour" />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
