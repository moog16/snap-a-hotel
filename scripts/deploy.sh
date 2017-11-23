git pull;
yarn;
yarn build;
cd /usr/share/nginx/snapit.live/;
rm -rf *;
cp -rf ./build/ /usr/share/nginx/snapit.live/;
