<?php

$ch = curl_init();
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_HEADER, 0);		//表示需要response header
curl_setopt($ch, CURLOPT_URL, "https://www.kitkatevent.com.tw/fb_share2?img_url=fb_3a0f0c460496fcf31270f21f38380843.jpg");
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 1);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 1);
$result = curl_exec($ch);
curl_error($ch);
curl_close($ch);

echo htmlspecialchars($result);