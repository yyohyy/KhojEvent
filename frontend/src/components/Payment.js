import React,{useState} from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom'; 
import esewa from '../assets/images/esewa.svg';
import khalti from '../assets/images/khalti.svg';

const Payment = () => {
const navigate = useNavigate();
const [selectedPayment, setSelectedPayment] = useState(null);
const { orderId } = useParams();
const [error, setError] = useState('');
 
  
const handleSubmit = async () => {
    try {
      // Make a POST request to the payment endpoint with selected payment option and order ID
      const response = await axios.patch(`http://127.0.0.1:8000/tickets/payment/${orderId}/`);
      console.log('Payment response:', response.data);
      navigate(`/orders/${orderId}`)
      // Handle success or redirect as needed
    } catch (error) {
      console.error('Error processing payment:', error);
      // Handle error
    }
  };
const handlePaymentOptionSelect = (option) => {
    setSelectedPayment(option);
    if (option === 'eSewa') {
        window.open('https://merchant.esewa.com.np/auth/login', '_blank');
      } else if (option === 'Khalti') {
        window.open('https://web.khalti.com/#/','_blank');
      }
  };

  return (
    <div className="min-vh-100 d-flex justify-content-center align-items-center" style={{ backgroundSize: 'cover', backgroundColor: "#fcedf0" }}>
      <div className="container py-5" style={{ width: '30%' }}>
        <div className="row justify-content-center">
          <div className="col">
            <div className="card rounded-3">
              <div className="card-body mx-1 my-2">
                <div className="pt-3">
                  <div className="d-flex flex-row pb-3">
                    <div className={`rounded border border-pink border-2 d-flex p-3 align-items-center ${selectedPayment === 'eSewa' ? 'bg-lightpink' : ''}`} style={{ cursor: 'pointer', width: '100%', height: '80px' }} onClick={() => handlePaymentOptionSelect('eSewa')}>
                      <div className="d-flex align-items-center pe-3">
                        <img src={esewa} alt="eSewa" width="100" height="100" className="me-2" />
                      </div>
                      <div className="d-flex flex-column text-center">
                        <p className="mb-1 small" style={{ fontFamily: "Helvetica", fontSize: '20px' }}>eSewa</p>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex flex-row pb-3">
                    <div className={`rounded border border-pink border-2 d-flex p-3 align-items-center ${selectedPayment === 'Khalti' ? 'bg-lightpink' : ''}`} style={{ cursor: 'pointer', width: '100%', height: '80px' }} onClick={() => handlePaymentOptionSelect('Khalti')}>
                      <div className="d-flex align-items-center pe-3">
                        <img src={khalti} alt="Khalti" width="100" height="100" className="me-2" />
                      </div>
                      <div className="d-flex flex-column text-center">
                        <p className="mb-1 small" style={{ fontFamily: "Helvetica", fontSize: '20px' }}>Khalti</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-center align-items-center pb-1">
                  <button className="btn btn-lg btn-primary" onClick={handleSubmit}>Proceed to Payment</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
