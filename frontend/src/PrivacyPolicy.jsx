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
            <li>Your Google account basic profile (name, email, and profile picture)</li>
            <li>Permission to view and manage your Gmail inbox (for unsubscribing & deleting emails)</li>
          </ul>

          <h3 className="mt-5">How We Use Your Information</h3>
          <ul>
            <li>To show you your inbox and email senders</li>
            <li>To let you unsubscribe from unwanted emails</li>
            <li>To improve the app experience</li>
          </ul>

          <h3 className="mt-5">Data Storage</h3>
          <p>
            We do not store the subject or body of your emails. We may store sender metadata and your unsubscribe preferences securely.
            Security procedures are in place to protect the confidentiality of your data. All data in transit is encrypted via HTTPS,
            and any stored data is encrypted at rest. Access is limited to authorized personnel only.
          </p>

          <h3 className="mt-5">Limited Use Disclosure</h3>
          <p>
            MailSweep’s use of information received from Google APIs will adhere to the Google API Services User Data Policy,
            including the Limited Use requirements. We only use your Google user data to provide or improve MailSweep’s features.
            We do not share, sell, or transfer your data to third parties for unrelated purposes, such as advertising.
          </p>
          
          <h3 className="mt-5">Data Retention and Deletion</h3>
          <p>
            We retain your metadata only as long as needed to provide our services. You may request deletion of your stored data
            at any time by contacting us at <a href="mailto:mailsweepemails@gmail.com">mailsweepemails@gmail.com</a>.
          </p>

          <h3 className="mt-5">Third-Party Services</h3>
          <p class="mb-5"> We use Google APIs and OAuth for authentication. By using MailSweep, you agree to Google’s <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">Privacy Policy</a>. Also, by using MailSweep, you consent to this privacy policy.</p>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
