import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import { getFirestore, doc, getDoc, collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';

const Usage: React.FC = () => {
  const { user } = useAuth();
  const [credits, setCredits] = useState(0);
  const [plan, setPlan] = useState('');
  const [usageHistory, setUsageHistory] = useState<{ date: string; amount: number; action: string }[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<{ date: string; amount: number; method: string }[]>([]);

  useEffect(() => {
    const fetchUsageData = async () => {
      if (user) {
        const db = getFirestore();
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setCredits(userData.credits || 0);
          setPlan(userData.plan || 'Freemium');
          
          // Fetch usage history
          const usageQuery = query(
            collection(db, 'usageHistory'),
            where('userId', '==', user.uid),
            orderBy('date', 'desc'),
            limit(10)
          );
          const usageSnapshot = await getDocs(usageQuery);
          setUsageHistory(usageSnapshot.docs.map(doc => doc.data() as { date: string; amount: number; action: string }));

          // Fetch payment history
          const paymentQuery = query(
            collection(db, 'paymentHistory'),
            where('userId', '==', user.uid),
            orderBy('date', 'desc'),
            limit(10)
          );
          const paymentSnapshot = await getDocs(paymentQuery);
          setPaymentHistory(paymentSnapshot.docs.map(doc => doc.data() as { date: string; amount: number; method: string }));
        }
      }
    };

    fetchUsageData();
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Usage Dashboard</h1>
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Current Plan: {plan}</h2>
        <p className="text-xl mb-2">Available Credits: <span className="font-bold text-green-600">{credits}</span></p>
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-4">
          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${(credits / 1000) * 100}%` }}></div>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300">
          Buy More Credits
        </button>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Usage History</h2>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Date</th>
                <th className="text-left py-2">Action</th>
                <th className="text-right py-2">Credits Used</th>
              </tr>
            </thead>
            <tbody>
              {usageHistory.map((entry, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2">{new Date(entry.date).toLocaleDateString()}</td>
                  <td className="py-2">{entry.action}</td>
                  <td className="text-right py-2">{entry.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Payment History</h2>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Date</th>
                <th className="text-left py-2">Method</th>
                <th className="text-right py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {paymentHistory.map((entry, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2">{new Date(entry.date).toLocaleDateString()}</td>
                  <td className="py-2">{entry.method}</td>
                  <td className="text-right py-2">${entry.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Usage;