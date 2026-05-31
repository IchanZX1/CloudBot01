if [[ "$HOME" == "/data/data/com.termux/files/home" ]]
then
  pkg="puppeteer-core"
else
  pkg="puppeteer"
fi

npm i --no-save $pkg
