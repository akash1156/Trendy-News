import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">
              <i className="fas fa-newspaper logo-icon"></i>
              Trendy News
            </h3>
            <p className="footer-description">
              Stay informed with the latest news from around the world. 
              We bring you breaking news, trending stories, and in-depth analysis.
            </p>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About Us</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Categories</h4>
            <ul className="footer-links">
              <li><a href="#business">Business</a></li>
              <li><a href="#technology">Technology</a></li>
              <li><a href="#sports">Sports</a></li>
              <li><a href="#entertainment">Entertainment</a></li>
              <li><a href="#health">Health</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Follow Us</h4>
            <div className="social-links">
              <a href="#" className="social-link" title="Facebook">
                <i className="fab fa-facebook" style={{color: 'white'}}></i>
              </a>
              <a href="#" className="social-link" title="Twitter">
                <i className="fab fa-twitter" style={{color: 'white'}}></i>
              </a>
              <a href="#" className="social-link" title="Instagram">
                <i className="fab fa-instagram" style={{color: 'white'}}></i>
              </a>
              <a href="#" className="social-link" title="LinkedIn">
                <i className="fab fa-linkedin" style={{color: 'white'}}></i>
              </a>
              <a href="#" className="social-link" title="YouTube">
                <i className="fab fa-youtube" style={{color: 'white'}}></i>
              </a>
            </div>
                        
            <div className="newsletter">
              <h5>Subscribe to Trendy News</h5>
              <div className="newsletter-form">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="newsletter-input"
                />
                <button className="newsletter-btn">Subscribe</button>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">
              © {currentYear} Trendy News. All rights reserved.
            </p>
            <div className="footer-bottom-links">
              <span>Powered by NewsAPI</span>
              <button onClick={scrollToTop} className="back-to-top">
                Back to Top ↑
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

