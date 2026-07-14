export const getWelcomeEmailHTML = () => `
<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: monospace; background-color: #000; color: #fff; margin: 0; padding: 20px; }
  .container { max-width: 600px; margin: 0 auto; border: 1px solid #333; padding: 30px; }
  .header { border-bottom: 1px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
  .logo { font-size: 16px; font-weight: bold; letter-spacing: 2px; }
  .content { font-family: sans-serif; font-size: 14px; line-height: 1.6; color: #ccc; }
  .title { font-family: monospace; font-size: 18px; color: #fff; text-transform: uppercase; margin-top: 0; }
  .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #333; font-size: 10px; color: #666; text-transform: uppercase; }
</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">&gt;_ OPENDECK OF THE SHRIKS</div>
    </div>
    <div class="content">
      <h2 class="title">[TRANSMISSION_ESTABLISHED]</h2>
      <p>Welcome to OpenDeck.</p>
      <p>Your subscription to our broadcast network has been confirmed. You will now receive secure, direct transmissions whenever we update our open-source wrappers, architecture materials, and system prompts.</p>
      <p>Stay tuned.</p>
    </div>
    <div class="footer">
      SYSTEM_NODE::ONLINE | ENCRYPTED_TRANSMISSION<br/>
      If you did not request this transmission, please ignore.
    </div>
  </div>
</body>
</html>
`;

export const getUpdateEmailHTML = (title, message) => `
<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: monospace; background-color: #000; color: #fff; margin: 0; padding: 20px; }
  .container { max-width: 600px; margin: 0 auto; border: 1px solid #333; padding: 30px; }
  .header { border-bottom: 1px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
  .logo { font-size: 16px; font-weight: bold; letter-spacing: 2px; }
  .content { font-family: sans-serif; font-size: 14px; line-height: 1.6; color: #ccc; }
  .title { font-family: monospace; font-size: 18px; color: #fff; text-transform: uppercase; margin-top: 0; }
  .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #333; font-size: 10px; color: #666; text-transform: uppercase; }
  .highlight { padding: 15px; border: 1px solid #333; background-color: #111; margin: 20px 0; }
</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">&gt;_ OPENDECK OF THE SHRIKS</div>
    </div>
    <div class="content">
      <h2 class="title">[SYSTEM_UPDATE_BROADCAST]</h2>
      <div class="highlight">
        <h3 style="color:#fff; margin-top:0;">${title}</h3>
        <p style="white-space: pre-wrap; font-family: monospace;">${message}</p>
      </div>
      <p>Access the OpenDeck terminal to view the latest modifications.</p>
    </div>
    <div class="footer">
      SYSTEM_NODE::ONLINE | ENCRYPTED_TRANSMISSION
    </div>
  </div>
</body>
</html>
`;
