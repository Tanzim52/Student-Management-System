import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import Sidebar from './Sidebar';

const Root = () => {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Main content area with sidebar */}
            <div className="flex flex-1">
                <Sidebar />
                {/* Main content container - adjusts margin based on sidebar width */}
                <main className="flex-1 ml-0 md:ml-20 min-h-[calc(100vh-6rem)]"> 
                    <div className="p-10">
                        <Outlet />
                    </div>
                </main>
            </div>
            {/* Footer will now stick to the bottom */}
            <Footer />
        </div>
    );
};

export default Root;