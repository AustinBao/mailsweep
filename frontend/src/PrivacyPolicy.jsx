import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <div className="flex-grow-1 container" style={{ maxWidth: "70%" }}>
        {/* Centered title and date only */}
        <div className="pt-5">
          <h1 className="display-5 fw-bold text-body-emphasis">Privacy Policy</h1>
          <p className="lead mb-4">Effective Date: June 21, 2025</p>
        </div>

        {/* Left-aligned content below */}
        <div className="text-start">
          <h3 className="mt-5">What We Collect</h3>
          <ul>
            <li>Your Google account basic profile (name, email, profile picture)</li>
            <li>Permission to view and manage your Gmail inbox (for unsubscribing & deleting emails)</li>
          </ul>

          <h3 className="mt-5">How We Use Your Information</h3>
          <ul>
            <li>To show you your inbox and email senders</li>
            <li>To let you unsubscribe from unwanted emails</li>
            <li>To improve the app experience</li>
          </ul>

          <h3 className="mt-5">Data Storage</h3>
          <p>We do not store the subject of your emails. We may store sender metadata and your unsubscribe preferences securely.</p>

          <h3 className="mt-5">Third-Party Services</h3>
          <p>We use Google APIs and OAuth for authentication. By using MailSweep, you agree to Google’s <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">Privacy Policy</a>.</p>

          <h3 className="mt-5">Your Consent</h3>
          <p>By using MailSweep, you consent to this privacy policy.</p>

          <h3 className="mt-5">Contact Us</h3>
          <p>Questions? Email us at <a href="mailto:support@mailsweep.xyz">support@mailsweep.xyz</a>.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
