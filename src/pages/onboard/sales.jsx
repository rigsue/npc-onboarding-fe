import React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../../layout.css";
import "./onboarding.css";

const SalesModules = () => {
  console.log("Sales component loaded");

  return (
    <div className="page">

      {/* NAVBAR */}
      <Navbar active="onboarding" />

      {/* BODY */}
      <div className="body-wrap">

        {/* LEFT PANEL */}
        <aside className="sidebar">

          <div className="sidebar-banner">
            <h2>Sales Modules</h2>
          </div>

          <div className="sidebar-scroll">
            <div className="sidebar-list">

              <div className="module-card active">

                <div className="icon-row">
                  📄
                </div>

                <p className="title">
                  Sales
                </p>

                <span className="view-link">
                  View Module ›
                </span>

              </div>

              <button
                type="button"
                className="proceed-btn"
              >
                Proceed to Assessment
              </button>

            </div>
          </div>

        </aside>

        {/* MAIN CONTENT */}
        <main className="main-content">

          <h1>Sales Department</h1>

          <div className="slide-row">

            {/* PREVIOUS */}
            <button
              type="button"
              className="nav-arrow"
              aria-label="Previous"
            >
              ‹
            </button>

            <div className="slide-stack">

              {/* SALES MODULE */}
              <div className="slide-card panel-1">

                <div className="slide-body">

                  <div className="slide-logo">
                    <div className="n">
                      n
                    </div>

                    <div className="ring">
                      ◎
                    </div>
                  </div>

                  <div className="slide-buttons">

                    <div className="item">
                      Product Training
                    </div>

                  </div>

                </div>

                <div className="slide-footer">

                  <span>
                    in Netrust Philippines Corporation
                  </span>

                  <span>
                    https://www.netrust.com.ph
                  </span>

                  <span>
                    ✉ inquiry@netrust.com.ph
                  </span>

                </div>

              </div>

            </div>

            {/* NEXT */}
            <button
              type="button"
              className="nav-arrow"
              aria-label="Next"
            >
              ›
            </button>

          </div>

          <div className="page-counter">
            1/25
          </div>

        </main>

      </div>

      {/* FOOTER */}
      <Footer />

    </div>
  );
};

export default SalesModules;