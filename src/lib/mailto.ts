// Builds a mailto link whose subject and body survive any characters a mail client might choke on.
export function mailtoHref(email: string, subject: string, body: string) {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
