export const getWelcomeEmailHTML = () => `
<!DOCTYPE html>
<html>
<head>
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
<style>
  body { font-family: monospace; background-color: #000000 !important; color: #ffffff !important; margin: 0; padding: 0; }
  .logo { font-size: 16px; font-weight: bold; letter-spacing: 2px; }
  .content { font-family: sans-serif; font-size: 14px; line-height: 1.6; color: #cccccc; }
  .title { font-family: monospace; font-size: 18px; color: #ffffff; text-transform: uppercase; margin-top: 0; }
  .footer { font-size: 10px; color: #666666; text-transform: uppercase; }
</style>
</head>
<body style="background-color: #000000; color: #ffffff; margin: 0; padding: 0;">
  <table width="100%" bgcolor="#000000" cellpadding="0" cellspacing="0" border="0" style="background-color: #000000; width: 100%;">
    <tr>
      <td align="center" style="padding: 20px;">
        <table width="600" cellpadding="30" cellspacing="0" border="0" style="max-width: 600px; width: 100%; border: 1px solid #333333; background-color: #000000;">
          <tr>
            <td style="border-bottom: 1px solid #333333; padding-bottom: 20px;">
              <div class="logo" style="color: #ffffff;">&gt;_ OPENDECK OF THE SHRIKS</div>
            </td>
          </tr>
          <tr>
            <td class="content" style="padding-top: 20px; padding-bottom: 30px;">
              <h2 class="title" style="color: #ffffff;">[TRANSMISSION_ESTABLISHED]</h2>
              <p style="color: #cccccc;">Welcome to OpenDeck.</p>
              <p style="color: #cccccc;">Your subscription to our broadcast network has been confirmed. You will now receive secure, direct transmissions whenever we update our open-source wrappers, architecture materials, and system prompts.</p>
              <p style="color: #cccccc;">Stay tuned.</p>
            </td>
          </tr>
          <tr>
            <td class="footer" style="border-top: 1px solid #333333; padding-top: 20px;">
              <span style="color: #666666;">SYSTEM_NODE::ONLINE | ENCRYPTED_TRANSMISSION<br/>
              If you did not request this transmission, please ignore.</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export const getUpdateEmailHTML = (title, message) => `
<!DOCTYPE html>
<html>
<head>
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
<style>
  body { font-family: monospace; background-color: #000000 !important; color: #ffffff !important; margin: 0; padding: 0; }
  .logo { font-size: 16px; font-weight: bold; letter-spacing: 2px; }
  .content { font-family: sans-serif; font-size: 14px; line-height: 1.6; color: #cccccc; }
  .title { font-family: monospace; font-size: 18px; color: #ffffff; text-transform: uppercase; margin-top: 0; }
  .footer { font-size: 10px; color: #666666; text-transform: uppercase; }
  .highlight { padding: 15px; border: 1px solid #333333; background-color: #111111; margin: 20px 0; }
</style>
</head>
<body style="background-color: #000000; color: #ffffff; margin: 0; padding: 0;">
  <table width="100%" bgcolor="#000000" cellpadding="0" cellspacing="0" border="0" style="background-color: #000000; width: 100%;">
    <tr>
      <td align="center" style="padding: 20px;">
        <table width="600" cellpadding="30" cellspacing="0" border="0" style="max-width: 600px; width: 100%; border: 1px solid #333333; background-color: #000000;">
          <tr>
            <td style="border-bottom: 1px solid #333333; padding-bottom: 20px;">
              <div class="logo" style="color: #ffffff;">&gt;_ OPENDECK OF THE SHRIKS</div>
            </td>
          </tr>
          <tr>
            <td class="content" style="padding-top: 20px; padding-bottom: 30px;">
              <h2 class="title" style="color: #ffffff;">[SYSTEM_UPDATE_BROADCAST]</h2>
              <div class="highlight" style="padding: 15px; border: 1px solid #333333; background-color: #111111; margin: 20px 0;">
                <h3 style="color:#ffffff; margin-top:0;">${title}</h3>
                <p style="white-space: pre-wrap; font-family: monospace; color: #cccccc;">${message}</p>
              </div>
              <p style="color: #cccccc;">Access the OpenDeck terminal to view the latest modifications.</p>
            </td>
          </tr>
          <tr>
            <td class="footer" style="border-top: 1px solid #333333; padding-top: 20px;">
              <span style="color: #666666;">SYSTEM_NODE::ONLINE | ENCRYPTED_TRANSMISSION</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
