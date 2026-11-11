import { Lead } from "@/types";

export const INITIAL_MOCK_LEADS: Lead[] = [
  {
    id: "lead-001",
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
    name: "Dinuk Weerasinghe",
    phone: "+94772189401",
    lead_status: "New",
    source: "Instagram",
    campaign: "Q4 Corporate Event Venues - Colombo",
    message: "Hi MillionSpaces team! We're planning an annual leadership summit for 65 delegates in early December. Need a high-end boardroom setup with catering options near Colombo 03 or 07. Could you share available options and rates?",
    venue_interest: "Luxury Boardroom & Summit Hall",
    ad_id: "meta_ad_88392101",
    notes: "Requires AV projector, buffet lunch package, and breakout area."
  },
  {
    id: "lead-002",
    created_at: new Date(Date.now() - 1000 * 60 * 48).toISOString(), // 48 mins ago
    name: "Shanika Perera",
    phone: "+94718392019",
    lead_status: "New",
    source: "Facebook",
    campaign: "Festive Season Banquet & Rooftop Bookings",
    message: "Hello, looking for a scenic rooftop terrace venue for an engagement dinner of around 80 guests on Saturday, Dec 21st. Is outside decor allowed?",
    venue_interest: "Rooftop Terrace Lounge",
    ad_id: "meta_ad_99201844",
  },
  {
    id: "lead-003",
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    name: "Akeel Mohamed",
    phone: "+94769018432",
    lead_status: "Contacted",
    source: "Instagram",
    campaign: "Startups Co-Working & Dedicated Desks",
    message: "Saw your Meta ad for flexible team desks. Our fintech startup has 6 developers needing dedicated desks with 24/7 access, meeting room credits, and high-speed fibre. Can we schedule a space tour tomorrow?",
    venue_interest: "Hatch / Orion City Dedicated Pod",
    ad_id: "meta_ad_44019288",
    notes: "Followed up via WhatsApp. Tour scheduled for tomorrow at 2:30 PM."
  },
  {
    id: "lead-004",
    created_at: new Date(Date.now() - 1000 * 60 * 210).toISOString(), // 3.5 hours ago
    name: "Dr. Kanishka Fernando",
    phone: "+94773449012",
    lead_status: "Qualified",
    source: "Facebook",
    campaign: "High-End Boardroom & Meeting Pods",
    message: "Good day, I need a quiet 14-seater executive meeting room for a full-day medical advisory board meeting this coming Thursday. Need video conferencing zoom room capability.",
    venue_interest: "World Trade Center Executive Suite",
    ad_id: "meta_ad_77209144",
    notes: "Client confirmed requirement. Quote sent for Cinnamon Lakeside Boardroom package."
  },
  {
    id: "lead-005",
    created_at: new Date(Date.now() - 1000 * 60 * 360).toISOString(), // 6 hours ago
    name: "Nethmi Jayasuriya",
    phone: "+94703928172",
    lead_status: "New",
    source: "WhatsApp Direct",
    campaign: "Creative Studio & Photo Shoot Spaces",
    message: "Hey! Inquiring about renting a daylight photography studio with backdrops for a brand apparel shoot next Tuesday from 9 AM to 4 PM. Are lighting kits included in the hourly rate?",
    venue_interest: "Studio 44 Daylight Studio",
    ad_id: "meta_ad_33091823",
  },
  {
    id: "lead-006",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(), // 14 hours ago
    name: "Rohan De Silva",
    phone: "+94771928374",
    lead_status: "Contacted",
    source: "Facebook",
    campaign: "Q4 Corporate Event Venues - Colombo",
    message: "Can you provide quotation for renting the Waters Edge Grand Banquet lawn for a tech product launch with 200 attendees? Date tentative for January 18.",
    venue_interest: "Waters Edge Grand Lawn",
    ad_id: "meta_ad_88392101",
    notes: "Sent proposal via PDF on WhatsApp."
  },
  {
    id: "lead-007",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(), // 22 hours ago
    name: "Tanya Senanayake",
    phone: "+94715562091",
    lead_status: "Closed",
    source: "Instagram",
    campaign: "Festive Season Banquet & Rooftop Bookings",
    message: "Booking confirmed! Paid 50% advance for the Galle Face terrace cocktail event on Dec 14th.",
    venue_interest: "Galle Face Terrace Suite",
    ad_id: "meta_ad_99201844",
    notes: "Deal closed. Advance receipt #MS-2024-892 issued."
  },
  {
    id: "lead-008",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(), // 1 day ago
    name: "Marcus Tan",
    phone: "+6591283741",
    lead_status: "Qualified",
    source: "Facebook",
    campaign: "High-End Boardroom & Meeting Pods",
    message: "Hi, I am visiting Colombo from Singapore next week for investor meetings. Need an executive boardroom at One Galle Face or Cinnamon Grand for 2 consecutive days.",
    venue_interest: "Shangri-La / OGF Executive Room",
    ad_id: "meta_ad_77209144",
    notes: "High value foreign lead. Preferred catering menus sent."
  },
  {
    id: "lead-009",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(), // 1.5 days ago
    name: "Bimsara Ratnayake",
    phone: "+94778102934",
    lead_status: "Lost",
    source: "Facebook",
    campaign: "Startups Co-Working & Dedicated Desks",
    message: "Looking for single hot desk for 3 days only. What is the lowest daily rate?",
    venue_interest: "Colombo 07 Co-working Desk",
    ad_id: "meta_ad_44019288",
    notes: "Budget too low (under Rs 1,500/day). Marked as lost."
  },
  {
    id: "lead-010",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 44).toISOString(), // ~2 days ago
    name: "Fathima Rizwan",
    phone: "+94762291045",
    lead_status: "Contacted",
    source: "Instagram",
    campaign: "Creative Studio & Photo Shoot Spaces",
    message: "Do you have soundproof podcast studios with 3 Shure SM7B mics in Colombo? Looking to record 4 episodes over a weekend.",
    venue_interest: "Audio & Podcast Production Room",
    ad_id: "meta_ad_33091823",
    notes: "Provided availability for Colombo 04 studio."
  },
  {
    id: "lead-011",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 52).toISOString(),
    name: "Kasun Wickremasinghe",
    phone: "+94774829103",
    lead_status: "Qualified",
    source: "Instagram",
    campaign: "Festive Season Banquet & Rooftop Bookings",
    message: "Hi! Need an indoor banquet hall for an alumni reunion with around 120 people on Dec 28th. Need live music permission.",
    venue_interest: "Kingsbury Victorian Ballroom",
    ad_id: "meta_ad_99201844",
    notes: "Venue has sound license. Customer reviewing packages."
  },
  {
    id: "lead-012",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 64).toISOString(),
    name: "Pradeep Samarasekara",
    phone: "+94719082341",
    lead_status: "Closed",
    source: "Facebook",
    campaign: "Q4 Corporate Event Venues - Colombo",
    message: "Thanks for arranging the Hatch auditorium! The contract is signed for our developer meetup on Friday.",
    venue_interest: "Hatch Auditorium Hall",
    ad_id: "meta_ad_88392101",
    notes: "Payment received in full. Booking completed."
  },
  {
    id: "lead-013",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 78).toISOString(),
    name: "Ananya Patel",
    phone: "+94779830192",
    lead_status: "Contacted",
    source: "WhatsApp Direct",
    campaign: "High-End Boardroom & Meeting Pods",
    message: "We need a hybrid training room with seating for 25 people with dual monitors and recording capabilities for 3 days next month.",
    venue_interest: "Training Center Colombo 03",
    ad_id: "meta_ad_77209144",
    notes: "Shared specs and pricing matrix."
  },
  {
    id: "lead-014",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 92).toISOString(),
    name: "Chathura Gunawardena",
    phone: "+94761928475",
    lead_status: "Lost",
    source: "Instagram",
    campaign: "Festive Season Banquet & Rooftop Bookings",
    message: "Venue inquiry for wedding reception 350 pax on Dec 31st.",
    venue_interest: "Five-Star Grand Ballroom",
    ad_id: "meta_ad_99201844",
    notes: "Selected dates already fully booked across all partner venues."
  },
  {
    id: "lead-015",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 110).toISOString(),
    name: "Suresh Ganeshan",
    phone: "+94773829104",
    lead_status: "Qualified",
    source: "Facebook",
    campaign: "Startups Co-Working & Dedicated Desks",
    message: "Hi MillionSpaces, we are an AI development team looking for a private office suite (10 pax) for 6 months minimum. What are the deposit terms?",
    venue_interest: "10-Pax Private Serviced Suite",
    ad_id: "meta_ad_44019288",
    notes: "Inspection visit scheduled for Wednesday."
  },
  {
    id: "lead-016",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 130).toISOString(),
    name: "Harini Abeywardena",
    phone: "+94702938471",
    lead_status: "New",
    source: "Instagram",
    campaign: "Q4 Corporate Event Venues - Colombo",
    message: "Looking for an art gallery or minimalist industrial space to host a 2-day pop-up fashion exhibition in Colombo 07.",
    venue_interest: "Minimalist Gallery / Pop-up Venue",
    ad_id: "meta_ad_88392101",
  },
  {
    id: "lead-017",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 148).toISOString(),
    name: "Ashan Kulatunga",
    phone: "+94776102938",
    lead_status: "Contacted",
    source: "Facebook",
    campaign: "Creative Studio & Photo Shoot Spaces",
    message: "Hi, need green screen chroma studio for a commercial video shoot with generator backup. Do your listings support this?",
    venue_interest: "Chroma Green Screen Studio",
    ad_id: "meta_ad_33091823",
  },
  {
    id: "lead-018",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 168).toISOString(),
    name: "Malik Mansoor",
    phone: "+94771092834",
    lead_status: "Closed",
    source: "WhatsApp Direct",
    campaign: "High-End Boardroom & Meeting Pods",
    message: "We just paid for the 8-person conference room at World Trade Center. Thanks for the quick support on WhatsApp!",
    venue_interest: "WTC Level 15 Boardroom",
    ad_id: "meta_ad_77209144",
  }
];

export const CAMPAIGN_OPTIONS = [
  "All Campaigns",
  "Q4 Corporate Event Venues - Colombo",
  "Festive Season Banquet & Rooftop Bookings",
  "High-End Boardroom & Meeting Pods",
  "Startups Co-Working & Dedicated Desks",
  "Creative Studio & Photo Shoot Spaces",
];

export const STATUS_OPTIONS = [
  "All Statuses",
  "New",
  "Contacted",
  "Qualified",
  "Lost",
  "Closed",
];

export const SOURCE_OPTIONS = [
  "All Sources",
  "Facebook",
  "Instagram",
  "WhatsApp Direct",
];

