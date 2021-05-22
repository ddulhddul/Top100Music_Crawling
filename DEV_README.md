## aws 시작 guide
1. CentOS 7 (x86_64) - with Updates HVM
    - default 값으로 instance 생성 (freetier)
2. 퍼블릭 IPv4 DNS 주소 + centos
    - centos@ + dns주소 로 연결
    - ssh -i "****.pem" centos@dns주소
    - sudo su
3. 아래의 centos install 실행
4. 아래의 mongodb 설치실패시 실행
5. 아래의 centos mongodb setup 실행
6. aws 탄력적 ip 할당 및 보안그룹 생성
    - 3000 0.0.0.0/0
    - 3000 ::/0
7. 퍼블릭 IPv4 주소 로 접속


# New Update for Webpack + Vue (190526~)



# [Music Top 100](http://mlchart.ml/)
URL : [http://mlchart.ml/](http://mlchart.ml/)

---

- [CentOS, RHEL 또는 Amazon Linux를 실행 중인 Amazon EC2 인스턴스에 대한 EPEL 리포지토리를 활성화하려면 어떻게 해야 합니까?](https://aws.amazon.com/ko/premiumsupport/knowledge-center/ec2-enable-epel/)


- [mongodb 설치실패시](https://unix.stackexchange.com/questions/369620/centos-7-yum-wont-install-mongodb)
```
sudo rm -rf /etc/yum.repos.d/mongod*
sudo yum clean all
again create repo file

sudo vi /etc/yum.repos.d/mongodb-org-3.4.repo
paste the following (notice, I'm replacing '$releasever' with 7, for my system):

[mongodb-org-3.4]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/7/mongodb-org/3.4/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-3.4.asc
then I ran this, and it was successful:

sudo yum install -y mongodb-org
```

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
sudo yum install -y epel-release
sudo yum install nodejs -y
sudo yum install npm -y
sudo yum install git -y
sudo yum install iptables -y

## 최신
sudo yum remove -y nodejs npm
curl -sL https://rpm.nodesource.com/setup_12.x | sudo -E bash -
sudo yum install nodejs -y


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

$ systemctl stop firewalld
$ systemctl mask firewalld
그런 다음 iptables-services 패키지를 설치하십시오.

$ yum install iptables-services
부팅시 서비스 활성화 :

$ systemctl enable iptables

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

## Fast and Efficient Pagination in MongoDB
[https://www.codementor.io/arpitbhayani/fast-and-efficient-pagination-in-mongodb-9095flbqr](https://www.codementor.io/arpitbhayani/fast-and-efficient-pagination-in-mongodb-9095flbqr)

## webpack production setting
```bash
$ export NODE_ENV=production
```
- pm2가 이미 실행된 상황에서 NODE_ENV 바꾸기
```bash
$ pm2 stop server.js
$ pm2 kill
$ pm2 start server.js --env production
```

## Extracting CSS based on entry
[https://webpack.js.org/plugins/mini-css-extract-plugin/](https://webpack.js.org/plugins/mini-css-extract-plugin/)

## JavaScript Standard Style
[https://standardjs.com](https://standardjs.com)

## ESLint
- [https://eslint.org/](https://eslint.org/)
- [How to setup StandardJS for Visual Studio Code - NodeJS and Type Script](https://minimaldevelop.blog/2017/05/05/how-to-setup-standardjs-for-visual-studio-code-nodejs-and-typescript/)

## Vue ESLint
- [Vue.js 공식 ESLint 플러그인 적용하기](https://medium.com/@changjoopark/vue-js-공식-eslint-플러그인-적용하기-3457ac648b05)
- [https://eslint.vuejs.org/](https://eslint.vuejs.org/)
- [https://vue-loader-v14.vuejs.org/kr/workflow/linting.html](https://vue-loader-v14.vuejs.org/kr/workflow/linting.html)
- [How to set up ES Lint for Airbnb, Vue JS and VS Code](https://medium.com/@agm1984/how-to-set-up-es-lint-for-airbnb-vue-js-and-vs-code-a5ef5ac671e8)

## eslint-plugin-vue
```bash
$ npx eslint "src/**/*.{js,vue}"
```

## VSCode ESLint
- ESLint
- StandardJS
