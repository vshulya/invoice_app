import React from "react";
import invoice from "../../assets/Invoice-12.jpg";

function About() {
  return (
    <main className="container">
      <section className="about__section">
        <div>
          <h1>
            Simple and straightforward
            <br />
            free invoice generator.
          </h1>
          <p>No need to log in.</p>
          <p>Just fill in the form and download your invoice.</p>
          <p>It's that easy.</p>
        </div>
        <img className="about__inv-img" src={invoice} alt="invoice" />
      </section>
    </main>
  );
}

export default About;
