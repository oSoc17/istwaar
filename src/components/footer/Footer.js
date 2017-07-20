import React from 'react';

import logo1 from './assets/logo01.png';
import logo2 from './assets/logo02.jpg';
import logo3 from './assets/logo03.png';
import logo4 from './assets/logo04.png';
import logo5 from './assets/logo05.png';
import logo6 from './assets/logo06.png';
import logo7 from './assets/logo07.png';
import logo8 from './assets/logo08.png';

const Footer = () => {
  return (
    <footer>
      <div className="partner-container">
        <div className="partner-mini-container">
          <a href="https://www.west-vlaanderen.be/">
            <img className="effect logo1" src={logo1} alt="logo-1" />
          </a>
          <a href="http://idrops.org/">
            <img className="effect logo2" src={logo2} alt="logo-2" />
          </a>
          <a href="http://www.bienet.be/">
            <img className="effect logo3" src={logo3} alt="logo-3" />
          </a>
          <a href="https://www.openknowledge.be/">
            <img className="effect logo4" src={logo4} alt="logo-4" />
          </a>
        </div>

        <div className="partner-mini-container">
          <a href="https://www.nsu.edu/">
            <img className="effect logo5" src={logo5} alt="logo-5" />
          </a>
          <a href="http://www.cwgc.org/find-war-dead.aspx">
            <img className="effect logo6" src={logo6} alt="logo-6" />
          </a>
          <a href="http://www.lijssenthoek.be">
            <img className="effect logo7" src={logo7} alt="logo-7" />
          </a>
          <a href="http://www.inflandersfields.be/">
            <img className="effect logo8" src={logo8} alt="logo-8" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
