<?php

if($_POST["submit"]) {
    $recipient="saurabhd2511@gmail.com";
    $subject=$_POST["subject"];
    $sender=$_POST["sender"];
    $senderEmail=$_POST["senderEmail"];
    $message=$_POST["message"];

    $mailBody="Name: $sender\nEmail: $senderEmail\n\n$message";

    mail($recipient, $subject, $mailBody, "From: $sender <$senderEmail>");

    $thankYou="<p>Thank you! Your message has been sent.</p>";
}

?>

<!DOCTYPE html>

<html>
<head>
    <meta charset="utf-8">
    <title>Contact form to email</title>
</head>

<body>

    <?=$thankYou ?>
<form action="./bin/contact_me.php" method="POST">
          <input name="sender" type="text" placeholder="Name" required="" />
          <input name="subject" type="text" placeholder="Subject" required=""/>
          <input name="senderEmail" type="text" placeholder="Email" required=""/>
        <!-- </div>
        <div class="text"> -->
          <textarea name="message" placeholder="Message" required=""></textarea>
       <!--  </div>
        <div class="text-but">
          -->
          <input name="submit" type="submit" value="submit" />
      </form>
  </body>
  </html>