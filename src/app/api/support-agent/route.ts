import { NextRequest, NextResponse } from "next/server";

// Knowledge base for the support agent
const knowledgeBase = {
  services: {
    wedding:
      "Wedding Photography: Capturing the joy and elegance of your big day. We offer full day coverage with edited photos delivered within 2 weeks.",
    portrait:
      "Portrait Photography: Professional portraits that highlight your personality. Perfect for profiles, families, or professional headshots.",
    event:
      "Event Photography: Preserving the moments that matter at your events. We cover corporate events, parties, conferences, and more.",
    landscape:
      "Landscape Photography: Breathtaking views captured with precision and art. Stunning natural scenery and scenic locations.",
    product:
      "Product Photography: Showcase your products with high-resolution creative shots. Perfect for e-commerce and marketing.",
    lifestyle:
      "Lifestyle Photography: Capture the essence of your everyday, candid moments. Authentic and natural imagery.",
  },
  faq: {
    booking:
      "You can book a session by clicking the 'Schedule Us' button on our website or contacting us through our contact page. We'll confirm availability and discuss your specific needs.",
    turnaround:
      "You will receive your edited photos within 2 weeks after the shoot. Rush delivery options may be available upon request.",
    travel:
      "Yes, we are available for travel both locally and internationally. Additional travel fees may apply depending on the location.",
    pricing:
      "Pricing varies based on the type of service and package you choose. Please contact us for a personalized quote.",
    editing:
      "All photos are professionally edited and enhanced for the best quality. We use industry-standard editing software.",
    payment:
      "We accept multiple payment methods including credit cards, bank transfers, and online payment platforms. A deposit is required to secure your booking.",
    cancellation:
      "Cancellation policy: Full refund if cancelled 30+ days before the shoot. 50% refund for 15-29 days. No refund for cancellations within 14 days.",
  },
};

// Function to find the best response based on user query
function findBestResponse(query: string): string {
  const lowerQuery = query.toLowerCase();

  // Check for service-related queries
  if (
    lowerQuery.includes("wedding") ||
    lowerQuery.includes("marry") ||
    lowerQuery.includes("bride")
  ) {
    return knowledgeBase.services.wedding;
  }
  if (
    lowerQuery.includes("portrait") ||
    lowerQuery.includes("headshot") ||
    lowerQuery.includes("profile")
  ) {
    return knowledgeBase.services.portrait;
  }
  if (
    lowerQuery.includes("event") ||
    lowerQuery.includes("conference") ||
    lowerQuery.includes("party")
  ) {
    return knowledgeBase.services.event;
  }
  if (
    lowerQuery.includes("landscape") ||
    lowerQuery.includes("nature") ||
    lowerQuery.includes("scenic")
  ) {
    return knowledgeBase.services.landscape;
  }
  if (
    lowerQuery.includes("product") ||
    lowerQuery.includes("ecommerce") ||
    lowerQuery.includes("selling")
  ) {
    return knowledgeBase.services.product;
  }
  if (
    lowerQuery.includes("lifestyle") ||
    lowerQuery.includes("candid") ||
    lowerQuery.includes("everyday")
  ) {
    return knowledgeBase.services.lifestyle;
  }

  // Check for FAQ-related queries
  if (
    lowerQuery.includes("book") ||
    lowerQuery.includes("schedule") ||
    lowerQuery.includes("reserve")
  ) {
    return knowledgeBase.faq.booking;
  }
  if (
    lowerQuery.includes("turnaround") ||
    lowerQuery.includes("delivery") ||
    lowerQuery.includes("when") ||
    lowerQuery.includes("how long")
  ) {
    return knowledgeBase.faq.turnaround;
  }
  if (
    lowerQuery.includes("travel") ||
    lowerQuery.includes("location") ||
    lowerQuery.includes("destination")
  ) {
    return knowledgeBase.faq.travel;
  }
  if (
    lowerQuery.includes("price") ||
    lowerQuery.includes("cost") ||
    lowerQuery.includes("rate") ||
    lowerQuery.includes("charge")
  ) {
    return knowledgeBase.faq.pricing;
  }
  if (
    lowerQuery.includes("edit") ||
    lowerQuery.includes("enhancement") ||
    lowerQuery.includes("quality")
  ) {
    return knowledgeBase.faq.editing;
  }
  if (
    lowerQuery.includes("payment") ||
    lowerQuery.includes("pay") ||
    lowerQuery.includes("deposit")
  ) {
    return knowledgeBase.faq.payment;
  }
  if (
    lowerQuery.includes("cancel") ||
    lowerQuery.includes("refund") ||
    lowerQuery.includes("policy")
  ) {
    return knowledgeBase.faq.cancellation;
  }

  // Default responses for common queries
  if (
    lowerQuery.includes("hello") ||
    lowerQuery.includes("hi") ||
    lowerQuery.includes("hey")
  ) {
    return "👋 Hello! Welcome to Lensed Memoir Photography. We offer Wedding, Portrait, Event, Landscape, Product, and Lifestyle photography services. How can I help you today?";
  }

  if (
    lowerQuery.includes("service") ||
    lowerQuery.includes("offer") ||
    lowerQuery.includes("what do you do")
  ) {
    return "We offer a wide range of professional photography services: Wedding Photography, Portrait Photography, Event Photography, Landscape Photography, Product Photography, and Lifestyle Photography. Which service interests you?";
  }

  if (
    lowerQuery.includes("contact") ||
    lowerQuery.includes("email") ||
    lowerQuery.includes("phone")
  ) {
    return "You can contact us through our Contact Us page on the website. We'll respond to your inquiry as soon as possible. You can also click the 'Schedule Us' button to book a session directly.";
  }

  // If no match found, return a helpful general response
  return "Thank you for your question! I can help with information about our services (Wedding, Portrait, Event, Landscape, Product, and Lifestyle photography), booking procedures, turnaround times, travel options, pricing, editing, payment methods, and our cancellation policy. What would you like to know more about?";
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Invalid message format" },
        { status: 400 }
      );
    }

    // Get the best response from knowledge base
    const reply = findBestResponse(message);

    return NextResponse.json({
      reply,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Support agent error:", error);
    return NextResponse.json(
      {
        reply: "I apologize for the error. Please try again or contact us directly through our website.",
      },
      { status: 500 }
    );
  }
}
