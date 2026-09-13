import React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../../layout.css";
import "./onboarding.css";

const PPMModules = () => {
    console.log("PPM Modules Loaded");

    return (
        <div className="page">
            <Navbar active="onboarding"/>
            <div className="body-wrap">
                <aside className="sidebar">
                    <div className="sidebar-banner">
                        <h2>PPM Modules</h2>
                    </div>

                </aside>
            </div>
        <Footer/>
        </div>
    );
};

export default PPMModules