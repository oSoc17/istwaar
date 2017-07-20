import React from 'react';
import Navbar from '../../../components/nav/Navbar';
import Footer from '../../../components/footer/Footer';
import Creations1 from '../../../components/creations1/Creations1';

import './Home.css';

import logo from './assets/logo.svg';
// import ht1 from './assets/ht-1.svg';
// import ht2 from './assets/ht-2.svg';
// import ht3 from './assets/ht-3.svg';
// import ht4 from './assets/ht-4.svg';

class Home extends React.Component {
  render() {
    return (
      <div className="home page">
        <Navbar />
        <header className="header-container">
          <img src={logo} className="logo" alt="logo" />
          <h1 className="header-title">
            <span className="blue">ontdek</span>{' '}
            <span className="pink">leer</span>{' '}
            <span className="orange">maak</span>
          </h1>
        </header>

        <main>
          {/* -    <section id="howTo" className="how-to-container">
            <div className="how-to-2-container">
              <div className="ht-mini-container">
                <img src={ht1} className="ht-1-img" alt="how-to-1" />
                <div className="ht-1-border">
                  <h2 className="ht-title">Ontdek</h2>
                  <p className="ht-paraf">
                    Ontdek verschillende historische figuren aan de hand van hun
                    levensverhaal
                  </p>
                </div>
              </div>

              <div className="ht-mini-2-container">
                <img src={ht2} className="ht-2-img" alt="how-to-2" />
                <div className="ht-2-border">
                  <h2 className="ht-title">Leer</h2>
                  <p className="ht-paraf">
                    Leer bij over verschillende periodes in de geschiedenis
                  </p>
                </div>
              </div>

              <div className="ht-mini-container">
                <img src={ht3} className="ht-3-img" alt="how-to-3" />
                <div className="ht-3-border">
                  <h2 className="ht-title">Maak</h2>
                  <p className="ht-paraf">Maak je eigen werkjes</p>
                </div>
              </div>

              <div className="ht-mini-2-container">
                <img src={ht4} className="ht-4-img" alt="how-to-4" />
                <div className="ht-4-border">
                  <h2 className="ht-title">Deel</h2>
                  <p className="ht-paraf">Deel je creaties met de wereld</p>
                </div>
              </div>
            </div>
          </section> */}

          <section id="inspo" className="creations-container">
            <h2 className="creation-title">Snippers</h2>
            <div className="row">
              <div className="col-6">
                <Creations1 />
              </div>
              <div className="col-6">
                <Creations1 />
              </div>
            </div>

            <div className="row">
              <div className="col-6">
                <Creations1 />
              </div>
              <div className="col-6">
                <Creations1 />
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    );
  }
}

export default Home;
