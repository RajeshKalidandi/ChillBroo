import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getFirestore, doc, updateDoc, increment, collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../components/AuthContext';

const Checkout: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { planName, price } = location.state as { planName: string; price: number };
  const [email, setEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cryptoAddress, setCryptoAddress] = useState('');

  useEffect(() => {
    // Simulate fetching a crypto address from your backend
    const fetchCryptoAddress = async () => {
      // In a real implementation, this would be an API call to your backend
      // which would then interact with Coinbase Commerce to create a charge
      setTimeout(() => {
        setCryptoAddress('1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2');
      }, 1000);
    };

    if (paymentMethod === 'crypto') {
      fetchCryptoAddress();
    }
  }, [paymentMethod]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here, you would typically integrate with a payment gateway
    // For this example, we'll simulate a successful payment
    try {
      const db = getFirestore();
      const userRef = doc(db, 'users', user!.uid);
      
      // Update user's credits and plan
      await updateDoc(userRef, {
        credits: increment(price * 100), // Assuming 1 credit = $0.01
        plan: planName
      });

      // Record payment history
      await addDoc(collection(db, 'paymentHistory'), {
        userId: user!.uid,
        date: new Date().toISOString(),
        amount: price,
        method: paymentMethod,
        plan: planName
      });

      toast.success(`Payment successful! You are now subscribed to the ${planName} plan.`);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('An error occurred while processing your payment. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>
      <p className="mb-4">You are subscribing to the {planName} plan at ${price}/month</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-1">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Payment Method</label>
          <div className="flex space-x-4">
            <button
              type="button"
              className={`px-4 py-2 rounded ${paymentMethod === 'card' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              onClick={() => setPaymentMethod('card')}
            >
              Credit Card
            </button>
            <button
              type="button"
              className={`px-4 py-2 rounded ${paymentMethod === 'crypto' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              onClick={() => setPaymentMethod('crypto')}
            >
              Cryptocurrency
            </button>
          </div>
        </div>
        {paymentMethod === 'card' && (
          <>
            <div>
              <label htmlFor="cardNumber" className="block mb-1">Card Number</label>
              <input
                type="text"
                id="cardNumber"
                required
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="flex space-x-4">
              <div className="flex-1">
                <label htmlFor="expiry" className="block mb-1">Expiry</label>
                <input
                  type="text"
                  id="expiry"
                  required
                  placeholder="MM/YY"
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="cvc" className="block mb-1">CVC</label>
                <input
                  type="text"
                  id="cvc"
                  required
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            </div>
          </>
        )}
        {paymentMethod === 'crypto' && (
          <div>
            <label className="block mb-1">Bitcoin Address</label>
            <p className="bg-gray-100 p-3 rounded break-all">{cryptoAddress || 'Loading...'}</p>
            <p className="text-sm text-gray-600 mt-2">
              Please send {price} USD worth of Bitcoin to this address to complete your subscription.
            </p>
          </div>
        )}
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300">
          {paymentMethod === 'card' ? 'Pay Now' : 'I\'ve Sent the Payment'}
        </button>
      </form>
    </div>
  );
};

export default Checkout;