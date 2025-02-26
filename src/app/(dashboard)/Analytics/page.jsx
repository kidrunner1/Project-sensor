import React from 'react';

const AnalyticsPage = () => {
    return (
        <div className="p-4 flex gap-4 flex-col h-screen overflow-hidden overflow-y-auto">
            <header className="bg-white shadow-md p-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
            </header>
            <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Metric 1</h2>
                    <p className="text-gray-600">Some data about metric 1.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Metric 2</h2>
                    <p className="text-gray-600">Some data about metric 2.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Metric 3</h2>
                    <p className="text-gray-600">Some data about metric 3.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Metric 4</h2>
                    <p className="text-gray-600">Some data about metric 4.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Metric 5</h2>
                    <p className="text-gray-600">Some data about metric 5.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Metric 6</h2>
                    <p className="text-gray-600">Some data about metric 6.</p>
                </div>
            </main>
        </div>
    );
};

export default AnalyticsPage;