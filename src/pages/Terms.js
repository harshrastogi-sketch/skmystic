import React from "react";

const TermsConditions = () => {
  return (
    <div className="container my-5">
      <div className="card shadow-sm p-4">
        <h2 className="text-center mb-4">Terms & Conditions</h2>

        {/* Section 1 */}
        <h5 className="mt-3">1. What are the Terms & Conditions?</h5>
        <p>
          One should follow these Terms & Conditions whoever visits this website
          stated here. Kindly read this page carefully. You should agree and
          accept the terms and conditions mentioned below to use this site. SK
          Mystic reserves the right to revise these terms and conditions at any
          time by updating this posting. You should visit this page from time to
          time without prior notice to review yourself to the Terms &
          Conditions as they are obligatory on all users of this website.
        </p>

        {/* Section 2 */}
        <h5 className="mt-4">2. How do we apply our Terms & Conditions?</h5>
        <p>
          All products, logos, content appearing in this site, except as
          otherwise noted, are properties either owned, or used under license,
          by SK Mystic. The use of these properties or any other content on this
          site, except as provided in these terms and conditions or in the site
          content, is strictly prohibited. You may not sell or modify the
          content of this Website or reproduce, display, publicly perform,
          distribute, or otherwise use the materials in any way for any public
          or commercial purpose without the respective organization’s or
          entity’s written permission.
        </p>

        {/* Adequate Site Use */}
        <h5 className="mt-4 text-uppercase">Adequate Site Use</h5>

        {/* Security Rules */}
        <h6 className="mt-3">(A) Security Rules</h6>
        <p>
          Visitors are not allowed to violate or attempt to violate the security
          of the Website including:
        </p>

        <ul>
          <li>
            Accessing data not intended for such user or logging into a server
            or account which the user is not authorized to access.
          </li>
          <li>
            Attempting to scan or test the vulnerability of a system or network
            or breach security without proper authorization.
          </li>
          <li>
            Interfering with service to any user, host or network (e.g., virus,
            trojan horse, overloading, flooding, mail bombing).
          </li>
          <li>
            Sending unsolicited emails including promotions or advertisements.
          </li>
        </ul>

        <p>
          Violations of system or network security may result in civil or
          criminal liability. SK Mystic may investigate such violations and
          cooperate with law enforcement authorities.
        </p>

        {/* General Rules */}
        <h6 className="mt-3">(B) General Rules</h6>
        <p>
          Visitors are not allowed to use the Website to transmit, distribute,
          store or destroy material that:
        </p>

        <ul>
          <li>
            Encourages criminal conduct or violates any applicable law or
            regulation.
          </li>
          <li>
            Infringes copyright, trademark, trade secret, or other intellectual
            property rights.
          </li>
          <li>
            Violates privacy or personal rights of others.
          </li>
          <li>
            Is defamatory, pornographic, obscene, abusive, threatening or
            hateful.
          </li>
        </ul>

        {/* Disclaimer */}
        <h5 className="mt-4">Website Disclaimer</h5>
        <p>
          While all reasonable care has been taken in providing the content on
          this Website, SK Mystic shall not be responsible for the completeness
          or correctness of such information. No warranty is given that the
          Website will operate error-free or that it is free of harmful
          components like viruses.
        </p>

        <p>
          The Website is provided on an “as is” basis without warranties of any
          kind. SK Mystic disclaims all warranties including accuracy,
          reliability, and fitness for a particular purpose.
        </p>

        {/* Consequential Damages */}
        <h5 className="mt-4 text-uppercase">
          Disclaimer of Consequential Damages
        </h5>
        <p>
          In no event shall SK Mystic or any associated entities be liable for
          any damages whatsoever (including incidental or consequential damages,
          loss of profits, data loss, or business interruption) arising from the
          use or inability to use the Website.
        </p>

        {/* Closing */}
        <p className="mt-4">
          In the design of our website, we have taken care to draw your attention
          to this privacy policy so that you are aware of the terms under which
          you may decide to share your personal information with us.
          Accordingly, should you choose to share your personal information with
          us, SK Mystic will assume that you have no objections to these terms.
        </p>
      </div>
    </div>
  );
};

export default TermsConditions;