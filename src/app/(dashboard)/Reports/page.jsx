import React from 'react';

const ReportsPage = () => {
    return (
        <div className="p-4 flex gap-4 flex-col h-screen overflow-hidden overflow-y-auto">
            <div className="max-w-7xl mx-auto bg-white shadow-md rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-4">Reports</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold">Report 1</h2>
                        <p className="mt-2">Details about report 1...</p>
                    </div>
                    <div className="bg-green-500 text-white p-4 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold">Report 2</h2>
                        <p className="mt-2">Details about report 2...</p>
                    </div>
                    <div className="bg-red-500 text-white p-4 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold">Report 3</h2>
                        <p className="mt-2">Details about report 3...</p>
                    </div>
                    {/* Add more report cards as needed */}
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;