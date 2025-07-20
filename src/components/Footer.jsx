import React from 'react';
import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <footer className="site-footer">
            <div className="footer-content">
                <Link to="/about" className="footer-button">About</Link>
            </div>
        </footer>
    );
};

export default Footer;