from selenium import webdriver
import json
import time
import sys


#prints json of game if it's valid.
def scrapeELSMatch(match_element, find_winner=False):

    portion_home = match_element.find_element_by_xpath(".//tr[@class=' event-home-team']")

    #find game first.
    game_section = portion_home.find_element_by_xpath(".//td[@class='event-select  init-click-done ab-init-tooltip-done ab-init-click-done']/a")
    game_img_url = game_section.get_attribute('href')
    game_name = ""
    if game_img_url == "http://esportlivescore.com/g_dota.html":
        game_name = "DOTA2"
    elif game_img_url == "http://esportlivescore.com/g_csgo.html":
        game_name = "CSGO"
    elif game_img_url == "http://esportlivescore.com/g_leagueoflegends.html":
        game_name = "LOL"

    #if no valid game, just get out of here.
    if game_name == "":
        return

    '''
    team1name = portion_home.find_element_by_xpath("//td[@class='participant-name   init-click-done']/span/a").text

    #for some reason, this keeps thinking team2name is team1name. idk what's going on
    portion_away = match_element.find_element_by_xpath("//tr[@class=' event-away-team']")
    team2name = portion_away.find_element_by_xpath("//td[@class='participant-name   init-click-done']/span/a").text
    '''

    summary_section = portion_home.find_element_by_xpath(".//td[@class='event-time init-click-done']/a")
    matchvs = summary_section.get_attribute("title")
    matchsplit = matchvs.split('vs')
    team1name = matchsplit[0].strip()
    team2name = matchsplit[1].strip()

    #since this is hidden, it doesn't work.
    epoch_text = summary_section.find_element_by_xpath(".//span[@class='phpunixtime']").get_attribute("textContent")
    epoch = (float(epoch_text)/1000)

    #mongodb timestring looks likes: 2015-12-18T16:47:28.016Z
    matchStartTime = time.strftime('%Y-%m-%dT%H:%M:%S', time.localtime(epoch))

    tourney_name = portion_home.find_element_by_xpath(".//td[@class='init-click-done tournament-td']/a").get_attribute("href")
    tourney_name = tourney_name.replace("http://esportlivescore.com/to_", "").replace(".html", "")

    game_obj = {
              'gameName': game_name,
              'tourneyName': tourney_name,
              'outcomeNames':[team1name, team2name],
              'matchStartTime':matchStartTime
              }

    # add a result if we need to find a winner.
    if find_winner:
        homescore = int(portion_home.find_element_by_xpath(".//td[@oldtitle='score']").text)
        portion_away = match_element.find_element_by_xpath(".//tr[@class=' event-away-team']")
        awayscore = int(portion_away.find_element_by_xpath(".//td[@oldtitle='score']").text)

        if (homescore > awayscore):
            game_obj.update({'scraped_result': 1})
        elif (homescore < awayscore):
            game_obj.update({'scraped_result': 2})



    print json.dumps(game_obj)

    return

'''
'''
def scrapeELSPage(driver, path, find_winner=False):

    if (len(path) > 0):
        driver.get('http://www.esportlivescore.com/' + path)

    match_sections = driver.find_elements_by_xpath("//div[@class='tables']/table/tbody/tr")

    # if we've found none, then let's check one more time.
    if (len(match_sections) < 1):
        time.sleep(5)
        match_sections = driver.find_elements_by_xpath("//div[@class='tables']/table[1]/tbody/tr")

    # Loop through each section and scrape it.
    for i in range(0, len(match_sections)):
        scrapeELSMatch(match_sections[i], find_winner)


    return


def start_scraping(path, find_results, more_pages):

    driver = webdriver.Firefox()#webdriver.PhantomJS()

    #scrape the specified webpage
    scrapeELSPage(driver, path, find_results)

    #more pages
    while (more_pages > 0):
        #click on "next day" button
        driver.find_element_by_xpath("//li[@class='after ab-init-done']").click()

        #scrape the page. We never scrape results because going into another page goes into the future.
        scrapeELSPage(driver, "", False)

        more_pages -= 1

    driver.close()

    return

if __name__ == "__main__":
    #default

    start_path = "ty_notstarted.html"
    find_results = False
    repeats = 0

    if (len(sys.argv) > 1):
        start_path = sys.argv[1]
    if (len(sys.argv) > 2):
        find_results = (int(sys.argv[2]) > 0)
    if (len(sys.argv) > 3):
        repeats = int(sys.argv[3])

    start_scraping(start_path, find_results, repeats)
    #print 'done'