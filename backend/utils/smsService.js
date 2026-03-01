const twilio = require('twilio');
const SMSLog = require('../models/SMSLog');

let client = null;

const initializeTwilioClient = () => {
  if (!client && process.env.SMS_ENABLED === 'true') {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    
    if (accountSid && authToken && accountSid.startsWith('AC')) {
      client = twilio(accountSid, authToken);
    }
  }
  return client;
};

const maskPhoneNumber = (phoneNumber) => {
  if (!phoneNumber || phoneNumber.length < 4) return '****';
  return phoneNumber.slice(0, -4).replace(/\d/g, '*') + phoneNumber.slice(-4);
};

const sendSMS = async ({ phoneNumber, message, messageType, childId = null, vaccineId = null }) => {
  const logData = {
    recipient: phoneNumber,
    maskedNumber: maskPhoneNumber(phoneNumber),
    messageType,
    message,
    child: childId,
    vaccine: vaccineId,
    status: 'PENDING'
  };

  try {
    const twilioClient = initializeTwilioClient();
    
    if (process.env.SMS_ENABLED !== 'true' || !twilioClient) {
      console.log('[SMS DISABLED] Would send:', message, 'to', maskPhoneNumber(phoneNumber));
      logData.status = 'SENT';
      logData.errorMessage = 'SMS service disabled - simulation mode';
      await SMSLog.create(logData);
      return { success: true, simulated: true };
    }

    const result = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });

    logData.status = 'SENT';
    await SMSLog.create(logData);

    console.log(`[SMS SENT] ${messageType} to ${maskPhoneNumber(phoneNumber)}`);
    return { success: true, messageId: result.sid };

  } catch (error) {
    console.error('[SMS ERROR]', error.message);
    
    logData.status = 'FAILED';
    logData.errorMessage = error.message;
    await SMSLog.create(logData);

    return { success: false, error: error.message };
  }
};

const sendVaccinationReminder = async (parent, child, vaccine, doseDate) => {
  const message = `Reminder: ${child.name} is scheduled for ${vaccine.name} on ${new Date(doseDate).toLocaleDateString()}. Please visit your nearest health center. - National Immunization Portal`;
  
  return await sendSMS({
    phoneNumber: parent.phone || parent.email,
    message,
    messageType: 'VACCINATION_REMINDER',
    childId: child._id,
    vaccineId: vaccine._id
  });
};

const sendEligibilityAlert = async (parent, child, vaccine) => {
  const message = `Alert: ${child.name} is now eligible for ${vaccine.name}. Please schedule an appointment at your nearest health center. - National Immunization Portal`;
  
  return await sendSMS({
    phoneNumber: parent.phone || parent.email,
    message,
    messageType: 'ELIGIBILITY_ALERT',
    childId: child._id,
    vaccineId: vaccine._id
  });
};

const sendDoseCompletion = async (parent, child, vaccine, doseNumber) => {
  const message = `Confirmation: ${child.name} has successfully received ${vaccine.name} (Dose ${doseNumber}). Thank you for keeping your child's immunization up to date. - National Immunization Portal`;
  
  return await sendSMS({
    phoneNumber: parent.phone || parent.email,
    message,
    messageType: 'DOSE_COMPLETION',
    childId: child._id,
    vaccineId: vaccine._id
  });
};

const sendLowStockAlert = async (adminPhone, vaccineName, remainingStock) => {
  const message = `ALERT: ${vaccineName} stock is critically low (${remainingStock} remaining). Immediate restocking required. - National Immunization Portal`;
  
  return await sendSMS({
    phoneNumber: adminPhone,
    message,
    messageType: 'LOW_STOCK_ALERT'
  });
};

module.exports = {
  sendSMS,
  sendVaccinationReminder,
  sendEligibilityAlert,
  sendDoseCompletion,
  sendLowStockAlert,
  maskPhoneNumber
};
