import { Clock, Mail, MapPin, Phone } from "lucide-react";
import {
  addressLine,
  mapsUrl,
  siteConfig,
  telHref,
} from "../config/site.ts";

export default function ContactDetails({ compact = false, showHeading = true }) {
  const { phone, email, hours, hoursNote, kidsHours } = siteConfig;
  return (
    <div className={`contact-details${compact ? " contact-details-compact" : ""}`}>
      {showHeading && <h2>Find us and get in touch</h2>}
      <ul>
        <li>
          <MapPin size={18} aria-hidden="true" />
          <span>
            <a href={mapsUrl} target="_blank" rel="noreferrer">
              {addressLine}
            </a>
          </span>
        </li>
        <li>
          <Clock size={18} aria-hidden="true" />
          <span>
            {hours}
            {hoursNote && <small>{hoursNote}</small>}
            {kidsHours && <small>{kidsHours}</small>}
          </span>
        </li>
        {phone && (
          <li>
            <Phone size={18} aria-hidden="true" />
            <span>
              <a href={telHref(phone)}>{phone}</a>
            </span>
          </li>
        )}
        {email && (
          <li>
            <Mail size={18} aria-hidden="true" />
            <span>
              <a href={`mailto:${email}`}>{email}</a>
            </span>
          </li>
        )}
      </ul>
    </div>
  );
}
