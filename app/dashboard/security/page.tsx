import DashboardPage from "../page";

export default function OwnerSectionPage() {
  return DashboardPage({ searchParams: Promise.resolve({ view: "security" }) });
}
