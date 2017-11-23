git pull;
yarn;
yarn build;
rm -rf /usr/share/nginx/snapit.live/;
cp -rf ./build/ /usr/share/nginx/snapit.live/;
