# Client Membership Purchase Flow API Documentation

This documentation covers the end-to-end process for a client to sign up via OTP, view plans, and purchase a membership via Razorpay. 

**Base URL**: `http://localhost:5005` (or your production URL)

---

## 1. View Available Membership Plans
Clients need to see the available plans before or after logging in.

- **URL**: `/api/portal/plans`
- **Method**: `GET`
- **Headers**: None required
- **Response**:
```json
[
  {
    "_id": "60d5ec49e4b00a0015...",
    "name": "Gold Membership",
    "description": "Access to all services",
    "price": 1000,
    "creditAmount": 1200,
    "validityDays": 30,
    "status": "Active"
  }
]
```

---

## 2. Request OTP (Signup/Login)
Clients provide their Mobile Number and Name to initiate signup or login.

- **URL**: `/api/portal/request-otp`
- **Method**: `POST`
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "mobileNumber": "9876543210",
  "name": "John Doe"
}
```
- **Response**:
```json
{
  "message": "OTP sent successfully"
}
```

---

## 3. Verify OTP & Authenticate
Clients submit the OTP they received via SMS. If they are a new user, their account is automatically created here.

- **URL**: `/api/portal/verify-otp`
- **Method**: `POST`
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "mobileNumber": "9876543210",
  "name": "John Doe",
  "otp": "1234"
}
```
- **Response**:
```json
{
  "message": "Login/Signup successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "client": {
    "_id": "65ab12c3f8e9102...",
    "name": "John Doe",
    "mobileNumber": "9876543210"
  }
}
```
*(Save the `_id` from the client object as `clientId` for the next steps)*

---

## 4. Initialize Razorpay Purchase Order
Once the client selects a plan, create an order to get a Razorpay `orderId`. 

- **URL**: `/api/portal/purchase-order`
- **Method**: `POST`
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "planId": "60d5ec49e4b00a0015...", 
  "clientId": "65ab12c3f8e9102..."
}
```
- **Response**:
```json
{
  "message": "Order created successfully",
  "orderId": "order_FkXjO1mZlq...",
  "amount": 100000, 
  "currency": "INR"
}
```
*(Pass this `orderId` to your frontend Razorpay SDK checkout component)*

---

## 5. Verify Payment & Assign Membership
After the client completes the payment on the Razorpay popup, Razorpay returns a `razorpay_payment_id` and `razorpay_signature`. Send these to the backend to finalize the membership.

- **URL**: `/api/portal/verify-payment`
- **Method**: `POST`
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "razorpayOrderId": "order_FkXjO1mZlq...",
  "razorpayPaymentId": "pay_FkXkG12PZ...",
  "razorpaySignature": "d5a8b7c6d9e0f...",
  "planId": "60d5ec49e4b00a0015...",
  "clientId": "65ab12c3f8e9102...",
  "branchId": "optional_branch_id_here",
  "centreId": "optional_centre_id_here"
}
```
- **Response (201 Created)**:
```json
{
  "message": "Payment verified and membership assigned successfully",
  "membership": {
    "_id": "67f8a12b3...",
    "mobileNumber": "9876543210",
    "customerName": "John Doe",
    "clientId": "65ab12c3f8e9102...",
    "planId": "60d5ec49e4b00a0015...",
    "startDate": "2026-04-22T05:30:00.000Z",
    "endDate": "2026-05-22T05:30:00.000Z",
    "paymentType": "Online",
    "razorpayOrderId": "order_FkXjO1mZlq...",
    "razorpayPaymentId": "pay_FkXkG12PZ...",
    "amountPaid": 1000,
    "walletBalance": 1200,
    "status": "Active"
  }
}
```

---

### Tips for Testing in Postman
1. Make sure your server `.env` has valid `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`.
2. For testing the OTP flow locally, you can check your MongoDB `otps` collection to find the generated OTP since SMS might not reliably fire in a local environment.
3. For testing step #5 without a frontend checkout, you will need to generate a valid test signature using a script, or simply temporarily bypass the `verifySignature` function in `razorpayService.js` to always return `true`.
