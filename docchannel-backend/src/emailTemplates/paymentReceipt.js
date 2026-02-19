const generatePaymentReceiptHTML = (receiptData) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #f9f9f9; padding: 20px; }
        .receipt-details { background-color: white; padding: 20px; margin: 15px 0; border-left: 4px solid #4CAF50; border-radius: 4px; }
        .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
        .detail-row:last-child { border-bottom: none; }
        .detail-label { font-weight: bold; color: #666; }
        .detail-value { color: #333; }
        .amount-row { margin-top: 20px; padding-top: 20px; border-top: 2px solid #4CAF50; }
        .amount { font-size: 28px; color: #4CAF50; font-weight: bold; }
        .success-badge { background-color: #4CAF50; color: white; padding: 5px 15px; border-radius: 20px; display: inline-block; margin: 10px 0; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; }
        .note { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 15px 0; border-radius: 4px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✓ Payment Successful</h1>
          <p>Your appointment has been confirmed</p>
        </div>
        
        <div class="content">
          <p>Dear ${receiptData.firstName} ${receiptData.lastName},</p>
          <p>Thank you for your payment! Your transaction has been successfully processed.</p>
          
          <div style="text-align: center;">
            <span class="success-badge">PAID</span>
          </div>
          
          <div class="receipt-details">
            <h3 style="margin-top: 0; color: #4CAF50;">Transaction Details</h3>
            
            <div class="detail-row">
              <span class="detail-label">Transaction ID: </span>
              <span class="detail-value">${receiptData.paymentId || 'N/A'}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Order ID: </span>
              <span class="detail-value">${receiptData.orderId}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Payment Method: </span>
              <span class="detail-value">${receiptData.paymentMethod || 'Online Payment'}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Transaction Date: </span>
              <span class="detail-value">${new Date(receiptData.transactionDate).toLocaleString('en-US', { 
                dateStyle: 'medium', 
                timeStyle: 'short' 
              })}</span>
            </div>
            
            <div class="amount-row">
              <div class="detail-row">
                <span class="detail-label">Amount Paid: </span>
                <span class="amount">${receiptData.currency} ${parseFloat(receiptData.amount).toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div class="receipt-details">
            <h3 style="margin-top: 0; color: #4CAF50;">Appointment Details</h3>
            
            <div class="detail-row">
              <span class="detail-label">Appointment ID: </span>
              <span class="detail-value">#${receiptData.appointmentId}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Doctor: </span>
              <span class="detail-value">${receiptData.doctorName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Date: </span>
              <span class="detail-value">${new Date(receiptData.appointmentDate).toLocaleDateString('en-US', { 
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Time: </span>
              <span class="detail-value">${receiptData.appointmentTime}</span>
            </div>
          </div>
          
          <div class="note">
            <strong>⏰ Important Reminder: </strong><br>
            Please arrive 15 minutes before your scheduled appointment time.
          </div>
          
          <p>If you have any questions or need to reschedule, please contact our support team.</p>
          <p>We look forward to seeing you!</p>
        </div>
        
        <div class="footer">
          <p>This is an automated receipt. Please do not reply to this email.</p>
          <p>&copy; ${new Date().getFullYear()} Medical Appointment System. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = generatePaymentReceiptHTML;