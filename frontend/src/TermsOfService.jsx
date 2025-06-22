import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const TermsOfService = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <div className="flex-grow-1 container" style={{ maxWidth: "70%" }}>
        {/* Centered title and date only */}
        <div className="pt-5">
          <h1 className="display-5 fw-bold text-body-emphasis">Terms of Service</h1>
          <p className="lead mb-4">Effective Date: June 21, 2025</p>
        </div>

        {/* Left-aligned content below */}
        <div className="text-start">
          <h3 className="mt-5">Acceptance of Terms</h3>
          <p>By using MailSweep, you agree to these Terms of Service and our Privacy Policy.</p>

          <h3 className="mt-5">Use of the Service</h3>
          <ul>
            <li>You must sign in with a Google account to use MailSweep</li>
            <li>You agree not to misuse the service or access unauthorized data</li>
          </ul>

          <h3 className="mt-5">Disclaimer</h3>
          <p>This service is provided “as is.” We are not responsible for missed emails or accidental unsubscribes.</p>

          <h3 className="mt-5">Limitation of Liability</h3>
          <p>We are not liable for any damages related to the use or inability to use MailSweep.</p>

          <h3 className="mt-5">Changes to Terms</h3>
          <p>We may update these terms at any time. Continued use means you accept the changes.</p>

          <h3 className="mt-5">Contact Us</h3>
          <p>Questions? Email us at <a href="mailto:support@mailsweep.xyz">support@mailsweep.xyz</a>.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsOfService;
