import React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../../layout.css";
import "./../onboarding.css";

const OOCModules = () => {
    console.log("OOC Modules loaded");

    return (
        <div>
            <Navbar active="onboarding"/>
            <div className="body-wrap">
                <aside className="sidebar">
                    <div className="sidebar-banner">
                        <h2>OOC Modules</h2>
                    </div>
                </aside>
            </div>
        <Footer/>
        </div>
    );
};

export default OOCModules;