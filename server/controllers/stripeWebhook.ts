import { Request,Response } from "express";
import Stripe from "stripe";
export const stripeWebhook = async (request:Request, response:Response) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;
  
  if (endpointSecret) {
    // Get the signature sent by Stripe
    const signature = request.headers['stripe-signature'] as string;
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        request.body,
        signature,
        endpointSecret
      );
    } catch (err: any) {
      console.log(`⚠️ Webhook signature verification failed.`, err.message);
      return response.sendStatus(400);
    }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      const sessionList = await stripe.checkout.sessions.list({payment_intent:paymentIntent.id});
      const session = sessionList.data[0];
      const {transactionId, appId} = session.metadata as {transactionId: string; appId: string;};
      break;
    case 'payment_method.attached':
      const paymentMethod = event.data.object;
      // Then define and call a method to handle the successful attachment of a PaymentMethod.
      // handlePaymentMethodAttached(paymentMethod);
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  response.json({received: true});
};
}