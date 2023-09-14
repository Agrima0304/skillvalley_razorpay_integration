
const express = require('express');
const app = express();
const port = 3434;
const Razorpay = require('razorpay');

// Use body-parser middleware to parse JSON requests
app.use(express.json());

var instance = new Razorpay({
    key_id: 'rzp_test_7PDslyoH9nIRj0',
    key_secret: 'QsP5eNInXQPuQI4FHhKavgyB',
  });
  app.get('/',(req,res)=>{
    res.sendFile("standard.html",{root:__dirname})
  })
  app.post('/create/orderId',(req,res)=>{
    console.log("create orderId request",req.body);
var options = {
  amount: req.body.amount,  // amount in the smallest currency unit
  currency: "INR",
  receipt: "order_rcptid_11"
};
instance.orders.create(options, function(err, order) {
  console.log(order);
  res.send({orderId:order.id})
});
})
app.post("/api/payment/verify", (req, res) => {
    try {
      const secret = 'your_razorpay_secret'; // Replace with your Razorpay secret key
      const receivedSignature = req.body.response.razorpay_signature;
      const orderId = req.body.response.razorpay_order_id;
      const paymentId = req.body.response.razorpay_payment_id;
  
      const body = orderId + "|" + paymentId;
  
      // Create the expected signature
      const expectedSignature = crypto.createHmac('rzp_test_7PDslyoH9nIRj0','QsP5eNInXQPuQI4FHhKavgyB')
        .update(body)
        .digest('hex');
  
      console.log("Received Signature:", receivedSignature);
      console.log("Expected Signature:", expectedSignature);
  
      if (receivedSignature === expectedSignature) {
        // Payment is successful
        console.log("Payment is successful");
        res.status(200).json({ success: true });
      } else {
        // Payment verification failed
        console.log("Payment verification failed");
        res.status(400).json({ success: false });
      }
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).json({ error: error.message });
    }
  });
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

