import React from "react";

function FooterItem({ children }: { children: React.ReactNode }) {
  return <div className="footer__item">{children}</div>;
}

export function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__inner">
        <div className="footer__grid">
          <div className="footer__col">
            <div className="footer__title">Explore Content</div>
            <FooterItem>Politics</FooterItem>
            <FooterItem>Defense and Security</FooterItem>
            <FooterItem>Energy, Oil and Gas</FooterItem>
            <FooterItem>Special Reports</FooterItem>
            <FooterItem>Profiles</FooterItem>
            <FooterItem>Regional Defense Companies</FooterItem>
          </div>

          <div className="footer__col">
            <div className="footer__title">Quick links</div>
            <FooterItem>About us</FooterItem>
            <FooterItem>Subscriptions</FooterItem>
            <FooterItem>Newsletter</FooterItem>
            <FooterItem>FAQ</FooterItem>
            <FooterItem>Careers</FooterItem>
            <FooterItem>Contact us</FooterItem>
          </div>

          <div className="footer__col">
            <div className="footer__title">Products &amp; Services</div>
            <FooterItem>Intelligence Notes</FooterItem>
            <FooterItem>Intelligence Weekly</FooterItem>
            <FooterItem>In-Depth Reports</FooterItem>
            <FooterItem>Consultancy</FooterItem>
            <FooterItem>Services</FooterItem>
          </div>

          <div className="footer__col">
            <div className="footer__title">Contact Us</div>
            <div className="footer__contact">
              <FooterItem>info@tacticalreport.com</FooterItem>
              <FooterItem>+961 76590120</FooterItem>
              <div className="footer__social" aria-label="Social links">
                <span className="footer__socialIcon" aria-hidden="true">
                  in
                </span>
                <span className="footer__socialIcon" aria-hidden="true">
                  f
                </span>
                <span className="footer__socialIcon" aria-hidden="true">
                  x
                </span>
              </div>
            </div>

            <div className="footer__brand">
              <div className="footer__brandLogo" aria-hidden="true">
                TR
              </div>
              <div className="footer__brandName">TacticalReport</div>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <div className="footer__meta">© 2026, Tactical Report | All rights reserved</div>
          <div className="footer__links">
            <span className="footer__link">Terms of Use</span>
            <span className="footer__link">Privacy statement</span>
            <span className="footer__link">Refund/Cancellation Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

