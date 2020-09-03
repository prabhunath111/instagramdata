const puppeteer = require('puppeteer');

(async () => {
    // set some options (set headless to false so we can see 
    // this automated browsing experience)
    let launchOptions = { headless: true, args: ["--no-sandbox", "--disable-setuid-sandbox"], silent: true };

    const browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();

    // set viewport and user agent (just in case for nice viewing)
    await page.setViewport({width: 1366, height: 768});
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');

    // go to Instagram web profile (this example use Cristiano Ronaldo profile)
    await page.goto('https://instagram.com/prabhu_india');

    // check username exists or not exists
    let isUsernameNotFound = await page.evaluate(() => {
        // check selector exists
        if(document.getElementsByTagName('h2')[0]) {
            // check selector text content
            if(document.getElementsByTagName('h2')[0].textContent == "Sorry, this page isn't available.") {
                return true;
            }
        }
    });

    if(isUsernameNotFound) {
        console.log('Account not exists!');

        // close browser
        await browser.close();
        return;
    }

    // get username
    let userdata = await page.evaluate(() => {      

        if(window["_sharedData"].entry_data.ProfilePage){
            return window["_sharedData"].entry_data.ProfilePage[0].graphql;
        }
        else return window.location.href;
    });

    let pageUrl = await page.evaluate(() => {
        return window.location.href;
    })

    // display the result to console
    console.log({ userdata,
                    pageUrl
            
                });

    // close the browser
    await browser.close();
})();