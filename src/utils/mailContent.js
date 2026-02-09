import dotenv from 'dotenv';
dotenv.config({ path: '.env.uat' });

export const authentication = {
  subject: 'Your One-Time Password (OTP) for Evolv - Lockton Customer Portal - Do not Reply!!',
  body: (otpCode) => `<p>Dear Customer,</p>
<p>We received a request to log in to the Evolv Portal.</p>
<h2>OTP: ${otpCode}</h2>
<p>This OTP is valid for <strong>2 minutes</strong> and can be used only once.</p>
<p>If you did not request this OTP, please ignore this email or contact our support team immediately.</p><p>For security reasons, please do not share your OTP with anyone.</p><p>Warm regards,</p><p>Team Evolv</p> <p>Lockton India Insurance Broking and Advisory PrivateLimited</p>`,
};

export const uploadDocClient = {
  subject: 'Claims Document Uploaded Successfully – Evolv Portal - Do not Reply!!',
  body: (claimId) =>
    `<p>Dear Customer,</p> <p>We would like to inform you that your claims document has been successfully uploaded on the Evolv Portal.</p> <p>Document Details</p> <h2>Uploaded on: ${new Date().toLocaleString()}</h2><h2>Reference ID: ${claimId}</h2><h2>Status: Submitted / Under Review</h2><p>Our team will review the submitted document andupdate you in case any additional information or actionis required from your end.</p><p>You may log in to the evolv Portal at any time to view the status of claims.</p><p>Warm regards,</p><p>Team Evolv</p> <p>Lockton India Insurance Broking and Advisory PrivateLimited</p>`,
};
export const uploadDeclaration = {
  subject: 'Declaration Uploaded Successfully – Evolv Portal - Do not Reply!!',
  body: (policyNo) => `<p>Dear Customer,</p>
<p>We would like to inform you that your declaration has
been successfully uploaded on the Evolv Portal.</p>
<p>Declaration Details</p>
<h2>Uploaded on: ${new Date().toLocaleString()}</h2><h2>Reference ID: ${policyNo}</h2>
Status: Submitted / Under Review
Our team will review the submitted declaration and
update you in case any additional information or action
is required from your end.
You may log in to the Evolv Portal at any time to view
the status or download a copy of the uploaded
declaration.
Warm Regards,
Team Evolv
Lockton India Insurance Broking and Advisory Private
Limited`,
};

export const rmCallbackRequest = {
  subject:
    'We’ve received your request – Our Relationship Manager will call you shortly - Do not Reply!!',
  body: (requestId, userName) =>
    `<p>Dear ${userName}</p>,
<p>Thank you for reaching out to us.
We have received your request for a call back. Your
Relationship Manager will get in touch with you shortly
to assist you with your query</p>.
<p>Request details:</p>
<ul>
<li>Request ID: ${requestId}</li>
<li>Date & Time of Request: ${new Date().toLocaleString()}</li>
</ul>
<p>If you need immediate assistance, you can reply to this
email.
We appreciate your trust in us and look forward to
assisting you.</p>
<p>
Warm Regards,</p>
<p>Team Evolv</p>
<p>
Lockton India Insurance Broking and Advisory Private
Limited </p
`,
};

export const faqRmNotification = {
  subject: 'We’ve received your query – Our team is reviewing it - Do not Reply!!',
  body: (requestId, userName, companyName) =>
    `<p>Dear ${userName},</p>
<p>
Thank you for reaching out to us.
We have received your query/clarification request and
our team is currently reviewing the details. We will get
back to you shortly with the required information or
assistance.</p>
<p>
Reference details:</p>
<ul>
<li>Reference ID: ${requestId}</li>
<li>Date & Time: ${new Date().toLocaleString()}</li>
</ul>
<p>If you have any additional information to share in the
meantime, please feel free to reply to this email.
We appreciate your patience and thank you for
choosing ${companyName}.</p>
<p>
Warm Regards,</p>
<p>Team Evolv</p>
<p>
Lockton India Insurance Broking and Advisory Private
Limited</p>
`,
};
export const userCreated = {
  subject:
    "User ID Created – OTP-Based Access to Evolv - (Lockton's Customer Portal) - Do not Reply!!",
  body: ({
    fullName,
    username,
    portalUrl = process.env.PORTAL_URL || 'https://portal.example.com',
    supportEmail = process.env.SUPPORT_EMAIL || 'evolv.support@lockton-India.com',
  }) => `
    <p>Dear ${fullName || 'User'},</p>
    <p>We are pleased to inform you that your User ID has been successfully created for access to Evolv (Lockton Customer Portal).</p>
    <h3>Portal Details:</h3>
    <ul>
      <li>Portal URL: <a href="${portalUrl}">${portalUrl}</a></li>
      <li>Username: ${username}</li>
      <li>Authentication Method: One-Time Password (OTP)</li>
    </ul>
    <p>For any access-related assistance, please contact <a href="mailto:${supportEmail}">${supportEmail}</a>.</p>
    <p>Regards,<br/>Lockton India Insurance Brokers & Advisory Limited</p>
    <p><small>This is a system-generated email. Please do not reply.</small></p>
  `,
};
