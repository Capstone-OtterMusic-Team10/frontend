import { Link } from 'react-router'

const Footer = () => {
    return (
      <footer className="site-footer">
        <div className="footer-content">
          <Link to= "/about" className="footer-button">About</Link>
        </div>
      </footer>
    );
  };
  
  export default Footer;