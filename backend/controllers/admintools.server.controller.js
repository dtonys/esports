/**
 * Created by Joseph on 11/19/2015.
 */
'user strict';


var webdriver = require('selenium-webdriver'),
  By = require('selenium-webdriver').By,
  until = require('selenium-webdriver').until;

/**
 * Scrapes esportlivescore.com for infos
 */
exports.scrapeELS = function(req, res) {

  var path = 'ty_notstarted.html';

  scrapeELSPage(path);
  res.jsonp({})
};


/**
 *
 * @param path: the path for esportslivescore
 */
function scrapeELSPage(path){

  var driver = new webdriver.Builder()
    .forBrowser('firefox')
    .build();

  console.log('@@@@@@@@@@@@@@@@@@@@@ begin @@@@@@@@@@@@@@@@@@@@@');

  driver.get('http://www.esportlivescore.com/' + path)
    .then(function() {
      try {
        var tablepath = By.xpath("//div[@class='tables']/table/tbody");
        driver.wait(until.elementLocated(tablepath));
        var match_table = driver.findElement(tablepath);

        console.log('match table:' + match_table.toString());

        //var match_sections = match_table.findElements(By.xpath("//tr"));
        driver.findElements(By.xpath("//div[@class='tables']/table/tbody/tr"))
          .then(function(match_sections) {
            console.log('Numsections:' + match_sections.length);

            for(var i = 0; i < match_sections.length; i++)
            {
              scrapeELSMatch(match_sections[i]);
            }


            console.log("@@@@@@@@@@@@@@@@@@@@@ DONE @@@@@@@@@@@@@@@@@@@@@");
          });

        /*
         driver.findElement(By.name('q')).sendKeys('webdriver');
         driver.findElement(By.name('btnG')).click();
         driver.wait(until.titleIs('webdriver - eSportLiveScore.com - livescore, match results, scores, stats'), 1000);
         */

      } catch (err) {
        console.log("Error while scraping esportlivescore: " + err.message)
      }
      driver.quit();


  });

}

/**
 * Scrapes a table element and returns a json ready to be paired into our Match schema
 * @param match_element
 */
function scrapeELSMatch(match_element) {
  console.log('SCRAPE MATCH!!!!!');

  var portion_home = match_element.findElement(By.xpath("//tr[@class=' event-home-team']"));

  var go = portion_home.findElement(By.xpath("//td/class='participant-name   init-click-done']")).getText();
  console.log(go)
}


exports.blah = function(req, res) {

};
