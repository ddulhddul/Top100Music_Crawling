# New Update for Webpack + Vue (190526~)



# [Music Top 100](http://mlchart.ml/song/)
URL : [http://mlchart.ml/song/](http://mlchart.ml/song/)

## Command
```linux
npm init
npm install express --save
npm install jade --save
npm install request cheerio --save
npm install urlencode --save
npm install body-parser --save
```

## get melon chart info
[https://developers.skplanetx.com/apidoc/kor/melon/chart/](https://developers.skplanetx.com/apidoc/kor/melon/chart/)

## when youtube ended
[how to control ?](http://stackoverflow.com/questions/24964232/how-to-fire-function-on-embedded-youtube-iframes-end)

## centos install
```linux
sudo yum install epel-release
sudo yum install nodejs
sudo yum install npm



git clone https://github.com/ddulhddul/Top100Music_Crawling.git youtube
```

## centos mongodb setup
[http://yakolla.tistory.com/55](http://yakolla.tistory.com/55)

```linux
$ vi /etc/yum.repos.d/mongodb.repo
    [mongodb]
    name=MongoDB Repository
    baseurl=http://downloads-distro.mongodb.org/repo/redhat/os/x86_64/
    gpgcheck=0
    enabled=1

$ yum -y install mongodb-org

$ vi /etc/yum.conf
exclude=mongodb-org,mongodb-org-server,mongodb-org-shell,mongodb-org-mongos,mongodb-org-tools

# execute
$ service mongod start
$ service mongod restart
$ service mongod stop
 
# auto excute on boot
$ chkconfig mongod on

# open firewall
$ iptables -I INPUT 1 -p tcp --dport 27017 -j ACCEPT
$ service iptables save
$ service iptables restart
```

## pm2
```linux
npm install pm2 -g
pm2 start app.js
```

## URL 포트번호 없애기 (포트포워딩) - CentOS 7
```linux
## new
iptables -t nat -I PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 3000 
service iptables save
```
```linux
## old
iptables --insert INPUT --protocol tcp --dport 80 --jump ACCEPT
iptables --insert INPUT --protocol tcp --dport 3000 --jump ACCEPT
iptables --table nat --append PREROUTING --in-interface eth0 --protocol tcp --dport 80 --jump REDIRECT --to-port 3000
service iptables save
```


## youtube end event
[http://1004lucifer.blogspot.kr/2015/04/youtube-player-api.html](http://1004lucifer.blogspot.kr/2015/04/youtube-player-api.html)