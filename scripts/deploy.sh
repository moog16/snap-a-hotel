git pull;
yarn;
yarn build;
cd /usr/share/nginx/snapit.live/;
rm -rf *;
cp -rf /home/snap-a-hotel/build/ /usr/share/nginx/snapit.live/;
