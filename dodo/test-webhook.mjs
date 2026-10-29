// Executable test for Dodo Payments Webhook Settlement
const WEBHOOK_URL = process.env.WEBHOOK_URL || "http://localhost:3000/api/webhook/dodo";

console.log("=================================================");
console.log("🦤 Testing Dodo Payments Webhook Event Dispatcher");
console.log(`Endpoint: ${WEBHOOK_URL}\n`);

const payload = {
  type: "payment.succeeded",
  data: {
    invoice_id: "inv-1042",
    amount: 45000,
    currency: "INR",
    customer: {
      name: "Rahul Sharma",
      email: "rahul@acmestudios.in",
      phone: "+91 98765 43210"
    },
    payment_id: `dodo_pay_${Date.now()}`,
    payment_method: "UPI_PHONEPE"
  }
};

try {
  const res = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  console.log("Response Status:", res.status);
  console.log("Response Data:", JSON.stringify(data, null, 2));

  if (res.status === 200 && data.status === "settled") {
    console.log("\n🎉 SUCCESS: Dodo Webhook settled invoice and marked as RECOVERED!");
  } else {
    console.log("\nℹ Response received:", data);
  }
} catch (err) {
  console.error("Webhook test failed (is server running?):", err.message);
}
