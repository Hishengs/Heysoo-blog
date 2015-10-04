<?php
//get random str of $bit bits
    function get_random_str($bit){
        $str="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        $key = "";
        for($i=0;$i<$bit;$i++)
          $key .= $str{mt_rand(0,32)};    
        return $key;
    }

//count str length,include english,chinese,number,punctuation str length,etc
    function str_length($str){
      $str = strip_tags(preg_replace("@\s@is",'',$str));//remove spacing,newline and html tags
      $str = str_replace('&nbsp;', '', $str);//remove 'spacing' of html
      preg_match_all("/[0-9]{1}/",$str,$num);  
      preg_match_all("/[a-zA-Z]{1}/",$str,$en);  
      $length = strlen(preg_replace('/[\x00-\x7F]/', '', $str));
      $cn = intval($length / 3);//length of Chinese str
      $en = count($en[0]);//length of English str
      $num = count($num[0]);//length of number
      $total_bytes = strlen($str);//total bytes
      $en_punctuation = $total_bytes - ($cn*3 + $en + $num);//the other un-Chinese punctuation str
      $total_strs = $cn + $en + $num + $en_punctuation;//total str
      return array('total_bytes'=>$total_bytes,'total_strs'=>$total_strs,'cn'=>$cn,'en'=>$en,'num'=>$num,'en_punctuation'=>$en_punctuation);
    }
    /*get client ip*/
    function get_user_ip(){
      global $ip;
      if (getenv("HTTP_CLIENT_IP"))
      $ip = getenv("HTTP_CLIENT_IP");
      else if(getenv("HTTP_X_FORWARDED_FOR"))
      $ip = getenv("HTTP_X_FORWARDED_FOR");
      else if(getenv("REMOTE_ADDR"))
      $ip = getenv("REMOTE_ADDR");
      else $ip = "0.0.0.0";
      return $ip;
    }
    /*get user city by ip*/
    function get_user_city($ip = ''){
        if(empty($ip)){
            $ip = get_user_ip();
        }
        $res = @file_get_contents('http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js&ip=' . $ip);
        if(empty($res)){ return false; }
        $jsonMatches = array();
        preg_match('#\{.+?\}#', $res, $jsonMatches);
        if(!isset($jsonMatches[0])){ return false; }
        $json = json_decode($jsonMatches[0], true);
        if(isset($json['ret']) && $json['ret'] == 1){
            $json['ip'] = $ip;
            unset($json['ret']);
        }else{
            return false;
        }
        return $json['city'];
    }
    function get_location_info(){
      $ak = C('BAIDU_MAP_API_AK');
      $ip = get_user_ip();
      $url = "http://api.map.baidu.com/location/ip?ak=".$ak."&ip=".$ip;
      $res = @file_get_contents($url);
      $res = json_decode($res,true);
      return $res;
    }
