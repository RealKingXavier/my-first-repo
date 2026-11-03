import { LegalPage } from "@/components/LegalPage";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/config/site";

export const metadata = pageMetadata({
  title: "Site Terms",
  description: "Terms of use for the Bahia Dreams Costa Rica website.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalPage title="Site terms">
      <p>
        These terms apply to your use of bahiadreamscr.com, operated by {site.legal.entityName}. By using the site you agree
        to them.
      </p>

      <h2>Information on this site</h2>
      <p>
        We work to keep property descriptions, photographs and details accurate, but features and facilities can change.
        The listing on the booking platform is the authoritative description at the time you book.
      </p>

      <h2>Bookings</h2>
      <p>
        This website does not take reservations or payments and does not show live availability or prices. Bookings are
        made through third-party platforms such as Airbnb, under that platform’s terms, house rules and cancellation
        policies.
      </p>

      <h2>Property management inquiries</h2>
      <p>
        Submitting an inquiry does not create an agreement. Any management services are provided only under a separate
        written contract signed by both parties. Nothing on this site is a guarantee of income, occupancy or reviews.
      </p>

      <h2>Intellectual property</h2>
      <p>
        The Bahia Dreams name, macaw emblem, text and photography on this site belong to Bahia Dreams or are used with
        permission. Please don’t reuse them without asking.
      </p>

      <h2>External links</h2>
      <p>We link to third-party sites such as booking platforms and social networks. We are not responsible for their content or practices.</p>

      <h2>Liability</h2>
      <p>The site is provided as is. To the extent permitted by law, we are not liable for losses arising from its use.</p>

      <h2>Governing law</h2>
      <p>These terms are governed by the laws of the Republic of Costa Rica.</p>

      <h2>Contact</h2>
      <p>
        <a className="underline" href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
      </p>
    </LegalPage>
  );
}
