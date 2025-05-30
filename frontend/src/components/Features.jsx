import react from "react"

const Features = () => {

    return (
        <div className="container px-4 py-5" id="featured-3">
        <div className="row g-4 gx-5 py-5 row-cols-1 row-cols-lg-3">
            <div className="feature col">
                <div className="icon-square feature-icon d-inline-flex align-items-center justify-content-center text-bg-primary bg-gradient fs-2 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="currentColor" className="bi bi-lightning" viewBox="0 0 16 16">
                        <path d="M5.52.359A.5.5 0 0 1 6 0h4a.5.5 0 0 1 .474.658L8.694 6H12.5a.5.5 0 0 1 .395.807l-7 9a.5.5 0 0 1-.873-.454L6.823 9.5H3.5a.5.5 0 0 1-.48-.641zM6.374 1 4.168 8.5H7.5a.5.5 0 0 1 .478.647L6.78 13.04 11.478 7H8a.5.5 0 0 1-.474-.658L9.306 1z"/>
                    </svg>
                </div>
                <h3 className="fs-2 text-body-emphasis">Instant Unsubscribe</h3>
                 <p>Identify and remove email subscriptions in one click. Stop wasting time scrolling for tiny unsubscribe links.</p>
            </div>

            <div className="feature col">
                <div className="icon-square feature-icon d-inline-flex align-items-center justify-content-center text-bg-primary bg-gradient fs-2 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg"  aria-hidden="true" fill="currentColor" className="bi bi-envelope" viewBox="0 0 16 16">
                        <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z"/>
                    </svg>
                </div>
                <h3 className="fs-2 text-body-emphasis">Smart Gmail Scan</h3>
                <p>Our tool scans your inbox and automatically detects newsletters, promo emails, and more — no setup needed.</p>
            </div>

            <div className="feature col">
                <div className="icon-square feature-icon d-inline-flex align-items-center justify-content-center text-bg-primary bg-gradient fs-2 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg"  aria-hidden="true" fill="currentColor" className="bi bi-list-check" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M3.854 2.146a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 1 1 .708-.708L2 3.293l1.146-1.147a.5.5 0 0 1 .708 0m0 4a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 1 1 .708-.708L2 7.293l1.146-1.147a.5.5 0 0 1 .708 0m0 4a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 0 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0"/>
                    </svg>
                </div>
                <h3 className="fs-2 text-body-emphasis">Total Inbox Control</h3>
                <p>Stay in charge with a clear dashboard of your email senders. Unsubscribe, resubscribe, or mark favorites easily.</p>
            </div>

        </div>
        </div>
    )
}

export default Features


