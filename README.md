# Royal Apparels Commerce

Royal Apparels Commerce is a MERN ecommerce store for a women-focused clothing brand. The storefront uses React and Vite, the API runs on Express, Clerk owns identity, and MongoDB Atlas stores the real ecommerce data.

## Tech Stack

- Frontend: React, Vite, React Router
- Auth: Clerk
- Backend: Node.js, Express
- Database: MongoDB Atlas with Mongoose
- Payments: Stripe and Razorpay-ready session endpoints, with COD support

## Project Structure

```text
client/   React storefront, checkout, account, saved items, and admin UI
server/   Express API, Clerk verification, MongoDB models, orders, products
```

## Local Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create the client env file:

   ```bash
   copy client\.env.example client\.env
   ```

   Add your Clerk publishable key:

   ```text
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
   ```

3. Create the server env file:

   ```bash
   copy server\.env.example server\.env
   ```

   Add your MongoDB Atlas connection string and Clerk secret key:

   ```text
   MONGO_URI=mongodb+srv://...
   CLERK_SECRET_KEY=sk_test_...
   ```

4. Add admin access by email or Clerk user id:

   ```text
   CLERK_ADMIN_EMAILS=you@example.com
   CLERK_ADMIN_USER_IDS=
   ```

5. Start the full app:

   ```bash
   npm run dev
   ```

6. Open:

   - Frontend: `http://localhost:5173`
   - API health: `http://localhost:5000/api/health`

## Auth And Data Flow

Clerk handles sign-in, sign-up, sessions, OAuth, and MFA. The React app asks Clerk for a fresh session token before authenticated API calls. Express verifies that token with `@clerk/express`, syncs the Clerk user into MongoDB, and uses the MongoDB user record for ecommerce profile data and admin authorization.

MongoDB stores products, categories, orders, customer phone/address data, synced Clerk user IDs, customer email/name snapshots, and admin role state. Passwords are not stored in this app.

## Seeding Products

When `AUTO_SEED=true`, the server seeds the starter categories and products into MongoDB if those collections are empty. You can run the seed routine directly:

```bash
npm run seed
```

## Payments

Stripe and Razorpay keys are optional while building. If their keys are missing, the payment session endpoint returns safe demo-style payloads so checkout can still be tested. COD works without payment provider keys.
