import { useState, useEffect } from "react";
import "./LandingPage.css";

const FEATURES = [
  {
    title: "Real-Time Position",
    desc: "See your exact queue number and who's currently being served — updated live, no refresh needed.",
  },
  {
    title: "Smart Notifications",
    desc: "Get alerted when your turn is approaching so you can return right on time.",
  },
  {
    title: "Remote Monitoring",
    desc: "Track your queue from anywhere on your phone. Run errands, grab food — we'll hold your spot.",
  },
  {
    title: "Zero Physical Wait",
    desc: "No more standing in line. Use your waiting time productively while the system tracks your place.",
  },
];

const STEPS = [
  { num: "01", label: "Join the queue", sub: "Get your queue number at the counter or scan a QR code." },
  { num: "02", label: "Go live your life", sub: "Leave the building. Grab coffee. Run that errand you've been putting off." },
  { num: "03", label: "Get notified", sub: "Receive a ping when you're a few numbers away from being served." },
  { num: "04", label: "Come back & get served", sub: "Arrive just in time. No wasted minutes, no lost patience." },
];

const SECTORS = ["Banks", "Hospitals", "Government Offices", "Utility Providers", "Clinics", "Retail"];

export default function LandingPage() {
  const [currentServing, setCurrentServing] = useState(20);
  const [yourNumber] = useState(35);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentServing((n) => {
        if (n >= yourNumber - 1) return 20;
        setAnimating(true);
        setTimeout(() => setAnimating(false), 400);
        return n + 1;
      });
    }, 1800);
    return () => clearInterval(interval);
  }, [yourNumber]);

  const spotsAway = yourNumber - currentServing;

  return (
    <div className="ql-root">
      {/* NAV */}
      <nav className="ql-nav">
        <div className="ql-nav-inner">
          <div className="ql-logo">
            <span className="ql-logo-icon">⏱</span>
            <span className="ql-logo-text">Queue<strong>Less</strong></span>
          </div>
          <div className="ql-nav-links">
            <a href="#how">How It Works</a>
            <a href="#features">Features</a>
            <a href="#sectors">Who It's For</a>
          </div>
          <a href="#join" className="ql-btn-primary">Get Started</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="ql-hero">
        <div className="ql-hero-bg">
          <div className="ql-blob ql-blob-1" />
          <div className="ql-blob ql-blob-2" />
        </div>
        <div className="ql-hero-content">
          <div className="ql-badge">Now serving smarter queues</div>
          <h1 className="ql-hero-title">
            Your place in line,<br />
            <span className="ql-accent">wherever you go.</span>
          </h1>
          <p className="ql-hero-sub">
            Stop standing in line. QueueLess lets you track your queue position remotely — get notified when your turn is near, so you can use your waiting time however you want.
          </p>
          <div className="ql-hero-cta">
            <a href="#join" className="ql-btn-primary ql-btn-lg">Join a Queue →</a>
            <a href="#how" className="ql-btn-ghost">See how it works</a>
          </div>
          <div className="ql-stats">
            <div className="ql-stat"><strong>82%</strong><span>of people avoid long lines</span></div>
            <div className="ql-stat-div" />
            <div className="ql-stat"><strong>40%</strong><span>leave without being served</span></div>
            <div className="ql-stat-div" />
            <div className="ql-stat"><strong>30 min</strong><span>average patience threshold</span></div>
          </div>
        </div>

        {/* LIVE DEMO CARD */}
        <div className="ql-demo-card">
          <div className="ql-demo-header">
            <span className="ql-demo-live-dot" />
            <span className="ql-demo-label">City Bank – Main Branch</span>
          </div>
          <div className="ql-demo-serving">
            <p className="ql-demo-hint">Now Serving</p>
            <div className={`ql-demo-number-lg ${animating ? "ql-flash" : ""}`}>
              #{String(currentServing).padStart(2, "0")}
            </div>
          </div>
          <div className="ql-demo-divider" />
          <div className="ql-demo-yours">
            <p className="ql-demo-hint">Your Number</p>
            <div className="ql-demo-number-you">#{String(yourNumber).padStart(2, "0")}</div>
          </div>
          <div className="ql-demo-away">
            <div
              className="ql-progress-bar"
              style={{ "--pct": `${Math.max(0, 100 - (spotsAway / 15) * 100)}%` } as React.CSSProperties}
            />
            <span className={`ql-away-text ${spotsAway <= 3 ? "ql-near" : ""}`}>
              {spotsAway <= 0 ? " It's your turn!" : `${spotsAway} spot${spotsAway !== 1 ? "s" : ""} away`}
            </span>
          </div>
          <div className="ql-demo-footer">
            <span className="ql-notif-btn"> Notify me when I'm close</span>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="ql-section" id="how">
        <div className="ql-section-inner">
          <div className="ql-section-label">Simple process</div>
          <h2 className="ql-section-title">How QueueLess works</h2>
          <p className="ql-section-sub">Four steps between you and a stress-free wait.</p>
          <div className="ql-steps">
            {STEPS.map((s) => (
              <div className="ql-step" key={s.num}>
                <div className="ql-step-num">{s.num}</div>
                <div className="ql-step-body">
                  <h3>{s.label}</h3>
                  <p>{s.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="ql-section ql-section-alt" id="features">
        <div className="ql-section-inner">
          <div className="ql-section-label">What you get</div>
          <h2 className="ql-section-title">Built for real waiting</h2>
          <div className="ql-features">
            {FEATURES.map((f) => (
              <div className="ql-feature-card" key={f.title}>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SCENARIO */}
      <section className="ql-section" id="scenario">
        <div className="ql-section-inner ql-scenario-wrap">
          <div className="ql-scenario-text">
            <div className="ql-section-label">Example</div>
            <h2 className="ql-section-title">Picture this at your bank</h2>
            <ul className="ql-scenario-list">
              <li>You walk in and get <strong>Queue #35</strong></li>
              <li>The board shows <strong>Now Serving: #20</strong></li>
              <li>You open QueueLess on your phone</li>
              <li>Go grab lunch — you have 15 minutes</li>
              <li>At <strong>#32</strong>, you get a notification</li>
              <li>You walk back in, relaxed. <strong>#35 is called. You're there.</strong></li>
            </ul>
          </div>
          <div className="ql-scenario-phone">
            <div className="ql-phone-frame">
              <div className="ql-phone-notch" />
              <div className="ql-phone-screen">
                <p className="ql-phone-title">QueueLess</p>
                <div className="ql-phone-card">
                  <p className="ql-phone-branch">🏦 City Bank</p>
                  <div className="ql-phone-row">
                    <div>
                      <div className="ql-phone-label">Serving</div>
                      <div className="ql-phone-val">#20</div>
                    </div>
                    <div className="ql-phone-sep" />
                    <div>
                      <div className="ql-phone-label">Yours</div>
                      <div className="ql-phone-val ql-phone-yours">#35</div>
                    </div>
                  </div>
                  <div className="ql-phone-bar-wrap">
                    <div className="ql-phone-bar" style={{ width: "40%" }} />
                  </div>
                  <p className="ql-phone-eta">~15 spots away · est. 18 min</p>
                </div>
                <div className="ql-phone-notif">
                  <div>
                    <strong>Almost your turn!</strong>
                    <p>You're #35, currently serving #32</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTORS */}
      <section className="ql-section ql-section-alt" id="sectors">
        <div className="ql-section-inner">
          <div className="ql-section-label">Industries</div>
          <h2 className="ql-section-title">Built for service-heavy sectors</h2>
          <div className="ql-sectors">
            {SECTORS.map((s) => (
              <div className="ql-sector-pill" key={s}>{s}</div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="ql-cta-section" id="join">
        <div className="ql-cta-inner">
          <h2>No more guessing. No more standing.</h2>
          <p>Join a queue the smart way — track your spot, get notified, arrive on time.</p>
          <a href="#" className="ql-btn-primary ql-btn-lg ql-btn-white">Get Started Free →</a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="ql-footer">
        <div className="ql-footer-inner">
          <div className="ql-logo">
            <span className="ql-logo-icon">⏱</span>
            <span className="ql-logo-text">Queue<strong>Less</strong></span>
          </div>
          <p className="ql-footer-tag">Your place in line, wherever you go.</p>
          <p className="ql-footer-copy">© 2025 QueueLess. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}