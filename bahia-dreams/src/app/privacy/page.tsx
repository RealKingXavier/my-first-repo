import { LegalPage } from "@/components/LegalPage";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/config/site";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How Bahia Dreams Costa Rica collects, uses and protects the information you share through this website.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy policy">
      <p>
        This policy explains how {site.legal.entityName} (“Bahia Dreams”, “we”) handles personal information shared through
        bahiadreamscr.com. It is a draft and will be reviewed against Costa Rica’s Law 8968 on the Protection of the Person
        Regarding the Processing of Personal Data and any other laws that apply.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li><strong>Contact form:</strong> your name, email address, topic and message.</li>
        <li>
          <strong>Property inquiry form:</strong> property details (type, area, optional address, size, status, listing links,
          amenities), your service needs and timeline, your name, email, phone or WhatsApp number and preferred contact method,
          and any photos you choose to attach.
        </li>
        <li>
          <strong>Technical data:</strong> to protect the forms from abuse we keep a one-way, salted hash of the IP address
          used to submit, for a short period. If site analytics are enabled, we use a cookieless, privacy-focused service
          that does not collect personal information or track you across sites.
        </li>
      </ul>

      <h2>How we use it</h2>
      <ul>
        <li>To reply to your message or inquiry and discuss our services with you.</li>
        <li>To prepare a proposal for managing your property, if you ask for one.</li>
        <li>To keep the website secure and prevent spam.</li>
      </ul>
      <p>We do not sell your information or use it for unrelated marketing.</p>

      <h2>Where it is stored</h2>
      <p>
        Submissions are stored in private storage provided by our hosting provider and are accessible only to authorised
        Bahia Dreams staff. Notification emails are delivered to our company inbox. Photos you upload are never published.
      </p>

      <h2>Booking platforms</h2>
      <p>
        Reservations are made on third-party platforms such as Airbnb. When you follow a booking link, that platform’s own
        privacy policy applies to the information you give it.
      </p>

      <h2>How long we keep it</h2>
      <p>
        We keep inquiries for as long as needed to respond and, if we work together, for the duration of that relationship
        and any period required by law. You can ask us to delete your information at any time.
      </p>

      <h2>Your rights</h2>
      <p>
        You can ask to access, correct or delete the personal information you have shared with us, or withdraw your consent,
        by writing to <a className="underline" href={`mailto:${site.contact.email}`}>{site.contact.email}</a>.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this policy: <a className="underline" href={`mailto:${site.contact.email}`}>{site.contact.email}</a>.
      </p>
    </LegalPage>
  );
}
