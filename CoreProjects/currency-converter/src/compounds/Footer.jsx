import React from 'react';
import '../styles/Footer.css'; // Para estilos personalizados
import { GithubOutlined, LinkedinOutlined } from '@ant-design/icons';

function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p>© 2025 Currency Converter App. All rights reserved.</p>
        <div className="footer-links">
          <a href="https://github.com/Angeltorresrepo" target="_blank" rel="noopener noreferrer" className='icon-link'>
            <GithubOutlined 
              style={{ fontSize: '24px', color: '#313131ff' }}
            />
          </a>
          <a href="https://www.linkedin.com/in/angel-torres-mozas/" target="_blank" rel="noopener noreferrer" className='icon-link'>
            <LinkedinOutlined 
              style={{ fontSize: '24px', color: '#313131ff' }}
            />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
