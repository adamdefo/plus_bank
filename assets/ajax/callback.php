<?php

$mail_body = '';

// if(isset($_POST['name'])) {
//     $mail_body .= '<b>Имя отправителя:</b> ' . $_POST['name'] . '<br/><br/>';
// }

// if(isset($_POST['phone'])) {
//     $mail_body .= '<b>Контактный телефон:</b> ' . $_POST['phone'] . '<br/><br/>';
// }

// $mail_body .= '======================================<br/><br/>' . 'На это письмо не надо отвечать.';

// $email_to = 'maylo.kondratev@yandex.ru';
// $subject = 'Заявка на обратный звонок';
// $header = "From: Test Landing <maylo.kondratev@yandex.ru>\r\nContent-type: text/html; charset=windows-1251 \r\n";
// $body = $mail_body;

// $subject = iconv('UTF-8', 'CP1251', $subject);
// $header = iconv('UTF-8', 'CP1251', $header);
// $body = iconv('UTF-8', 'CP1251', $body);

// mail($email_to, $subject, $body, $header);

echo json_encode('success');