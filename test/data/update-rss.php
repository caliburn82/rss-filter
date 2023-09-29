<?php
$feed = file_get_contents('https://crunchyroll.com/rss/anime');
file_put_contents('rss.xml', $feed);
